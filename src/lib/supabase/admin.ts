import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerUrl } from "./env";

function isNewSecretApiKey(key: string) {
  return key.startsWith("sb_secret_");
}

/**
 * Claves sb_secret_ no son JWT: Supabase rechaza Authorization: Bearer con ellas.
 * fetchWithAuth las añade; este fetch las quita y deja solo apikey.
 */
function createSecretKeyFetch(serviceRole: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    headers.delete("Authorization");
    headers.set("apikey", serviceRole);
    return fetch(input, { ...init, headers });
  };
}

export function createAdminClient(): SupabaseClient | null {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRole) {
    return null;
  }

  const supabaseUrl = getSupabaseServerUrl();
  if (!supabaseUrl) {
    return null;
  }

  const usesNewSecretKey = isNewSecretApiKey(serviceRole);

  return createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: usesNewSecretKey
      ? { fetch: createSecretKeyFetch(serviceRole) }
      : undefined,
  });
}

import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";

export function createAdminClient() {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!serviceRole) {
    return null;
  }

  return createClient(getSupabaseUrl(), serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

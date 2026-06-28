import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServerUrl } from "./env";

/**
 * PostgREST en este proyecto rechaza Bearer con service_role (403 sin GRANT).
 * Solo apikey funciona (probado en scripts/probe-supabase-admin.mjs).
 */
function createAdminFetch(serviceRole: string): typeof fetch {
  return async (input, init) => {
    const headers = new Headers(init?.headers);
    headers.delete("Authorization");
    headers.set("apikey", serviceRole);
    return fetch(input, { ...init, headers });
  };
}

export function formatSupabaseError(error: unknown): string {
  if (!error) return "Error desconocido de Supabase";
  if (typeof error === "string") return error.trim() || "Error desconocido de Supabase";

  if (error instanceof Error) {
    const extra = error as Error & {
      details?: string;
      hint?: string;
      code?: string;
    };
    const parts: string[] = [];
    if (error.message?.trim()) parts.push(error.message.trim());
    if (extra.details?.trim()) parts.push(`details: ${extra.details.trim()}`);
    if (extra.hint?.trim()) parts.push(`hint: ${extra.hint.trim()}`);
    if (extra.code?.trim()) parts.push(`code: ${extra.code.trim()}`);
    if (parts.length) return parts.join(" · ");
  }

  if (typeof error === "object") {
    const record = error as Record<string, unknown>;
    const parts: string[] = [];
    for (const key of [
      "message",
      "details",
      "hint",
      "code",
      "status",
      "statusText",
    ] as const) {
      const value = record[key];
      if (typeof value === "string" && value.trim()) {
        parts.push(`${key}: ${value.trim()}`);
      } else if (typeof value === "number") {
        parts.push(`${key}: ${value}`);
      }
    }
    if (parts.length) return parts.join(" · ");
    try {
      const json = JSON.stringify(error);
      if (json && json !== "{}") return json;
    } catch {
      // ignore
    }
  }

  return "Error desconocido de Supabase";
}

/** Probe REST directo (solo header apikey). */
export async function probeProfilesRest(): Promise<
  { ok: true; count: number } | { ok: false; error: string }
> {
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  const supabaseUrl = getSupabaseServerUrl();
  if (!serviceRole || !supabaseUrl) {
    return { ok: false, error: "Falta SUPABASE_SERVICE_ROLE_KEY o URL de Supabase" };
  }

  const base = supabaseUrl.replace(/\/$/, "");
  const headers: Record<string, string> = {
    apikey: serviceRole,
    Prefer: "count=exact",
  };

  try {
    const res = await fetch(`${base}/rest/v1/profiles?select=id`, {
      method: "HEAD",
      headers,
    });

    if (!res.ok) {
      let body = "";
      try {
        body = (await res.text()).trim();
      } catch {
        // ignore
      }
      const parts = [
        `HTTP ${res.status}`,
        res.statusText?.trim(),
        body ? `body: ${body.slice(0, 200)}` : "",
      ].filter(Boolean);
      return { ok: false, error: parts.join(" · ") };
    }

    const countHeader = res.headers.get("content-range");
    const count = countHeader
      ? Number.parseInt(countHeader.split("/").pop() ?? "0", 10)
      : 0;

    return { ok: true, count: Number.isFinite(count) ? count : 0 };
  } catch (cause) {
    return {
      ok: false,
      error: formatSupabaseError(cause),
    };
  }
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

  return createClient(supabaseUrl, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: createAdminFetch(serviceRole) },
  });
}

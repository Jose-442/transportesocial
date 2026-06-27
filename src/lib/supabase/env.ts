export function getSupabaseUrl() {
  return process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
}

/** URL en runtime para cliente admin/servidor (sin env nuevo en Vercel). */
export function getSupabaseServerUrl() {
  return (
    process.env.SUPABASE_URL?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    ""
  );
}

export function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

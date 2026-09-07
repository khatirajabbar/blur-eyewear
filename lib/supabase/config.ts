export function getSupabasePublicConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return { url, key };
}

export function isSupabaseConfigured() {
  const { url, key } = getSupabasePublicConfig();
  return Boolean(url && key);
}

export function requireSupabasePublicConfig() {
  const { url, key } = getSupabasePublicConfig();
  if (!url || !key) throw new Error("Supabase is not configured.");
  return { url, key };
}

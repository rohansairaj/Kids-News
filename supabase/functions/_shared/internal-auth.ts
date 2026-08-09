import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

/**
 * Returns the shared internal secret used by scheduled jobs to authenticate
 * themselves against internal-only edge functions.
 */
export async function getInternalSecret(
  supabase: ReturnType<typeof createClient>,
): Promise<string | null> {
  const { data, error } = await supabase
    .from("internal_config")
    .select("value")
    .eq("key", "cron_secret")
    .maybeSingle();
  if (error || !data) return null;
  return (data as { value: string }).value;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Authorizes the request. Only callers presenting the internal secret
 * (scheduled jobs / trusted server-side callers) are allowed.
 */
export async function isInternalCaller(
  req: Request,
  supabase: ReturnType<typeof createClient>,
): Promise<boolean> {
  const provided = req.headers.get("x-internal-secret");
  if (!provided) return false;
  const expected = await getInternalSecret(supabase);
  if (!expected) return false;
  return timingSafeEqual(provided, expected);
}

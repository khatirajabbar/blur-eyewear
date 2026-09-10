import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MAX_RECENT_SIGN_IN_AGE_MS = 10 * 60 * 1000;

function accountError(status: number) {
  return NextResponse.json({ error: "Account action could not be completed." }, { status });
}

function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL?.trim();
    const trustedOrigin = configuredOrigin ? new URL(configuredOrigin).origin : new URL(request.url).origin;
    return origin === trustedOrigin;
  } catch {
    return false;
  }
}

function hasDeleteConfirmation(value: unknown): value is { confirmation: "DELETE" } {
  return Boolean(value) && typeof value === "object" && (value as { confirmation?: unknown }).confirmation === "DELETE";
}

export async function DELETE(request: Request) {
  if (!isSupabaseConfigured()) return accountError(503);
  if (!hasTrustedOrigin(request)) return accountError(403);
  if (!request.headers.get("content-type")?.includes("application/json")) return accountError(415);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return accountError(400);
  }

  if (!hasDeleteConfirmation(payload)) return accountError(400);

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) return accountError(401);

    const signedInAt = user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : Number.NaN;
    const signInAge = Date.now() - signedInAt;
    if (!Number.isFinite(signedInAt) || signInAge < 0 || signInAge > MAX_RECENT_SIGN_IN_AGE_MS) {
      return accountError(401);
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) return accountError(503);
    if (profile?.role === "admin") return accountError(403);

    // A soft delete removes account access while retaining test-order records.
    const admin = createSupabaseAdminClient();
    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id, true);
    if (deleteError) {
      console.error("Unable to delete the authenticated BLUR account", deleteError);
      return accountError(503);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unable to process BLUR account deletion", error);
    return accountError(503);
  }
}

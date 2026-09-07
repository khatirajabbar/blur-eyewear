import { NextResponse } from "next/server";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function statusError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function isCheckoutSessionId(value: string | null): value is string {
  return typeof value === "string" && /^cs_[A-Za-z0-9_]+$/.test(value);
}

export async function GET(request: Request) {
  if (!isSupabaseConfigured()) {
    return statusError("Account checkout is not configured yet.", 503);
  }

  if (!isStripeConfigured()) {
    return statusError("Test checkout is not configured yet.", 503);
  }

  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!isCheckoutSessionId(sessionId)) {
    return statusError("The checkout reference is invalid.", 400);
  }

  let userId: string;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return statusError("Please sign in to view this checkout.", 401);
    }

    userId = user.id;
  } catch (error) {
    console.error("Unable to verify the Supabase checkout session", error);
    return statusError("Account checkout is temporarily unavailable. Please try again.", 503);
  }

  try {
    const session = await getStripe().checkout.sessions.retrieve(sessionId);

    // Avoid turning the endpoint into a way to probe other customers' sessions.
    if (session.client_reference_id !== userId) {
      return statusError("This checkout could not be found.", 404);
    }

    return NextResponse.json({
      paid: session.payment_status === "paid",
      status: session.status,
      amountTotal: session.amount_total,
      currency: session.currency,
    });
  } catch (error) {
    console.error("Unable to retrieve the Stripe Checkout session", error);
    return statusError("This checkout could not be found.", 404);
  }
}

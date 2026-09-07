import { NextResponse } from "next/server";
import { checkoutMetadata, validateCheckoutCart } from "@/lib/checkout";
import { isStripeConfigured, getStripe } from "@/lib/stripe";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function checkoutError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function getApplicationOrigin(request: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

  if (configuredUrl) {
    const parsed = new URL(configuredUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      throw new Error("The store URL is invalid.");
    }

    return parsed.origin;
  }

  // Do not trust a request Host header when generating a production payment link.
  if (process.env.NODE_ENV === "production") {
    throw new Error("The deployed store URL has not been configured.");
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return checkoutError("Account checkout is not configured yet.", 503);
  }

  if (!isStripeConfigured()) {
    return checkoutError("Test checkout is not configured yet.", 503);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return checkoutError("Your cart could not be read. Please refresh and try again.", 400);
  }

  const cart = validateCheckoutCart(payload);
  if (!cart.success) {
    return checkoutError(cart.message, 400);
  }

  let userId: string;
  let userEmail: string | undefined;

  try {
    const supabase = await createSupabaseServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return checkoutError("Please sign in before starting checkout.", 401);
    }

    userId = user.id;
    userEmail = user.email ?? undefined;
  } catch (error) {
    console.error("Unable to verify the Supabase checkout session", error);
    return checkoutError("Account checkout is temporarily unavailable. Please try again.", 503);
  }

  let applicationOrigin: string;

  try {
    applicationOrigin = getApplicationOrigin(request);
  } catch {
    return checkoutError("Checkout is not configured for this site yet.", 503);
  }

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: userEmail,
      client_reference_id: userId,
      line_items: cart.lines.map(({ product, quantity, unitAmount }) => ({
        quantity,
        price_data: {
          currency: "usd",
          unit_amount: unitAmount,
          product_data: {
            name: product.name,
            description: product.description,
            metadata: {
              product_id: product.id,
              product_code: product.code,
            },
          },
        },
      })),
      success_url: `${applicationOrigin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${applicationOrigin}/cart?checkout=cancelled`,
      metadata: {
        user_id: userId,
        cart: checkoutMetadata(cart.lines),
      },
    });

    if (!session.url) {
      return checkoutError("Checkout could not be started. Please try again.", 502);
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Unable to create the Stripe Checkout session", error);
    return checkoutError("Checkout could not be started. Please try again.", 502);
  }
}

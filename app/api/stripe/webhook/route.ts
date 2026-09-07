import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { validateCheckoutMetadata } from "@/lib/checkout";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripe, getStripeWebhookSecret, isStripeConfigured } from "@/lib/stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function paymentIntentId(session: Stripe.Checkout.Session) {
  if (typeof session.payment_intent === "string") return session.payment_intent;
  return session.payment_intent?.id ?? null;
}

type OrderLineSnapshot = {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unitAmount: number;
};

async function paidLineItemSnapshots(session: Stripe.Checkout.Session, cart: Extract<ReturnType<typeof validateCheckoutMetadata>, { success: true }>) {
  const lineItems = await getStripe().checkout.sessions.listLineItems(session.id, {
    limit: 100,
    expand: ["data.price.product"],
  });
  const snapshots = new Map<string, OrderLineSnapshot>();

  for (const lineItem of lineItems.data) {
    const stripeProduct = lineItem.price?.product;
    const metadata = typeof stripeProduct === "object" && stripeProduct && "metadata" in stripeProduct
      ? stripeProduct.metadata
      : undefined;
    const productId = metadata?.product_id;
    const productCode = metadata?.product_code;
    const quantity = lineItem.quantity ?? 0;
    const unitAmount = lineItem.price?.unit_amount ?? (quantity > 0 ? Math.round(lineItem.amount_subtotal / quantity) : null);

    if (!productId || !productCode || quantity <= 0 || unitAmount === null || !lineItem.description) continue;

    snapshots.set(productId, {
      productId,
      productCode,
      productName: lineItem.description,
      quantity,
      unitAmount,
    });
  }

  // The current catalogue remains only as a safe fallback for a malformed or
  // older Checkout event. Normal webhook records use Stripe's paid snapshot.
  return cart.lines.map((line) => snapshots.get(line.productId) ?? ({
    productId: line.productId,
    productCode: line.product.code,
    productName: line.product.name,
    quantity: line.quantity,
    unitAmount: line.unitAmount,
  }));
}

async function recordPaidCheckout(session: Stripe.Checkout.Session) {
  if (session.payment_status !== "paid") return;

  const userId = session.client_reference_id;
  const cart = validateCheckoutMetadata(session.metadata?.cart);

  if (!userId || !cart.success) {
    throw new Error("The paid Checkout session is missing fulfilment details.");
  }

  const lineSnapshots = await paidLineItemSnapshots(session, cart);

  const admin = createSupabaseAdminClient();
  const { data: order, error: orderError } = await admin
    .from("orders")
    .upsert({
      stripe_checkout_session_id: session.id,
      stripe_payment_intent_id: paymentIntentId(session),
      user_id: userId,
      email: session.customer_details?.email ?? session.customer_email ?? null,
      status: "paid",
      currency: session.currency ?? "usd",
      amount_total: session.amount_total,
      cart: lineSnapshots.map(({ productId, quantity }) => ({ productId, quantity })),
      paid_at: new Date().toISOString(),
    }, { onConflict: "stripe_checkout_session_id" })
    .select("id")
    .single();

  if (orderError || !order) {
    throw new Error("The paid Checkout session could not be stored.");
  }

  const { error: deleteError } = await admin.from("order_items").delete().eq("order_id", order.id);
  if (deleteError) {
    throw new Error("The paid Checkout line items could not be refreshed.");
  }

  const { error: itemsError } = await admin.from("order_items").insert(
    lineSnapshots.map(({ productId, productCode, productName, quantity, unitAmount }) => ({
      order_id: order.id,
      product_id: productId,
      product_code: productCode,
      product_name: productName,
      quantity,
      unit_amount: unitAmount,
    })),
  );

  if (itemsError) {
    throw new Error("The paid Checkout line items could not be stored.");
  }
}

export async function POST(request: Request) {
  if (!isStripeConfigured()) {
    return NextResponse.json({ message: "Stripe test checkout is not configured yet." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ message: "Missing Stripe signature." }, { status: 400 });
  }

  let event: Stripe.Event;
  let webhookSecret: string;

  try {
    webhookSecret = getStripeWebhookSecret();
  } catch {
    return NextResponse.json({ message: "Stripe webhook verification is not configured yet." }, { status: 503 });
  }

  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      webhookSecret,
    );
  } catch (error) {
    console.error("Stripe webhook verification failed", error);
    return NextResponse.json({ message: "Invalid Stripe signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed" && event.type !== "checkout.session.async_payment_succeeded") {
    return NextResponse.json({ received: true });
  }

  try {
    await recordPaidCheckout(event.data.object as Stripe.Checkout.Session);
    return NextResponse.json({ received: true });
  } catch (error) {
    // A 500 tells Stripe to retry an event if the database is temporarily unavailable.
    console.error("Stripe webhook fulfilment failed", error);
    return NextResponse.json({ message: "Checkout fulfilment could not be recorded." }, { status: 500 });
  }
}

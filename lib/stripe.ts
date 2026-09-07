import "server-only";

import Stripe from "stripe";

const testKeyPrefix = "sk_test_";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.startsWith(testKeyPrefix));
}

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey?.startsWith(testKeyPrefix)) {
    throw new Error("Stripe test mode is not configured.");
  }

  return new Stripe(secretKey, {
    appInfo: {
      name: "BLUR Eyewear",
    },
  });
}

export function getStripeWebhookSecret() {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret?.startsWith("whsec_")) {
    throw new Error("Stripe webhook verification is not configured.");
  }

  return webhookSecret;
}

import Stripe from "stripe";

/** Stripe is provisioned but disabled until store settings enable it. */
export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

export function isStripeEnabled(settingsStripeEnabled?: boolean) {
  const envFlag = process.env.NEXT_PUBLIC_STRIPE_ENABLED === "true";
  return envFlag || Boolean(settingsStripeEnabled);
}

export function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
}

export function getStripePublishableKey() {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
}

/**
 * Future: create a PaymentIntent when Stripe is enabled.
 * For now returns null — purchase requests use contact flow.
 */
export async function createPaymentIntent(
  amountCents: number,
  metadata: Record<string, string>,
) {
  if (!isStripeConfigured()) return null;

  const stripe = getStripeClient();
  return stripe.paymentIntents.create({
    amount: amountCents,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
    metadata,
  });
}

import { getStripeClient, isStripeConfigured } from "@/lib/stripe/index";
import { NextResponse } from "next/server";

/**
 * Stripe webhook handler — provisioned for future enablement.
 * Configure STRIPE_WEBHOOK_SECRET and point Stripe dashboard to /api/webhooks/stripe
 */
export async function POST(request: Request) {
  if (!isStripeConfigured() || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Stripe webhooks not configured" }, { status: 503 });
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const stripe = getStripeClient();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    switch (event.type) {
      case "payment_intent.succeeded":
        // TODO: mark order as paid when Stripe is enabled
        break;
      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Webhook error";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

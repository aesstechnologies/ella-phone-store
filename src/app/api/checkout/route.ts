import { getStoreSettings } from "@/lib/data/queries";
import {
  createPaymentIntent,
  getStripePublishableKey,
  isStripeEnabled,
} from "@/lib/stripe/index";
import { NextResponse } from "next/server";
import { z } from "zod";

const checkoutSchema = z.object({
  amount: z.number().positive(),
  productId: z.string(),
  customerEmail: z.string().email(),
});

/**
 * Stripe checkout placeholder — returns client secret when enabled.
 * Currently disabled; purchase flow uses /api/orders contact request.
 */
export async function POST(request: Request) {
  const settings = await getStoreSettings();

  if (!isStripeEnabled(settings.stripe_enabled)) {
    return NextResponse.json(
      {
        enabled: false,
        message: "Stripe is not enabled. Use request purchase flow.",
      },
      { status: 503 },
    );
  }

  const body = await request.json();
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const intent = await createPaymentIntent(
    Math.round(parsed.data.amount * 100),
    {
      productId: parsed.data.productId,
      customerEmail: parsed.data.customerEmail,
    },
  );

  return NextResponse.json({
    enabled: true,
    clientSecret: intent?.client_secret,
    publishableKey: getStripePublishableKey(),
  });
}

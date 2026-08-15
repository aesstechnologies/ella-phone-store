import { createClientOrNull } from "@/lib/supabase/server";
import { createPaymentIntent, isStripeEnabled } from "@/lib/stripe/index";
import { getStoreSettings } from "@/lib/data/queries";
import { NextResponse } from "next/server";
import { z } from "zod";

const orderSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  fulfillmentType: z.enum(["pickup", "store_delivery", "delivery_service"]),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  deliveryAddress: z.record(z.string(), z.string()).optional(),
  notes: z.string().optional(),
  totalAmount: z.number().positive(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = orderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const data = parsed.data;
  const supabase = await createClientOrNull();
  const settings = await getStoreSettings();

  let userId: string | null = null;
  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    userId = user?.id ?? null;
  }

  let stripePaymentIntentId: string | null = null;

  if (isStripeEnabled(settings.stripe_enabled)) {
    const intent = await createPaymentIntent(
      Math.round(data.totalAmount * 100),
      { productId: data.productId, customerEmail: data.customerEmail },
    );
    stripePaymentIntentId = intent?.id ?? null;
  }

  if (supabase) {
    const { error } = await supabase.from("orders").insert({
      user_id: userId,
      product_id: data.productId,
      variant_id: data.variantId ?? null,
      fulfillment_type: data.fulfillmentType,
      customer_name: data.customerName,
      customer_email: data.customerEmail,
      customer_phone: data.customerPhone ?? null,
      delivery_address: data.deliveryAddress ?? null,
      notes: data.notes ?? null,
      total_amount: data.totalAmount,
      stripe_payment_intent_id: stripePaymentIntentId,
      status: "pending",
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({
    ok: true,
    message: "Purchase request received. We will contact you shortly.",
    stripePaymentIntentId,
  });
}

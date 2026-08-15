"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import {
  calculateMonthlyPrice,
  calculateVariantPrice,
  getProductDescription,
  getProductName,
} from "@/lib/data/seed";
import { cn, formatPrice } from "@/lib/utils";
import { isStripeEnabled } from "@/lib/stripe/index";
import type {
  FulfillmentType,
  Product,
  ProductVariant,
  StoreSettings,
} from "@/types/database";
import {
  MapPin,
  Package,
  ShoppingBag,
  Store,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

export function ProductConfigurator({
  product,
  settings,
  locale,
}: {
  product: Product;
  settings: StoreSettings;
  locale: string;
}) {
  const t = useTranslations("product");
  const name = getProductName(product, locale);
  const description = getProductDescription(product, locale);
  const variants = product.variants ?? [];

  const storages = [...new Set(variants.map((v) => v.storage))];
  const conditions = [...new Set(variants.map((v) => v.condition))];

  const [storage, setStorage] = useState(storages[0] ?? "128GB");
  const [condition, setCondition] = useState(conditions[0] ?? "refurbished");
  const [fulfillment, setFulfillment] = useState<FulfillmentType>("pickup");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [notes, setNotes] = useState("");

  const selectedVariant = useMemo(
    () =>
      variants.find((v) => v.storage === storage && v.condition === condition),
    [variants, storage, condition],
  );

  const total = calculateVariantPrice(product.base_price, selectedVariant);
  const monthly = calculateMonthlyPrice(total);
  const priceLocale = locale === "es" ? "es-US" : "en-US";
  const stripeReady = isStripeEnabled(settings.stripe_enabled);

  const fulfillmentOptions: {
    type: FulfillmentType;
    icon: typeof Store;
    enabled: boolean;
  }[] = [
    { type: "pickup", icon: Store, enabled: true },
    {
      type: "store_delivery",
      icon: Truck,
      enabled: settings.delivery_store_enabled,
    },
    {
      type: "delivery_service",
      icon: Package,
      enabled: settings.delivery_service_enabled,
    },
  ];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          variantId: selectedVariant?.id,
          fulfillmentType: fulfillment,
          customerName,
          customerEmail,
          customerPhone,
          notes,
          totalAmount: total,
        }),
      });

      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-3xl border border-ella-rose/30 bg-ella-blush p-8 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-ella-rose-deep" />
        <p className="font-display mt-4 text-2xl font-semibold">{t("addedToCart")}</p>
        <p className="mt-2 text-sm text-ella-muted">{t("contactUs")}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br from-ella-blush via-ella-cream to-ella-lavender/40">
        <div className="ella-blob absolute -left-10 top-10 h-40 w-40 rounded-full bg-ella-rose/30" />
        <div className="ella-blob ella-blob-delay absolute -right-10 bottom-10 h-48 w-48 rounded-full bg-ella-lilac/30" />
        <div className="relative text-center">
          <div className="mx-auto flex h-48 w-32 items-center justify-center rounded-[2rem] border-2 border-ella-rose/30 bg-white/80 shadow-xl">
            <span className="font-display text-lg font-semibold text-ella-muted">
              {product.brand}
            </span>
          </div>
          <p className="font-display mt-6 text-3xl font-semibold">{name}</p>
          {description && (
            <p className="mx-auto mt-2 max-w-sm text-sm text-ella-muted">
              {description}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-sm text-ella-muted">{t("buyFrom")}</p>
          <p className="font-display text-4xl font-semibold">
            {formatPrice(total, priceLocale)}
          </p>
          <p className="mt-1 text-sm text-ella-muted">
            {t("orMonthly", { price: formatPrice(monthly, priceLocale) })}
          </p>
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-ella-muted">
            <span className="flex items-center gap-1 rounded-full bg-ella-blush px-3 py-1">
              <MapPin className="h-3.5 w-3.5" /> {t("freePickup")}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-ella-blush px-3 py-1">
              <Store className="h-3.5 w-3.5" /> {t("pickupFromStore")}
            </span>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">{t("storage")}</h3>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {storages.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStorage(s)}
                className={cn("ella-option-card text-left", storage === s && "selected")}
              >
                <span className="font-semibold">{s}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">{t("condition")}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {conditions.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCondition(c)}
                className={cn(
                  "ella-option-card text-left",
                  condition === c && "selected",
                )}
              >
                <span className="font-semibold capitalize">
                  {t(`conditions.${c}` as "conditions.refurbished")}
                </span>
                <span className="mt-1 block text-sm text-ella-muted">
                  {formatPrice(
                    calculateVariantPrice(
                      product.base_price,
                      variants.find(
                        (v) => v.storage === storage && v.condition === c,
                      ) as ProductVariant,
                    ),
                    priceLocale,
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-medium">{t("fulfillment.title")}</h3>
          <div className="grid gap-2">
            {fulfillmentOptions
              .filter((o) => o.enabled)
              .map(({ type, icon: Icon }) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFulfillment(type)}
                  className={cn(
                    "ella-option-card flex items-start gap-3 text-left",
                    fulfillment === type && "selected",
                  )}
                >
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-ella-rose-deep" />
                  <div>
                    <span className="font-semibold">
                      {t(`fulfillment.${type}` as "fulfillment.pickup")}
                    </span>
                    <span className="mt-0.5 block text-sm text-ella-muted">
                      {type === "pickup"
                        ? t("fulfillment.pickupDesc")
                        : t(`fulfillment.${type}Desc` as "fulfillment.storeDeliveryDesc", {
                            radius: settings.delivery_radius_km,
                          })}
                    </span>
                  </div>
                </button>
              ))}
          </div>
        </div>

        {!stripeReady && (
          <p className="rounded-2xl bg-ella-lavender/30 px-4 py-3 text-sm text-ella-muted">
            {t("stripeSoon")}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-ella-border bg-white p-5">
          <Label>{t("requestPurchase")}</Label>
          <Input
            required
            placeholder="Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
          <Input
            required
            type="email"
            placeholder="Email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />
          <Input
            type="tel"
            placeholder="Phone (optional)"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
          <Textarea
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "..." : t("requestPurchase")}
          </Button>
        </form>
      </div>
    </div>
  );
}

"use client";

import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import type { StoreSettings } from "@/types/database";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function StoreSettingsForm({
  initial,
}: {
  initial: StoreSettings;
}) {
  const t = useTranslations("admin");
  const ts = useTranslations("admin.storeSettings");
  const [settings, setSettings] = useState(initial);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });

    if (res.ok) setSaved(true);
    setLoading(false);
  }

  function update(field: keyof StoreSettings, value: string | number | boolean) {
    setSettings((s) => ({ ...s, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {saved && (
        <p className="rounded-2xl bg-green-50 px-4 py-2 text-sm text-green-700">
          {t("saved")}
        </p>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>{ts("storeName")}</Label>
          <Input
            value={settings.store_name}
            onChange={(e) => update("store_name", e.target.value)}
          />
        </div>
        <div>
          <Label>{ts("email")}</Label>
          <Input
            type="email"
            value={settings.email}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <Label>{ts("tagline")} (EN)</Label>
          <Input
            value={settings.tagline_en}
            onChange={(e) => update("tagline_en", e.target.value)}
          />
        </div>
        <div>
          <Label>{ts("tagline")} (ES)</Label>
          <Input
            value={settings.tagline_es}
            onChange={(e) => update("tagline_es", e.target.value)}
          />
        </div>
        <div>
          <Label>{ts("phone")}</Label>
          <Input
            value={settings.phone ?? ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <Label>{ts("deliveryRadius")}</Label>
          <Input
            type="number"
            value={settings.delivery_radius_km}
            onChange={(e) => update("delivery_radius_km", Number(e.target.value))}
          />
        </div>
      </div>

      <div>
        <Label>{ts("address")}</Label>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <Input
            placeholder={ts("addressLine1")}
            value={settings.address_line1}
            onChange={(e) => update("address_line1", e.target.value)}
          />
          <Input
            placeholder={ts("city")}
            value={settings.city}
            onChange={(e) => update("city", e.target.value)}
          />
          <Input
            placeholder={ts("state")}
            value={settings.state}
            onChange={(e) => update("state", e.target.value)}
          />
          <Input
            placeholder={ts("zip")}
            value={settings.zip}
            onChange={(e) => update("zip", e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>{ts("logoUrl")}</Label>
          <Input
            value={settings.logo_url}
            onChange={(e) => update("logo_url", e.target.value)}
            placeholder="/logo.svg"
          />
        </div>
        <div>
          <Label>{ts("logoPlaceholder")}</Label>
          <Input
            value={settings.logo_placeholder_url}
            onChange={(e) => update("logo_placeholder_url", e.target.value)}
            placeholder="/logo-placeholder.svg"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.delivery_store_enabled}
            onChange={(e) => update("delivery_store_enabled", e.target.checked)}
            className="rounded"
          />
          {ts("storeDelivery")}
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.delivery_service_enabled}
            onChange={(e) => update("delivery_service_enabled", e.target.checked)}
            className="rounded"
          />
          {ts("deliveryService")}
        </label>
        <label className="flex items-center gap-2 text-sm opacity-60">
          <input
            type="checkbox"
            checked={settings.stripe_enabled}
            onChange={(e) => update("stripe_enabled", e.target.checked)}
            className="rounded"
            disabled
          />
          {ts("stripeEnabled")}
        </label>
      </div>

      <Button type="submit" disabled={loading}>
        {t("save")}
      </Button>
    </form>
  );
}

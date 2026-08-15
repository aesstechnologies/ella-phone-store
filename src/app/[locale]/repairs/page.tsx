"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label, Textarea } from "@/components/ui/Input";
import { Link } from "@/i18n/navigation";
import { Wrench } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RepairsPage() {
  const t = useTranslations("repairs");
  const [deviceModel, setDeviceModel] = useState("");
  const [issue, setIssue] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/repairs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceModel, issueDescription: issue }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 md:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-ella-lavender/40">
          <Wrench className="h-7 w-7 text-ella-rose-deep" />
        </div>
        <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-ella-muted">{t("subtitle")}</p>
      </div>

      {submitted ? (
        <div className="rounded-3xl border border-ella-rose/30 bg-ella-blush p-8 text-center">
          <p className="font-display text-xl font-semibold">✨ Request received!</p>
          <p className="mt-2 text-sm text-ella-muted">{t("signInPrompt")}</p>
          <Link href="/auth/login" className="mt-4 inline-block">
            <Button>{t("signInPrompt")}</Button>
          </Link>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-3xl border border-ella-border bg-white p-6 shadow-sm"
        >
          <h2 className="font-display text-xl font-semibold">{t("formTitle")}</h2>
          <div>
            <Label htmlFor="device">{t("deviceModel")}</Label>
            <Input
              id="device"
              required
              value={deviceModel}
              onChange={(e) => setDeviceModel(e.target.value)}
              placeholder="iPhone 14 Pro, Galaxy S24..."
            />
          </div>
          <div>
            <Label htmlFor="issue">{t("issue")}</Label>
            <Textarea
              id="issue"
              required
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder={t("issuePlaceholder")}
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "..." : t("submit")}
          </Button>
          <p className="text-center text-xs text-ella-muted">{t("signInPrompt")}</p>
        </form>
      )}
    </div>
  );
}

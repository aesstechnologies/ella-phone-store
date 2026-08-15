"use client";

import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { Link, useRouter } from "@/i18n/navigation";
import { createClientOrNull } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function RegisterPage() {
  const t = useTranslations("auth");
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClientOrNull();
    if (!supabase) {
      setError("Supabase not configured. See README.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-center text-3xl font-semibold">{t("signUp")}</h1>
      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-3xl border border-ella-border bg-white p-6">
        <div>
          <Label htmlFor="name">{t("fullName")}</Label>
          <Input
            id="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {t("signUpButton")}
        </Button>
        <p className="text-center text-sm text-ella-muted">
          {t("hasAccount")}{" "}
          <Link href="/auth/login" className="text-ella-rose-deep hover:underline">
            {t("signIn")}
          </Link>
        </p>
      </form>
    </div>
  );
}

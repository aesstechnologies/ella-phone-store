"use client";

import { Logo } from "@/components/layout/Logo";
import { Button } from "@/components/ui/Button";
import { Link, usePathname } from "@/i18n/navigation";
import type { StoreSettings } from "@/types/database";
import { Globe, Menu, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

export function Header({
  settings,
  isLoggedIn,
  isAdmin,
}: {
  settings: StoreSettings;
  isLoggedIn: boolean;
  isAdmin: boolean;
}) {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const otherLocale = locale === "en" ? "es" : "en";

  const links = [
    { href: "/shop", label: t("shop") },
    { href: "/repairs", label: t("repairs") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-ella-border/80 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Logo settings={settings} />

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition hover:bg-ella-blush ${
                pathname.startsWith(link.href) ? "text-ella-rose-deep" : ""
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href={pathname}
            locale={otherLocale}
            className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm text-ella-muted transition hover:bg-ella-blush hover:text-foreground"
          >
            <Globe className="h-4 w-4" />
            {otherLocale.toUpperCase()}
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/account">
                <Button variant="ghost" size="sm">
                  {t("account")}
                </Button>
              </Link>
              {isAdmin && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    {t("admin")}
                  </Button>
                </Link>
              )}
            </>
          ) : (
            <Link href="/auth/login">
              <Button size="sm">{t("signIn")}</Button>
            </Link>
          )}
        </div>

        <button
          type="button"
          className="rounded-xl p-2 md:hidden hover:bg-ella-blush"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-ella-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-4 py-3 text-sm font-medium hover:bg-ella-blush"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={pathname}
              locale={otherLocale}
              className="rounded-xl px-4 py-3 text-sm hover:bg-ella-blush"
              onClick={() => setOpen(false)}
            >
              {otherLocale === "en" ? "English" : "Español"}
            </Link>
            <Link href={isLoggedIn ? "/account" : "/auth/login"} onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full" size="sm">
                {isLoggedIn ? t("account") : t("signIn")}
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

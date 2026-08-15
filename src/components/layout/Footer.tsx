import { Link } from "@/i18n/navigation";
import type { StoreSettings } from "@/types/database";
import { getStoreTagline } from "@/lib/data/seed";
import { getTranslations } from "next-intl/server";
import { Heart, Mail, MapPin } from "lucide-react";

export async function Footer({
  settings,
  locale,
}: {
  settings: StoreSettings;
  locale: string;
}) {
  const t = await getTranslations("footer");
  const tagline = getStoreTagline(settings, locale);

  return (
    <footer className="mt-auto border-t border-ella-border bg-ella-blush/40">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-display text-2xl font-semibold ella-sparkle">ELLA</p>
          <p className="mt-2 text-sm text-ella-muted">{tagline}</p>
          <p className="mt-4 flex items-center gap-2 text-sm">
            <Heart className="h-4 w-4 text-ella-rose-deep" />
            {t("tagline")}
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-medium">Links</p>
          <Link href="/shop" className="block text-ella-muted hover:text-foreground">
            Shop
          </Link>
          <Link href="/repairs" className="block text-ella-muted hover:text-foreground">
            Repairs
          </Link>
          <Link href="/contact" className="block text-ella-muted hover:text-foreground">
            Contact
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="flex items-start gap-2 text-ella-muted">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-ella-rose-deep" />
            <span>
              {settings.address_line1}
              <br />
              {settings.city}, {settings.state} {settings.zip}
            </span>
          </p>
          <a
            href={`mailto:${settings.email}`}
            className="flex items-center gap-2 text-ella-muted hover:text-foreground"
          >
            <Mail className="h-4 w-4 text-ella-rose-deep" />
            {settings.email}
          </a>
        </div>
      </div>

      <div className="border-t border-ella-border py-4 text-center text-xs text-ella-muted">
        © {new Date().getFullYear()} {settings.store_name}. {t("rights")}
      </div>
    </footer>
  );
}

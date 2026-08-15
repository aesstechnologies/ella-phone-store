import { getStoreSettings } from "@/lib/data/queries";
import { getStoreTagline } from "@/lib/data/seed";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const settings = await getStoreSettings();
  const tagline = getStoreTagline(settings, locale);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-ella-muted">{t("subtitle")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-ella-border bg-white p-6">
          <Mail className="mb-3 h-6 w-6 text-ella-rose-deep" />
          <h2 className="font-medium">{t("email")}</h2>
          <a
            href={`mailto:${settings.email}`}
            className="mt-2 block text-ella-rose-deep hover:underline"
          >
            {settings.email}
          </a>
          {settings.phone && (
            <>
              <Phone className="mb-3 mt-6 h-6 w-6 text-ella-rose-deep" />
              <h2 className="font-medium">Phone</h2>
              <p className="mt-2">{settings.phone}</p>
            </>
          )}
        </div>

        <div className="rounded-3xl border border-ella-border bg-white p-6">
          <MapPin className="mb-3 h-6 w-6 text-ella-rose-deep" />
          <h2 className="font-medium">{t("visitUs")}</h2>
          <p className="mt-2 text-ella-muted">
            {settings.address_line1}
            {settings.address_line2 && (
              <>
                <br />
                {settings.address_line2}
              </>
            )}
            <br />
            {settings.city}, {settings.state} {settings.zip}
          </p>
          <Clock className="mb-3 mt-6 h-6 w-6 text-ella-rose-deep" />
          <h2 className="font-medium">{t("hours")}</h2>
          <p className="mt-2 text-ella-muted">{t("hoursValue")}</p>
        </div>
      </div>

      <p className="mt-8 text-center text-sm text-ella-muted italic">{tagline}</p>
    </div>
  );
}

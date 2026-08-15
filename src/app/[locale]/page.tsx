import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/Button";
import { getFeaturedProducts, getStoreSettings } from "@/lib/data/queries";
import { getStoreTagline } from "@/lib/data/seed";
import { Link } from "@/i18n/navigation";
import {
  Heart,
  ShieldCheck,
  Sparkles,
  Star,
  Wrench,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tShop = await getTranslations("shop");
  const settings = await getStoreSettings();
  const featured = await getFeaturedProducts();
  const tagline = getStoreTagline(settings, locale);

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="ella-blob absolute -left-20 top-0 h-72 w-72 rounded-full bg-ella-rose/25" />
        <div className="ella-blob ella-blob-delay absolute -right-16 top-20 h-64 w-64 rounded-full bg-ella-lilac/25" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 md:px-6 md:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm text-ella-rose-deep shadow-sm">
              <Sparkles className="h-4 w-4" />
              {t("deliveryBanner")}
            </p>
            <h1 className="font-display text-5xl font-semibold leading-tight md:text-6xl">
              {t("heroTitle")}
              <br />
              <span className="ella-sparkle">{t("heroTitleAccent")}</span>
            </h1>
            <p className="mt-5 text-lg text-ella-muted">{tagline || t("heroSubtitle")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="lg">{t("shopNow")}</Button>
              </Link>
              <Link href="/repairs">
                <Button variant="outline" size="lg">
                  <Wrench className="h-4 w-4" />
                  {t("requestRepair")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-semibold">{t("featured")}</h2>
          <p className="mt-2 text-ella-muted">{t("featuredSubtitle")}</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              fromLabel={tShop("from")}
              viewLabel={tShop("viewProduct")}
            />
          ))}
        </div>
      </section>

      <section className="bg-gradient-to-b from-ella-blush/50 to-transparent py-16">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <h2 className="font-display mb-10 text-center text-3xl font-semibold">
            {t("whyElla")}
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: ShieldCheck, key: "quality" as const },
              { icon: Star, key: "price" as const },
              { icon: Heart, key: "care" as const },
            ].map(({ icon: Icon, key }) => (
              <div
                key={key}
                className="rounded-3xl border border-ella-border bg-white p-6 text-center transition hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-ella-lavender/40">
                  <Icon className="h-6 w-6 text-ella-rose-deep" />
                </div>
                <h3 className="font-display text-xl font-semibold">
                  {t(`whyItems.${key}.title`)}
                </h3>
                <p className="mt-2 text-sm text-ella-muted">
                  {t(`whyItems.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

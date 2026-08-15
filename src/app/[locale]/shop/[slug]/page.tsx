import { ProductConfigurator } from "@/components/shop/ProductConfigurator";
import { getProductBySlug, getStoreSettings } from "@/lib/data/queries";
import { Link } from "@/i18n/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("common");
  const product = await getProductBySlug(slug);
  const settings = await getStoreSettings();

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <Link
        href="/shop"
        className="mb-6 inline-flex items-center gap-2 text-sm text-ella-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>
      <ProductConfigurator
        product={product}
        settings={settings}
        locale={locale}
      />
    </div>
  );
}

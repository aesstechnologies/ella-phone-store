import { ProductCard } from "@/components/shop/ProductCard";
import { getProducts } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function ShopPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shop");
  const products = await getProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
      <div className="mb-10">
        <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-ella-muted">{t("subtitle")}</p>
      </div>

      {products.length === 0 ? (
        <p className="text-center text-ella-muted">{t("noProducts")}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              locale={locale}
              fromLabel={t("from")}
              viewLabel={t("viewProduct")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

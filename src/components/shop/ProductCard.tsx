import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";
import {
  calculateVariantPrice,
  getProductName,
} from "@/lib/data/seed";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types/database";
import { Smartphone, Sparkles } from "lucide-react";

export function ProductCard({
  product,
  locale,
  fromLabel,
  viewLabel,
}: {
  product: Product;
  locale: string;
  fromLabel: string;
  viewLabel: string;
}) {
  const name = getProductName(product, locale);
  const lowestVariant = product.variants?.reduce((min, v) => {
    const price = calculateVariantPrice(product.base_price, v);
    const minPrice = calculateVariantPrice(product.base_price, min);
    return price < minPrice ? v : min;
  }, product.variants[0]);

  const price = calculateVariantPrice(product.base_price, lowestVariant);

  return (
    <Link href={`/shop/${product.slug}`}>
      <Card className="group overflow-hidden transition hover:-translate-y-1 hover:shadow-lg hover:shadow-ella-rose/10">
        <div className="relative flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-ella-blush via-ella-cream to-ella-lavender/30">
          {product.is_featured && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ella-rose-deep shadow-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          <Smartphone className="h-20 w-20 text-ella-rose/40 transition group-hover:scale-110 group-hover:text-ella-rose-deep/60" />
        </div>
        <div className="p-5">
          <p className="text-xs uppercase tracking-wider text-ella-muted">
            {product.brand}
          </p>
          <h3 className="font-display mt-1 text-xl font-semibold">{name}</h3>
          <p className="mt-2 text-sm text-ella-muted">
            {fromLabel}{" "}
            <span className="font-semibold text-foreground">
              {formatPrice(price, locale === "es" ? "es-US" : "en-US")}
            </span>
          </p>
          <span className="mt-4 inline-block text-sm font-medium text-ella-rose-deep group-hover:underline">
            {viewLabel} →
          </span>
        </div>
      </Card>
    </Link>
  );
}

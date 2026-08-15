import { AdminNav } from "@/components/admin/AdminNav";
import { getAllProductsAdmin, isAdmin } from "@/lib/data/queries";
import { getProductName } from "@/lib/data/seed";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AdminProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  if (!(await isAdmin())) redirect(`/${locale}/auth/login`);

  const products = await getAllProductsAdmin();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-3xl font-semibold">{t("products")}</h1>
          <Link
            href="/admin/products/new"
            className="rounded-2xl bg-ella-rose-deep px-4 py-2 text-sm font-medium text-white"
          >
            {t("addProduct")}
          </Link>
        </div>
        <div className="mt-6 overflow-x-auto rounded-3xl border border-ella-border bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ella-border text-left text-ella-muted">
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Target buy</th>
                <th className="p-4">Profit</th>
                <th className="p-4">Active</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-ella-border/60">
                  <td className="p-4 font-medium">{getProductName(p, locale)}</td>
                  <td className="p-4">{formatPrice(p.base_price)}</td>
                  <td className="p-4">
                    {p.target_buy_price ? formatPrice(p.target_buy_price) : "—"}
                  </td>
                  <td className="p-4">
                    {p.expected_profit ? formatPrice(p.expected_profit) : "—"}
                  </td>
                  <td className="p-4">{p.is_active ? "✓" : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

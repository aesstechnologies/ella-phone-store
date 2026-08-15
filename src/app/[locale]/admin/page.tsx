import { AdminNav } from "@/components/admin/AdminNav";
import { getAllOrdersAdmin, getAllProductsAdmin, getAllRepairsAdmin, isAdmin } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Package, Smartphone, Wrench } from "lucide-react";

export default async function AdminDashboard({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  if (!(await isAdmin())) {
    redirect(`/${locale}/auth/login`);
  }

  const [products, repairs, orders] = await Promise.all([
    getAllProductsAdmin(),
    getAllRepairsAdmin(),
    getAllOrdersAdmin(),
  ]);

  const stats = [
    { label: t("products"), value: products.length, icon: Smartphone },
    { label: t("repairs"), value: repairs.length, icon: Wrench },
    { label: t("orders"), value: orders.length, icon: Package },
  ];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {stats.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="rounded-3xl border border-ella-border bg-white p-5"
            >
              <Icon className="h-5 w-5 text-ella-rose-deep" />
              <p className="mt-2 text-sm text-ella-muted">{label}</p>
              <p className="text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

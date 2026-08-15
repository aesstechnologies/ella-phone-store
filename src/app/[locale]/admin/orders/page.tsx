import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { getAllOrdersAdmin, isAdmin } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  if (!(await isAdmin())) redirect(`/${locale}/auth/login`);

  const orders = await getAllOrdersAdmin();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold">{t("orders")}</h1>
        {orders.length === 0 ? (
          <p className="mt-6 text-ella-muted">No purchase requests yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="rounded-2xl border border-ella-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-ella-muted">{order.customer_email}</p>
                    <p className="text-sm capitalize text-ella-muted">
                      {order.fulfillment_type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatPrice(order.total_amount)}</p>
                    <Badge status={order.status} label={order.status} />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile, getUserOrders } from "@/lib/data/queries";
import { formatPrice } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AccountOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const session = await getCurrentProfile();

  if (!session?.user) redirect(`/${locale}/auth/login`);

  const orders = await getUserOrders(session.user.id);
  const priceLocale = locale === "es" ? "es-US" : "en-US";

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-semibold">{t("orders")}</h1>
      {orders.length === 0 ? (
        <p className="mt-6 text-ella-muted">{t("noOrders")}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {orders.map((order) => (
            <li
              key={order.id}
              className="rounded-3xl border border-ella-border bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold capitalize">
                    {order.fulfillment_type.replace(/_/g, " ")}
                  </p>
                  <p className="text-sm text-ella-muted">
                    {new Date(order.created_at).toLocaleDateString(locale)}
                  </p>
                  {order.notes && (
                    <p className="mt-2 text-sm">{order.notes}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(order.total_amount, priceLocale)}
                  </p>
                  <Badge status={order.status} label={order.status} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

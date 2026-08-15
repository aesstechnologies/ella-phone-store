import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getCurrentProfile, getUserOrders, getUserRepairs } from "@/lib/data/queries";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/utils";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { Package, MessageSquare, Wrench } from "lucide-react";

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const tRepairs = await getTranslations("repairs");
  const session = await getCurrentProfile();

  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const { user, profile } = session;
  const repairs = await getUserRepairs(user.id);
  const orders = await getUserOrders(user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-1 text-ella-muted">
        {profile?.full_name ?? user.email}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Link href="/account/repairs" className="rounded-2xl border border-ella-border bg-white p-4 hover:shadow-md">
          <Wrench className="h-5 w-5 text-ella-rose-deep" />
          <p className="mt-2 font-medium">{t("repairs")}</p>
          <p className="text-2xl font-semibold">{repairs.length}</p>
        </Link>
        <Link href="/account/orders" className="rounded-2xl border border-ella-border bg-white p-4 hover:shadow-md">
          <Package className="h-5 w-5 text-ella-rose-deep" />
          <p className="mt-2 font-medium">{t("orders")}</p>
          <p className="text-2xl font-semibold">{orders.length}</p>
        </Link>
        <Link href="/account/messages" className="rounded-2xl border border-ella-border bg-white p-4 hover:shadow-md">
          <MessageSquare className="h-5 w-5 text-ella-rose-deep" />
          <p className="mt-2 font-medium">{t("messages")}</p>
          <p className="text-sm text-ella-muted">Chat →</p>
        </Link>
      </div>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">{t("repairs")}</h2>
        {repairs.length === 0 ? (
          <p className="mt-4 text-ella-muted">{t("noRepairs")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {repairs.slice(0, 5).map((repair) => (
              <li
                key={repair.id}
                className="flex items-center justify-between rounded-2xl border border-ella-border bg-white p-4"
              >
                <div>
                  <p className="font-medium">{repair.device_model}</p>
                  <p className="text-sm text-ella-muted line-clamp-1">
                    {repair.issue_description}
                  </p>
                </div>
                <Badge
                  status={repair.status}
                  label={tRepairs(`statuses.${repair.status}` as "statuses.received")}
                />
              </li>
            ))}
          </ul>
        )}
        <Link href="/repairs" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Request repair
          </Button>
        </Link>
      </section>

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold">{t("orders")}</h2>
        {orders.length === 0 ? (
          <p className="mt-4 text-ella-muted">{t("noOrders")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {orders.slice(0, 5).map((order) => (
              <li
                key={order.id}
                className="flex items-center justify-between rounded-2xl border border-ella-border bg-white p-4"
              >
                <div>
                  <p className="font-medium">{order.customer_name}</p>
                  <p className="text-sm text-ella-muted capitalize">
                    {order.fulfillment_type.replace("_", " ")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">
                    {formatPrice(order.total_amount, locale === "es" ? "es-US" : "en-US")}
                  </p>
                  <Badge status={order.status} label={order.status} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

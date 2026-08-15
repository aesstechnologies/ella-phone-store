import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { getAllRepairsAdmin, isAdmin } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AdminRepairsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const tRepairs = await getTranslations("repairs");

  if (!(await isAdmin())) redirect(`/${locale}/auth/login`);

  const repairs = await getAllRepairsAdmin();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold">{t("repairs")}</h1>
        {repairs.length === 0 ? (
          <p className="mt-6 text-ella-muted">No repair requests yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {repairs.map((repair) => (
              <li
                key={repair.id}
                className="rounded-2xl border border-ella-border bg-white p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">{repair.device_model}</p>
                    <p className="text-sm text-ella-muted">
                      {repair.issue_description}
                    </p>
                  </div>
                  <Badge
                    status={repair.status}
                    label={tRepairs(`statuses.${repair.status}` as "statuses.received")}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

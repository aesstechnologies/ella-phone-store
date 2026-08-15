import { Badge } from "@/components/ui/Badge";
import { getCurrentProfile, getUserRepairs } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AccountRepairsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const tRepairs = await getTranslations("repairs");
  const session = await getCurrentProfile();

  if (!session?.user) redirect(`/${locale}/auth/login`);

  const repairs = await getUserRepairs(session.user.id);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6">
      <h1 className="font-display text-3xl font-semibold">{t("repairs")}</h1>
      {repairs.length === 0 ? (
        <p className="mt-6 text-ella-muted">{t("noRepairs")}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {repairs.map((repair) => (
            <li
              key={repair.id}
              className="rounded-3xl border border-ella-border bg-white p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{repair.device_model}</p>
                  <p className="mt-1 text-sm text-ella-muted">
                    {repair.issue_description}
                  </p>
                  {repair.notes && (
                    <p className="mt-2 text-sm">{repair.notes}</p>
                  )}
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
  );
}

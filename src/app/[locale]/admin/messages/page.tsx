import { AdminNav } from "@/components/admin/AdminNav";
import { isAdmin } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");

  if (!(await isAdmin())) redirect(`/${locale}/auth/login`);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold">{t("messages")}</h1>
        <p className="mt-4 text-ella-muted">
          Customer conversations appear here once Supabase is connected. Use the
          chat widget to test messaging.
        </p>
      </div>
    </div>
  );
}

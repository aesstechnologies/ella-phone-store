import { AdminNav } from "@/components/admin/AdminNav";
import { StoreSettingsForm } from "@/components/admin/StoreSettingsForm";
import { getStoreSettings, isAdmin } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin.storeSettings");

  if (!(await isAdmin())) redirect(`/${locale}/auth/login`);

  const settings = await getStoreSettings();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:px-6">
      <aside className="md:w-56">
        <AdminNav />
      </aside>
      <div className="flex-1">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <div className="mt-6 rounded-3xl border border-ella-border bg-white p-6">
          <StoreSettingsForm initial={settings} />
        </div>
      </div>
    </div>
  );
}

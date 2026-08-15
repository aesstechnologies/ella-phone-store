import { getCurrentProfile } from "@/lib/data/queries";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function AccountMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("account");
  const session = await getCurrentProfile();

  if (!session?.user) redirect(`/${locale}/auth/login`);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 text-center">
      <h1 className="font-display text-3xl font-semibold">{t("messages")}</h1>
      <p className="mt-4 text-ella-muted">{t("noMessages")}</p>
      <p className="mt-2 text-sm text-ella-muted">
        Use the chat bubble in the bottom-right corner to message ELLA.
      </p>
    </div>
  );
}

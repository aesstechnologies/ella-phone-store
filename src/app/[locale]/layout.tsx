import { ChatWidget } from "@/components/chat/ChatWidget";
import { DevRoleSwitcher } from "@/components/dev/DevRoleSwitcher";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { getDevRole, isDevAuthEnabled } from "@/lib/dev-auth";
import { getCurrentProfile, getStoreSettings } from "@/lib/data/queries";
import { routing } from "@/i18n/routing";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = (await import(`../../../messages/${locale}.json`)).default;
  return {
    title: messages.meta.title,
    description: messages.meta.description,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "en" | "es")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const settings = await getStoreSettings();
  const session = await getCurrentProfile();
  const devRole = await getDevRole();
  const showDevSwitcher = isDevAuthEnabled();

  return (
    <html lang={locale} className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600;700&family=DM+Sans:opsz,wght@9..40,400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <NextIntlClientProvider messages={messages}>
          <Header
            settings={settings}
            isLoggedIn={Boolean(session?.user)}
            isAdmin={session?.profile?.role === "admin"}
          />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} locale={locale} />
          <ChatWidget userId={session?.user?.id} />
          {showDevSwitcher && <DevRoleSwitcher currentRole={devRole} />}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

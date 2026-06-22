import type { Metadata, Viewport } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter } from 'next/font/google';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FavoritesProvider } from '@/components/FavoritesProvider';
import { PWAClient } from '@/components/PWAClient';
import { isRtl, locales } from '@/i18n/routing';
import '../globals.css';

const inter = Inter({ subsets: ['latin', 'latin-ext'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'SellThem — seconde main en Israël',
  description: 'Marketplace de seconde main pour Israël. Vends et achète à petit prix.',
  manifest: '/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'SellThem', statusBarStyle: 'default' },
  icons: { icon: '/icons/icon-192.png', apple: '/icons/apple-touch-icon.png' }
};

export const viewport: Viewport = {
  themeColor: '#f97316'
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!locales.includes(locale as (typeof locales)[number])) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const dir = isRtl(locale) ? 'rtl' : 'ltr';

  return (
    <html lang={locale} dir={dir} className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <FavoritesProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <PWAClient />
          </FavoritesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CategoryNav } from '@/components/CategoryNav';
import { HomeFeed } from '@/components/HomeFeed';

export default async function HomePage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  const t = await getTranslations('home');

  return (
    <div className="mx-auto max-w-7xl px-4">
      <section className="my-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand-500 via-brand-600 to-accent-600 px-6 py-12 text-white sm:px-12 sm:py-16">
        <div className="max-w-xl">
          <h1 className="text-3xl font-extrabold leading-tight sm:text-4xl">{t('heroTitle')}</h1>
          <p className="mt-3 text-brand-50/90 sm:text-lg">{t('heroSubtitle')}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/sell"
              className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              {t('heroCtaSell')}
            </Link>
            <Link
              href="/search"
              className="rounded-xl bg-brand-500/40 px-5 py-3 text-sm font-semibold text-white ring-1 ring-inset ring-white/40 transition hover:bg-brand-500/60"
            >
              {t('heroCtaBrowse')}
            </Link>
          </div>
        </div>
      </section>

      <section className="my-8">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{t('sectionCategories')}</h2>
        <CategoryNav />
      </section>

      <HomeFeed />
    </div>
  );
}

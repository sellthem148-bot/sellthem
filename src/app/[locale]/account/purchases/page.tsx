'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function PurchasesPage() {
  const t = useTranslations('account');
  const th = useTranslations('home');

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{t('purchases')}</h1>
      <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
        <p className="text-4xl">🛍️</p>
        <p className="mt-3 max-w-sm text-sm text-gray-500">{t('noPurchases')}</p>
        <Link href="/search" className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
          {th('heroCtaBrowse')}
        </Link>
      </div>
    </div>
  );
}

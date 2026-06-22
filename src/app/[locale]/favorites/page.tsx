'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ItemGrid } from '@/components/ItemGrid';
import { useFavorites } from '@/components/FavoritesProvider';
import { getItems } from '@/lib/data';

export default function FavoritesPage() {
  const t = useTranslations('favorites');
  const { ids } = useFavorites();
  const items = getItems().filter((i) => ids.includes(i.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h1 className="mb-1 text-xl font-bold text-gray-900">{t('title')}</h1>
      <p className="mb-6 text-sm text-gray-500">{t('count', { count: items.length })}</p>

      {items.length > 0 ? (
        <ItemGrid items={items} />
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-4xl">🤍</p>
          <p className="mt-3 text-sm text-gray-500">{t('empty')}</p>
          <Link
            href="/search"
            className="mt-4 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600"
          >
            {t('emptyCta')}
          </Link>
        </div>
      )}
    </div>
  );
}

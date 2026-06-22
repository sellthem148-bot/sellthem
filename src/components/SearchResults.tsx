'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { ItemGrid } from './ItemGrid';
import type { Item } from '@/lib/types';

export function SearchResults() {
  const t = useTranslations('search');
  const sp = useSearchParams();
  const [items, setItems] = useState<Item[] | null>(null);

  const query = sp.toString();
  const q = sp.get('q') || '';

  useEffect(() => {
    setItems(null);
    fetch(`/api/search?${query}`)
      .then((r) => r.json())
      .then((d) => setItems(d.items || []))
      .catch(() => setItems([]));
  }, [query]);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900">
          {q ? t('resultsFor', { query: q }) : t('title')}
        </h1>
        {items && <p className="mt-1 text-sm text-gray-500">{t('results', { count: items.length })}</p>}
      </div>

      {items === null ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-gray-100" />
              <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : items.length > 0 ? (
        <ItemGrid items={items} />
      ) : (
        <div className="grid place-items-center rounded-2xl border border-dashed border-gray-200 py-20 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-3 text-sm text-gray-500">{t('noResults')}</p>
        </div>
      )}
    </div>
  );
}

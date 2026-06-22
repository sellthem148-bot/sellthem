'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';

type Overview = {
  user: { name: string };
  stats: { activeListings: number; soldListings: number; favorites: number; conversations: number; followers: number };
  recentListings: { id: string; title: string; price: number; status: string; images: string[] }[];
};

export default function AccountOverview() {
  const t = useTranslations('account');
  const locale = useLocale();
  const [data, setData] = useState<Overview | null>(null);

  useEffect(() => {
    fetch('/api/account/overview')
      .then((r) => r.json())
      .then((d) => (d.error ? null : setData(d)))
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-sm text-gray-400">…</p>;

  const { stats } = data;
  const cards = [
    { label: t('statusActive'), value: stats.activeListings },
    { label: t('statusSold'), value: stats.soldListings },
    { label: t('favorites'), value: stats.favorites },
    { label: t('conversations'), value: stats.conversations },
    { label: t('followers'), value: stats.followers }
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{data.user.name}</h1>
        <Link href="/sell" className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          + {t('sellCta')}
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-gray-100 p-4 text-center shadow-card">
            <p className="text-2xl font-extrabold text-gray-900">{c.value}</p>
            <p className="text-xs text-gray-500">{c.label}</p>
          </div>
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">{t('myListings')}</h2>
          <Link href="/account/listings" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
            {t('overview')} →
          </Link>
        </div>
        {data.recentListings.length === 0 ? (
          <p className="rounded-xl border border-dashed border-gray-200 py-10 text-center text-sm text-gray-500">
            {t('noListings')}
          </p>
        ) : (
          <ul className="space-y-2">
            {data.recentListings.map((l) => (
              <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 shadow-card">
                <Image
                  src={l.images?.[0] || 'https://picsum.photos/seed/sellthem/100/100'}
                  alt=""
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-lg object-cover"
                />
                <Link href={`/items/${l.id}`} className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900 hover:text-brand-600">
                  {l.title}
                </Link>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${l.status === 'SOLD' ? 'bg-gray-200 text-gray-600' : 'bg-brand-50 text-brand-700'}`}>
                  {l.status === 'SOLD' ? t('statusSold') : t('statusActive')}
                </span>
                <span className="text-sm font-bold text-brand-700">{formatPrice(l.price, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

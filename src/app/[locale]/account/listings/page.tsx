'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';

type Listing = { id: string; title: string; price: number; images: string[]; status: string };

export default function MyListings() {
  const t = useTranslations('account');
  const locale = useLocale();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loaded, setLoaded] = useState(false);

  function load() {
    fetch('/api/account')
      .then((r) => r.json())
      .then((d) => setListings(d.listings || []))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }
  useEffect(load, []);

  async function toggleSold(l: Listing) {
    await fetch(`/api/listings/${l.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: l.status === 'SOLD' ? 'ACTIVE' : 'SOLD' })
    });
    load();
  }
  async function remove(l: Listing) {
    if (!confirm(t('confirmDelete'))) return;
    await fetch(`/api/listings/${l.id}`, { method: 'DELETE' });
    load();
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{t('myListings')}</h1>
        <Link href="/sell" className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-600">
          + {t('sellCta')}
        </Link>
      </div>

      {!loaded ? (
        <p className="text-sm text-gray-400">…</p>
      ) : listings.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">{t('noListings')}</p>
      ) : (
        <ul className="space-y-3">
          {listings.map((l) => (
            <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 shadow-card">
              <Image
                src={l.images?.[0] || 'https://picsum.photos/seed/sellthem/100/100'}
                alt=""
                width={56}
                height={56}
                className="h-14 w-14 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link href={`/items/${l.id}`} className="block truncate text-sm font-semibold text-gray-900 hover:text-brand-600">
                  {l.title}
                </Link>
                <p className="text-sm font-bold text-brand-700">{formatPrice(l.price, locale)}</p>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${l.status === 'SOLD' ? 'bg-gray-200 text-gray-600' : 'bg-brand-50 text-brand-700'}`}>
                  {l.status === 'SOLD' ? t('statusSold') : t('statusActive')}
                </span>
              </div>
              <div className="flex shrink-0 flex-col gap-1.5 text-xs">
                <Link href={`/account/listings/${l.id}`} className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-center font-semibold text-gray-700 hover:border-gray-300">
                  {t('edit')}
                </Link>
                <button onClick={() => toggleSold(l)} className="rounded-lg border border-gray-200 px-2.5 py-1.5 font-semibold text-gray-700 hover:border-gray-300">
                  {l.status === 'SOLD' ? t('markActive') : t('markSold')}
                </button>
                <button onClick={() => remove(l)} className="rounded-lg px-2.5 py-1.5 font-semibold text-accent-600 hover:bg-accent-500/10">
                  {t('delete')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

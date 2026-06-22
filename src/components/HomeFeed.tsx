'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ItemGrid } from './ItemGrid';
import type { Item } from '@/lib/types';

export function HomeFeed() {
  const t = useTranslations('home');
  const [data, setData] = useState<{ recent: Item[]; popular: Item[] } | null>(null);

  useEffect(() => {
    fetch('/api/feed')
      .then((r) => r.json())
      .then((d) => setData({ recent: d.recent || [], popular: d.popular || [] }))
      .catch(() => setData({ recent: [], popular: [] }));
  }, []);

  if (!data) {
    return (
      <div className="my-10">
        <SkeletonRow />
      </div>
    );
  }

  return (
    <>
      <Section title={t('sectionPopular')} href="/search?sort=popular" cta={t('seeAll')}>
        <ItemGrid items={data.popular} />
      </Section>
      <Section title={t('sectionRecent')} href="/search" cta={t('seeAll')}>
        <ItemGrid items={data.recent} />
      </Section>
    </>
  );
}

function Section({
  title,
  href,
  cta,
  children
}: {
  title: string;
  href: string;
  cta: string;
  children: React.ReactNode;
}) {
  return (
    <section className="my-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <Link href={href} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          {cta} →
        </Link>
      </div>
      {children}
    </section>
  );
}

function SkeletonRow() {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] w-full animate-pulse rounded-xl bg-gray-100" />
          <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-gray-100" />
          <div className="mt-1 h-3 w-1/3 animate-pulse rounded bg-gray-100" />
        </div>
      ))}
    </div>
  );
}

import { setRequestLocale } from 'next-intl/server';
import { Suspense } from 'react';
import { SearchFilters } from '@/components/SearchFilters';
import { SearchResults } from '@/components/SearchResults';

export default async function SearchPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <div className="rounded-2xl border border-gray-100 p-5 shadow-card lg:sticky lg:top-24 lg:self-start">
          <Suspense>
            <SearchFilters />
          </Suspense>
        </div>
        <Suspense>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}

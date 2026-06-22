'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useRouter } from '@/i18n/navigation';
import { categories, conditions, subcategories } from '@/lib/categories';

export interface SearchQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  brand?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
}

export function SearchFilters() {
  const t = useTranslations('search');
  const ti = useTranslations('item');
  const tcat = useTranslations('categories');
  const tsub = useTranslations('subcategories');
  const tcond = useTranslations('conditions');
  const tcommon = useTranslations('common');
  const router = useRouter();
  const sp = useSearchParams();

  const current: SearchQuery = {
    q: sp.get('q') || undefined,
    category: sp.get('category') || undefined,
    subcategory: sp.get('subcategory') || undefined,
    condition: sp.get('condition') || undefined,
    brand: sp.get('brand') || undefined,
    size: sp.get('size') || undefined,
    color: sp.get('color') || undefined,
    min: sp.get('min') || undefined,
    max: sp.get('max') || undefined,
    sort: sp.get('sort') || undefined
  };

  function update(patch: Partial<SearchQuery>) {
    const next = { ...current, ...patch };
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, String(v));
    });
    router.push(`/search?${params.toString()}`);
  }

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-gray-900">{t('filters')}</h2>
        <button
          type="button"
          onClick={() => router.push('/search')}
          className="text-xs font-medium text-brand-600 hover:text-brand-700"
        >
          {t('clear')}
        </button>
      </div>

      <Field label={t('category')}>
        <select
          value={current.category ?? ''}
          onChange={(e) => update({ category: e.target.value, subcategory: '' })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="">{tcommon('all')}</option>
          {categories.map((c) => (
            <option key={c.key} value={c.key}>
              {c.emoji} {tcat(c.key)}
            </option>
          ))}
        </select>
      </Field>

      {current.category && subcategories[current.category as keyof typeof subcategories]?.length > 0 && (
        <Field label="—">
          <select
            value={current.subcategory ?? ''}
            onChange={(e) => update({ subcategory: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          >
            <option value="">{tcommon('all')}</option>
            {subcategories[current.category as keyof typeof subcategories].map((s) => (
              <option key={s} value={s}>
                {tsub(s)}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label={t('condition')}>
        <select
          value={current.condition ?? ''}
          onChange={(e) => update({ condition: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="">{tcommon('all')}</option>
          {conditions.map((c) => (
            <option key={c} value={c}>
              {tcond(c)}
            </option>
          ))}
        </select>
      </Field>

      <Field label={ti('brand')}>
        <input
          type="text"
          defaultValue={current.brand ?? ''}
          onBlur={(e) => update({ brand: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && update({ brand: (e.target as HTMLInputElement).value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </Field>

      <Field label={ti('size')}>
        <input
          type="text"
          defaultValue={current.size ?? ''}
          onBlur={(e) => update({ size: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && update({ size: (e.target as HTMLInputElement).value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </Field>

      <Field label={ti('color')}>
        <input
          type="text"
          defaultValue={current.color ?? ''}
          onBlur={(e) => update({ color: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && update({ color: (e.target as HTMLInputElement).value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
      </Field>

      <Field label={t('price')}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            placeholder={t('priceMin')}
            defaultValue={current.min ?? ''}
            onBlur={(e) => update({ min: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
          <span className="text-gray-400">–</span>
          <input
            type="number"
            min={0}
            placeholder={t('priceMax')}
            defaultValue={current.max ?? ''}
            onBlur={(e) => update({ max: e.target.value })}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
      </Field>

      <Field label={t('sortBy')}>
        <select
          value={current.sort ?? 'recent'}
          onChange={(e) => update({ sort: e.target.value })}
          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          <option value="recent">{t('sortRecent')}</option>
          <option value="price_asc">{t('sortPriceAsc')}</option>
          <option value="price_desc">{t('sortPriceDesc')}</option>
        </select>
      </Field>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </label>
      {children}
    </div>
  );
}

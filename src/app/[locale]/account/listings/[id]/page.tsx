'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { categories, conditions, subcategories } from '@/lib/categories';

export default function EditListingPage({ params }: { params: { id: string } }) {
  const t = useTranslations('account');
  const ts = useTranslations('sell');
  const tcat = useTranslations('categories');
  const tsub = useTranslations('subcategories');
  const tcond = useTranslations('conditions');
  const locale = useLocale();

  const [loaded, setLoaded] = useState(false);
  const [allowed, setAllowed] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'women',
    subcategory: '',
    brand: '',
    size: '',
    condition: 'very_good',
    price: ''
  });

  useEffect(() => {
    fetch(`/api/listings/${params.id}`)
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d) => {
        const l = d.listing;
        setForm({
          title: l.title || '',
          description: l.description || '',
          category: String(l.category).toLowerCase(),
          subcategory: l.subcategory || '',
          brand: l.brand || '',
          size: l.size || '',
          condition: String(l.condition).toLowerCase(),
          price: String(l.price || '')
        });
        setLoaded(true);
      })
      .catch(() => {
        setAllowed(false);
        setLoaded(true);
      });
  }, [params.id]);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch(`/api/listings/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, price: Number(form.price) })
    });
    window.location.assign(`/${locale}/account`);
  }

  if (!loaded) return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-gray-400">…</div>;
  if (!allowed) return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-gray-500">⛔</div>;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('editTitle')}</h1>

      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        <Text label={ts('titleLabel')} value={form.title} onChange={(v) => set('title', v)} required />

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900">{ts('descriptionLabel')}</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label={ts('categoryLabel')}
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v, subcategory: '' }))}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {tcat(c.key)}
              </option>
            ))}
          </Select>
          {subcategories[form.category as keyof typeof subcategories]?.length > 0 && (
            <Select label={ts('categoryLabel')} value={form.subcategory} onChange={(v) => set('subcategory', v)}>
              <option value="">—</option>
              {subcategories[form.category as keyof typeof subcategories].map((s) => (
                <option key={s} value={s}>
                  {tsub(s)}
                </option>
              ))}
            </Select>
          )}
          <Select label={ts('conditionLabel')} value={form.condition} onChange={(v) => set('condition', v)}>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {tcond(c)}
              </option>
            ))}
          </Select>
          <Text label={ts('brandLabel')} value={form.brand} onChange={(v) => set('brand', v)} />
          <Text label={ts('sizeLabel')} value={form.size} onChange={(v) => set('size', v)} />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900">{ts('priceLabel')}</label>
          <div className="relative">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              required
              className="w-full rounded-xl border border-gray-200 py-2.5 ps-8 pe-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
        >
          {saving ? t('save') + '…' : t('save')}
        </button>
      </form>
    </div>
  );
}

function Text({
  label,
  value,
  onChange,
  required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-900">{label}</label>
      <input
        type="text"
        value={value}
        required={required}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-900">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      >
        {children}
      </select>
    </div>
  );
}

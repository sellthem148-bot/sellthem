'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { categories, conditions, subcategories } from '@/lib/categories';

type Me = { id: string; name: string } | null;

export default function SellPage() {
  const t = useTranslations('sell');
  const tcat = useTranslations('categories');
  const tcond = useTranslations('conditions');
  const tsub = useTranslations('subcategories');
  const locale = useLocale();

  const [me, setMe] = useState<Me | undefined>(undefined); // undefined = chargement
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'publishing'>('idle');
  const [error, setError] = useState<string | null>(null);

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
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => setMe(null));
  }, []);

  function set<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function onPickFiles(list: FileList | null) {
    if (!list) return;
    const arr = Array.from(list).slice(0, 8);
    setFiles(arr);
    setPreviews(arr.map((f) => URL.createObjectURL(f)));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      // 1) Upload des photos
      const urls: string[] = [];
      if (files.length > 0) {
        setStatus('uploading');
        for (const file of files) {
          const fd = new FormData();
          fd.append('file', file);
          const res = await fetch('/api/upload', { method: 'POST', body: fd });
          if (!res.ok) throw new Error('upload');
          const data = await res.json();
          urls.push(data.url);
        }
      }

      // 2) Création de l'annonce
      setStatus('publishing');
      const res = await fetch('/api/listings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, price: Number(form.price), images: urls })
      });
      if (!res.ok) throw new Error('publish');
      const data = await res.json();

      window.location.assign(`/${locale}/items/${data.id}`);
    } catch {
      setError(t('errorPublish'));
      setStatus('idle');
    }
  }

  // Chargement de l'état de connexion
  if (me === undefined) {
    return <div className="mx-auto max-w-2xl px-4 py-16 text-center text-sm text-gray-400">…</div>;
  }

  // Non connecté
  if (me === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-4xl">🔒</div>
        <p className="mt-4 text-sm text-gray-600">{t('loginRequired')}</p>
        <Link
          href="/login"
          className="mt-5 inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600"
        >
          {t('goLogin')}
        </Link>
      </div>
    );
  }

  const busy = status !== 'idle';

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>

      <form className="mt-6 space-y-6" onSubmit={onSubmit}>
        {/* Photos */}
        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900">{t('photoLabel')}</label>
          <p className="mb-2 text-xs text-gray-500">{t('photoHint')}</p>
          <div className="grid grid-cols-4 gap-3">
            {previews.map((src) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={src}
                src={src}
                alt=""
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
            <label className="grid aspect-square cursor-pointer place-items-center rounded-xl border-2 border-dashed border-gray-200 text-gray-400 transition hover:border-brand-300 hover:text-brand-500">
              <span className="text-2xl">+</span>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => onPickFiles(e.target.files)}
              />
            </label>
          </div>
        </div>

        <TextField label={t('titleLabel')} value={form.title} onChange={(v) => set('title', v)} placeholder={t('titlePlaceholder')} required />

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900">{t('descriptionLabel')}</label>
          <textarea
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
            placeholder={t('descriptionPlaceholder')}
            rows={4}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <SelectField
            label={t('categoryLabel')}
            value={form.category}
            onChange={(v) => setForm((f) => ({ ...f, category: v, subcategory: '' }))}
          >
            {categories.map((c) => (
              <option key={c.key} value={c.key}>
                {c.emoji} {tcat(c.key)}
              </option>
            ))}
          </SelectField>

          {subcategories[form.category as keyof typeof subcategories]?.length > 0 && (
            <SelectField label={t('categoryLabel')} value={form.subcategory} onChange={(v) => set('subcategory', v)}>
              <option value="">—</option>
              {subcategories[form.category as keyof typeof subcategories].map((s) => (
                <option key={s} value={s}>
                  {tsub(s)}
                </option>
              ))}
            </SelectField>
          )}

          <SelectField label={t('conditionLabel')} value={form.condition} onChange={(v) => set('condition', v)}>
            {conditions.map((c) => (
              <option key={c} value={c}>
                {tcond(c)}
              </option>
            ))}
          </SelectField>

          <TextField label={t('brandLabel')} value={form.brand} onChange={(v) => set('brand', v)} placeholder={t('brandPlaceholder')} />
          <TextField label={t('sizeLabel')} value={form.size} onChange={(v) => set('size', v)} placeholder="M / 42 / —" />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold text-gray-900">{t('priceLabel')}</label>
          <div className="relative">
            <span className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-gray-400">₪</span>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set('price', e.target.value)}
              placeholder={t('pricePlaceholder')}
              required
              className="w-full rounded-xl border border-gray-200 py-2.5 ps-8 pe-3 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
        </div>

        {error && (
          <p className="rounded-lg bg-accent-500/10 px-3 py-2 text-center text-xs font-medium text-accent-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === 'uploading' ? t('uploading') : status === 'publishing' ? t('publishing') : t('publish')}
        </button>
      </form>
    </div>
  );
}

function TextField({
  label,
  value,
  onChange,
  placeholder,
  required
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-semibold text-gray-900">{label}</label>
      <input
        type="text"
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function SelectField({
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

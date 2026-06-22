'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { useState } from 'react';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import type { Item } from '@/lib/types';

const SHIPPING = { pickup: 15, home: 29 } as const;
type ShippingMethod = keyof typeof SHIPPING;

export function CheckoutClient({ item }: { item: Item }) {
  const t = useTranslations('checkout');
  const locale = useLocale();

  const [method, setMethod] = useState<ShippingMethod>('pickup');
  const [step, setStep] = useState<'form' | 'review'>('form');
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
    card: '',
    expiry: '',
    cvc: ''
  });
  function set<K extends keyof typeof form>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const shippingFee = SHIPPING[method];
  const protection = Math.round(item.price * 0.05) + 2;
  const total = item.price + shippingFee + protection;
  const cardLast4 = form.card.replace(/\s/g, '').slice(-4);

  // ---- Confirmation finale ----
  if (done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="text-5xl">✅</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">{t('successTitle')}</h1>
        <p className="mt-2 text-sm text-gray-500">{t('successDesc')}</p>
        <div className="mt-6 flex items-center gap-3 rounded-2xl border border-gray-100 p-4 text-start shadow-card">
          <Image src={item.images[0]} alt={item.title} width={56} height={56} className="rounded-lg object-cover" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{item.title}</p>
            <p className="text-xs text-gray-500">{t(method)}</p>
          </div>
          <p className="font-bold text-brand-700">{formatPrice(total, locale)}</p>
        </div>
        <Link href="/" className="mt-6 inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          {t('continueShopping')}
        </Link>
      </div>
    );
  }

  const summary = (
    <div className="rounded-2xl border border-gray-100 p-5 shadow-card">
      <h2 className="mb-4 text-sm font-bold text-gray-900">{t('orderSummary')}</h2>
      <div className="flex items-center gap-3">
        <Image src={item.images[0]} alt={item.title} width={56} height={56} className="rounded-lg object-cover" />
        <p className="flex-1 text-sm font-medium text-gray-900">{item.title}</p>
      </div>
      <dl className="mt-5 space-y-2 border-t border-gray-100 pt-4 text-sm">
        <Row label={t('itemPrice')} value={formatPrice(item.price, locale)} />
        <Row label={t('shippingFee')} value={formatPrice(shippingFee, locale)} />
        <Row label={t('buyerProtection')} value={formatPrice(protection, locale)} />
      </dl>
      <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
        <span className="text-sm font-bold text-gray-900">{t('total')}</span>
        <span className="text-lg font-extrabold text-brand-700">{formatPrice(total, locale)}</span>
      </div>
    </div>
  );

  // ---- Étape 2 : récapitulatif ----
  if (step === 'review') {
    return (
      <div className="mx-auto max-w-5xl px-4 py-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('reviewTitle')}</h1>
        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            <RecapBlock title={t('shippingMethod')} onEdit={() => setStep('form')} editLabel={t('edit')}>
              {t(method)} · {formatPrice(shippingFee, locale)}
            </RecapBlock>
            <RecapBlock title={t('deliverTo')} onEdit={() => setStep('form')} editLabel={t('edit')}>
              {form.fullName}
              <br />
              {form.address}, {form.zip} {form.city}
              <br />
              {form.phone}
            </RecapBlock>
            <RecapBlock title={t('payment')} onEdit={() => setStep('form')} editLabel={t('edit')}>
              💳 •••• {cardLast4 || '----'}
            </RecapBlock>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            {summary}
            <button
              onClick={() => setDone(true)}
              className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
            >
              {t('confirm', { amount: formatPrice(total, locale) })}
            </button>
            <button
              onClick={() => setStep('form')}
              className="mt-2 w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300"
            >
              {t('edit')}
            </button>
            <p className="mt-3 text-center text-xs text-gray-400">{t('demoNote')}</p>
          </aside>
        </div>
      </div>
    );
  }

  // ---- Étape 1 : formulaire ----
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t('title')}</h1>

      <form
        className="grid gap-8 lg:grid-cols-[1fr_340px]"
        onSubmit={(e) => {
          e.preventDefault();
          setStep('review');
        }}
      >
        <div className="space-y-8">
          <section>
            <h2 className="mb-3 text-sm font-bold text-gray-900">{t('shippingMethod')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <ShippingOption active={method === 'pickup'} onSelect={() => setMethod('pickup')} icon="🏪" title={t('pickup')} desc={t('pickupDesc')} price={formatPrice(SHIPPING.pickup, locale)} />
              <ShippingOption active={method === 'home'} onSelect={() => setMethod('home')} icon="🏠" title={t('home')} desc={t('homeDesc')} price={formatPrice(SHIPPING.home, locale)} />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-gray-900">{t('shippingAddress')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label={t('fullName')} value={form.fullName} onChange={(v) => set('fullName', v)} className="sm:col-span-2" />
              <Input label={t('address')} value={form.address} onChange={(v) => set('address', v)} className="sm:col-span-2" />
              <Input label={t('city')} value={form.city} onChange={(v) => set('city', v)} />
              <Input label={t('zip')} value={form.zip} onChange={(v) => set('zip', v)} />
              <Input label={t('phone')} type="tel" value={form.phone} onChange={(v) => set('phone', v)} className="sm:col-span-2" />
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-bold text-gray-900">{t('payment')}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <Input label={t('cardNumber')} value={form.card} onChange={(v) => set('card', v)} placeholder="4242 4242 4242 4242" className="sm:col-span-2" />
              <Input label={t('expiry')} value={form.expiry} onChange={(v) => set('expiry', v)} placeholder="12 / 28" />
              <Input label={t('cvc')} value={form.cvc} onChange={(v) => set('cvc', v)} placeholder="123" />
            </div>
          </section>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          {summary}
          <button
            type="submit"
            className="mt-4 w-full rounded-xl bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
          >
            {t('continueBtn')}
          </button>
        </aside>
      </form>
    </div>
  );
}

function RecapBlock({
  title,
  editLabel,
  onEdit,
  children
}: {
  title: string;
  editLabel: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-gray-100 p-4 shadow-card">
      <div className="mb-1 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wide text-gray-500">{title}</h3>
        <button onClick={onEdit} className="text-xs font-semibold text-brand-600 hover:underline">
          {editLabel}
        </button>
      </div>
      <p className="text-sm text-gray-800">{children}</p>
    </div>
  );
}

function ShippingOption({
  active,
  onSelect,
  icon,
  title,
  desc,
  price
}: {
  active: boolean;
  onSelect: () => void;
  icon: string;
  title: string;
  desc: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col rounded-xl border p-4 text-start transition ${
        active ? 'border-brand-500 bg-brand-50' : 'border-gray-200 hover:border-gray-300'
      }`}
    >
      <span className="text-2xl" aria-hidden="true">
        {icon}
      </span>
      <span className="mt-2 text-sm font-semibold text-gray-900">{title}</span>
      <span className="text-xs text-gray-500">{desc}</span>
      <span className="mt-2 text-sm font-bold text-brand-700">{price}</span>
    </button>
  );
}

function Input({
  label,
  type = 'text',
  placeholder,
  className = '',
  value,
  onChange
}: {
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">{label}</label>
      <input
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

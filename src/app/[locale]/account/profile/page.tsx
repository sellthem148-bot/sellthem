'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { subscribeToPush } from '@/lib/push-client';

export default function ProfilePage() {
  const t = useTranslations('account');
  const tpwa = useTranslations('pwa');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [saved, setSaved] = useState(false);
  const [notif, setNotif] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/account')
      .then((r) => r.json())
      .then((d) => {
        if (d.user) {
          setName(d.user.name || '');
          setCity(d.user.city || '');
        }
      })
      .catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    await fetch('/api/account', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, city })
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function enableNotif() {
    const res = await subscribeToPush();
    setNotif(res === 'ok' ? tpwa('notifOn') : res === 'denied' ? tpwa('notifDenied') : tpwa('notifUnsupported'));
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{t('myProfile')}</h1>

      <form onSubmit={save} className="space-y-4 rounded-2xl border border-gray-100 p-5 shadow-card">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('name')}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">{t('city')}</label>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" className="rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600">
            {t('save')}
          </button>
          {saved && <span className="text-sm font-medium text-brand-600">{t('saved')}</span>}
        </div>
      </form>

      <div className="mt-6">
        <button onClick={enableNotif} className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300">
          {tpwa('notifEnable')}
        </button>
        {notif && <p className="mt-2 text-sm text-gray-500">{notif}</p>}
      </div>
    </div>
  );
}

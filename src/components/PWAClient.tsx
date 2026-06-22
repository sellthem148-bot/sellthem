'use client';

/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { subscribeToPush } from '@/lib/push-client';

type BIPEvent = Event & { prompt: () => void; userChoice: Promise<unknown> };

export function PWAClient() {
  const t = useTranslations('pwa');
  const [deferred, setDeferred] = useState<BIPEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
    function onBIP(e: Event) {
      e.preventDefault();
      setDeferred(e as BIPEvent);
      setShow(true);
    }
    window.addEventListener('beforeinstallprompt', onBIP);

    // Réabonnement silencieux si déjà autorisé et connecté
    (async () => {
      try {
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
          const me = await fetch('/api/auth/me').then((r) => r.json());
          if (me.user) subscribeToPush();
        }
      } catch {
        /* ignore */
      }
    })();

    return () => window.removeEventListener('beforeinstallprompt', onBIP);
  }, []);

  async function install() {
    if (!deferred) return;
    deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-50 flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-card-hover md:left-auto md:right-3 md:max-w-sm">
      <img src="/icons/icon-192.png" alt="" className="h-10 w-10 rounded-lg" />
      <p className="flex-1 text-sm font-medium text-gray-800">{t('install')}</p>
      <button onClick={() => setShow(false)} className="px-2 text-sm text-gray-400">
        {t('later')}
      </button>
      <button onClick={install} className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white">
        {t('installBtn')}
      </button>
    </div>
  );
}

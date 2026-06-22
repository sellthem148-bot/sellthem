'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const t = useTranslations('account');
  const tn = useTranslations('nav');
  const [state, setState] = useState<'loading' | 'ok' | 'guest'>('loading');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setState(d.user ? 'ok' : 'guest'))
      .catch(() => setState('guest'));
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.assign('/');
  }

  if (state === 'loading') {
    return <div className="px-4 py-16 text-center text-sm text-gray-400">…</div>;
  }
  if (state === 'guest') {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <div className="text-4xl">👤</div>
        <p className="mt-4 text-sm text-gray-600">{t('loginRequired')}</p>
        <Link href="/login" className="mt-5 inline-block rounded-xl bg-brand-500 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-600">
          {tn('login')}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-[210px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400 md:block">
            {t('dashboard')}
          </p>
          <NavLink href="/account">📊 {t('overview')}</NavLink>
          <NavLink href="/account/listings">🏷️ {t('myListings')}</NavLink>
          <NavLink href="/account/purchases">🛍️ {t('purchases')}</NavLink>
          <NavLink href="/messages">💬 {t('conversations')}</NavLink>
          <NavLink href="/favorites">❤️ {t('favorites')}</NavLink>
          <NavLink href="/account/profile">👤 {t('myProfile')}</NavLink>
          <button
            onClick={logout}
            className="mt-2 hidden rounded-lg px-3 py-2 text-start text-sm font-medium text-gray-500 hover:bg-gray-100 md:block"
          >
            {t('logout')}
          </button>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
      {children}
    </Link>
  );
}

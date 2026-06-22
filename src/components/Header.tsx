'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';
import { useFavorites } from './FavoritesProvider';
import { LogoMark, Wordmark } from './Logo';
import { LocaleSwitcher } from './LocaleSwitcher';
import { SearchBar } from './SearchBar';

export function Header() {
  const t = useTranslations('nav');
  const { count } = useFavorites();
  const [user, setUser] = useState<{ name: string; role?: string } | null>(null);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => {});
  }, []);

  const [unread, setUnread] = useState(0);
  useEffect(() => {
    function load() {
      fetch('/api/notifications/count')
        .then((r) => r.json())
        .then((d) => setUnread(d.count || 0))
        .catch(() => {});
    }
    load();
    const i = setInterval(load, 20000);
    return () => clearInterval(i);
  }, []);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.reload();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <LogoMark size={36} />
          <Wordmark className="hidden text-xl sm:inline" />
        </Link>

        <div className="min-w-0 flex-1">
          <SearchBar />
        </div>

        <nav className="flex shrink-0 items-center gap-1 sm:gap-2">
          <IconLink href="/favorites" label={t('favorites')} badge={count}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
            </svg>
          </IconLink>

          <IconLink href="/messages" label={t('messages')} badge={unread}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </IconLink>

          {user ? (
            <div className="hidden items-center gap-1 md:flex">
              {user.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-gray-900 px-3 py-2 text-sm font-semibold text-white hover:bg-gray-800"
                >
                  Admin
                </Link>
              )}
              <Link
                href="/account"
                className="max-w-[8rem] truncate rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {user.name}
              </Link>
              <button
                type="button"
                onClick={logout}
                className="rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {t('logout')}
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 md:inline-block"
            >
              {t('login')}
            </Link>
          )}

          <Link
            href="/sell"
            className="rounded-lg bg-brand-500 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600 sm:px-4"
          >
            + <span className="hidden sm:inline">{t('sell')}</span>
          </Link>

          <div className="hidden sm:block">
            <LocaleSwitcher />
          </div>
        </nav>
      </div>

      <div className="border-t border-gray-100 px-4 py-2 sm:hidden">
        <LocaleSwitcher />
      </div>
    </header>
  );
}

function IconLink({
  href,
  label,
  badge,
  children
}: {
  href: string;
  label: string;
  badge?: number;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className="relative grid h-10 w-10 place-items-center rounded-lg text-gray-700 hover:bg-gray-100"
    >
      {children}
      {badge ? (
        <span className="absolute end-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent-500 px-1 text-[10px] font-bold text-white">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

'use client';

import { useEffect, useState } from 'react';
import { Link } from '@/i18n/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<'loading' | 'ok' | 'denied'>('loading');

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then((d) => setState(d.user?.role === 'ADMIN' ? 'ok' : 'denied'))
      .catch(() => setState('denied'));
  }, []);

  if (state === 'loading') {
    return <div className="px-4 py-16 text-center text-sm text-gray-400">…</div>;
  }
  if (state === 'denied') {
    return <div className="px-4 py-16 text-center text-sm text-gray-500">⛔ Accès réservé aux administrateurs.</div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-6 md:grid-cols-[190px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          <p className="hidden px-3 pb-2 text-xs font-bold uppercase tracking-wide text-gray-400 md:block">
            Administration
          </p>
          <AdminLink href="/admin">Tableau de bord</AdminLink>
          <AdminLink href="/admin/listings">Annonces</AdminLink>
          <AdminLink href="/admin/users">Utilisateurs</AdminLink>
          <AdminLink href="/admin/reports">Signalements</AdminLink>
        </nav>
        <div>{children}</div>
      </div>
    </div>
  );
}

function AdminLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
    >
      {children}
    </Link>
  );
}

'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { formatPrice, formatRelative } from '@/lib/format';

type Overview = {
  stats: {
    users: number;
    listings: number;
    active: number;
    sold: number;
    conversations: number;
    messages: number;
    openReports: number;
  };
  series: { date: string; users: number; listings: number }[];
  categories: { category: string; count: number }[];
  recentUsers: { id: string; name: string; email: string; createdAt: string }[];
  recentListings: { id: string; title: string; price: number; createdAt: string }[];
};

export default function AdminOverview() {
  const [data, setData] = useState<Overview | null>(null);
  const tcat = useTranslations('categories');
  const locale = useLocale();

  useEffect(() => {
    fetch('/api/admin/overview')
      .then((r) => r.json())
      .then((d) => (d.error ? null : setData(d)))
      .catch(() => {});
  }, []);

  if (!data) return <p className="text-sm text-gray-400">Chargement…</p>;

  const { stats, series, categories, recentUsers, recentListings } = data;
  const maxSeries = Math.max(1, ...series.map((s) => Math.max(s.users, s.listings)));
  const maxCat = Math.max(1, ...categories.map((c) => c.count));

  const kpis = [
    { label: 'Utilisateurs', value: stats.users, icon: '👤' },
    { label: 'Annonces actives', value: stats.active, icon: '🏷️' },
    { label: 'Vendues', value: stats.sold, icon: '✅' },
    { label: 'Conversations', value: stats.conversations, icon: '💬' },
    { label: 'Messages', value: stats.messages, icon: '✉️' },
    { label: 'Signalements', value: stats.openReports, icon: '🚩', alert: stats.openReports > 0 }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-2xl border p-4 shadow-card ${k.alert ? 'border-accent-400 bg-accent-500/5' : 'border-gray-100'}`}
          >
            <div className="text-xl">{k.icon}</div>
            <p className="mt-1 text-2xl font-extrabold text-gray-900">{k.value}</p>
            <p className="text-xs text-gray-500">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Activité 14 jours */}
      <section className="rounded-2xl border border-gray-100 p-5 shadow-card">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900">Activité — 14 derniers jours</h2>
          <div className="flex gap-4 text-xs">
            <span className="flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-full bg-brand-500" /> Inscrits</span>
            <span className="flex items-center gap-1"><i className="inline-block h-2 w-2 rounded-full bg-accent-500" /> Annonces</span>
          </div>
        </div>
        <div className="flex h-40 items-end gap-1.5">
          {series.map((s) => (
            <div key={s.date} className="flex flex-1 flex-col items-center gap-1" title={`${s.date} · ${s.users} inscrits, ${s.listings} annonces`}>
              <div className="flex h-32 w-full items-end justify-center gap-0.5">
                <div className="w-1/2 rounded-t bg-brand-500" style={{ height: `${(s.users / maxSeries) * 100}%` }} />
                <div className="w-1/2 rounded-t bg-accent-500" style={{ height: `${(s.listings / maxSeries) * 100}%` }} />
              </div>
              <span className="text-[9px] text-gray-400">{s.date.slice(3)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Catégories */}
      <section className="rounded-2xl border border-gray-100 p-5 shadow-card">
        <h2 className="mb-4 text-sm font-bold text-gray-900">Annonces par catégorie</h2>
        {categories.length === 0 ? (
          <p className="text-sm text-gray-400">Aucune annonce.</p>
        ) : (
          <div className="space-y-2">
            {categories.map((c) => (
              <div key={c.category} className="flex items-center gap-3">
                <span className="w-28 shrink-0 text-sm text-gray-600">{tcat(c.category)}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full rounded-full bg-brand-500" style={{ width: `${(c.count / maxCat) * 100}%` }} />
                </div>
                <span className="w-8 text-end text-sm font-semibold text-gray-700">{c.count}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Activité récente */}
      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-gray-100 p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Nouveaux inscrits</h2>
          <ul className="space-y-2">
            {recentUsers.map((u) => (
              <li key={u.id} className="flex items-center justify-between text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium text-gray-900">{u.name}</p>
                  <p className="truncate text-xs text-gray-500">{u.email}</p>
                </div>
                <span className="shrink-0 text-xs text-gray-400">{formatRelative(u.createdAt, locale)}</span>
              </li>
            ))}
            {recentUsers.length === 0 && <p className="text-sm text-gray-400">—</p>}
          </ul>
        </section>

        <section className="rounded-2xl border border-gray-100 p-5 shadow-card">
          <h2 className="mb-3 text-sm font-bold text-gray-900">Dernières annonces</h2>
          <ul className="space-y-2">
            {recentListings.map((l) => (
              <li key={l.id} className="flex items-center justify-between text-sm">
                <p className="min-w-0 truncate font-medium text-gray-900">{l.title}</p>
                <span className="shrink-0 font-bold text-brand-700">{formatPrice(l.price, locale)}</span>
              </li>
            ))}
            {recentListings.length === 0 && <p className="text-sm text-gray-400">—</p>}
          </ul>
        </section>
      </div>
    </div>
  );
}

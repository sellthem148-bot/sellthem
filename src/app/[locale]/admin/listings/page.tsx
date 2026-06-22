'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

type Row = { id: string; title: string; price: number; status: string; images: string[] };

export default function AdminListings() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch(`/api/admin/listings?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setRows(d.listings || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function del(id: string) {
    if (!confirm('Supprimer cette annonce ?')) return;
    await fetch('/api/admin/listings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Annonces</h1>
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Rechercher un titre…"
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm"
        />
        <button onClick={load} className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white">
          Rechercher
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((l) => (
            <li key={l.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-2.5">
              <Image
                src={l.images?.[0] || 'https://picsum.photos/seed/sellthem/100/100'}
                alt=""
                width={44}
                height={44}
                className="h-11 w-11 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{l.title}</p>
                <p className="text-xs text-gray-500">{l.price} ₪ · {l.status}</p>
              </div>
              <a href={`../items/${l.id}`} className="text-xs font-medium text-brand-600 hover:underline">Voir</a>
              <button onClick={() => del(l.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-semibold text-accent-600 hover:bg-accent-500/10">
                Supprimer
              </button>
            </li>
          ))}
          {rows.length === 0 && <p className="text-sm text-gray-400">Aucune annonce.</p>}
        </ul>
      )}
    </div>
  );
}

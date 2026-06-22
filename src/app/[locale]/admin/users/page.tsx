'use client';

import { useEffect, useState } from 'react';

type Row = { id: string; name: string; email: string; city: string | null; role: string; banned: boolean };

export default function AdminUsers() {
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch(`/api/admin/users?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d) => setRows(d.users || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleBan(u: Row) {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, banned: !u.banned })
    });
    load();
  }

  async function setRole(u: Row, role: 'ADMIN' | 'USER') {
    await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: u.id, role })
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Utilisateurs</h1>
      <div className="mb-4 flex gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          placeholder="Nom ou e-mail…"
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
          {rows.map((u) => (
            <li key={u.id} className="flex items-center gap-3 rounded-xl border border-gray-100 p-3">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  {u.name} {u.role === 'ADMIN' && <span className="ml-1 rounded bg-brand-100 px-1.5 text-[10px] font-bold text-brand-700">ADMIN</span>}
                </p>
                <p className="truncate text-xs text-gray-500">{u.email} {u.city ? `· ${u.city}` : ''}</p>
              </div>
              {u.banned && <span className="rounded-full bg-accent-500/10 px-2 py-0.5 text-[11px] font-semibold text-accent-600">Banni</span>}
              {u.role === 'ADMIN' ? (
                <button
                  onClick={() => setRole(u, 'USER')}
                  className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-600 hover:border-gray-300"
                >
                  Retirer admin
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setRole(u, 'ADMIN')}
                    className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-brand-700 hover:border-brand-300"
                  >
                    Promouvoir admin
                  </button>
                  <button
                    onClick={() => toggleBan(u)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold ${u.banned ? 'border border-gray-200 text-gray-700' : 'text-accent-600 hover:bg-accent-500/10'}`}
                  >
                    {u.banned ? 'Réactiver' : 'Bannir'}
                  </button>
                </>
              )}
            </li>
          ))}
          {rows.length === 0 && <p className="text-sm text-gray-400">Aucun utilisateur.</p>}
        </ul>
      )}
    </div>
  );
}

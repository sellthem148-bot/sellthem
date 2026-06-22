'use client';

import { useEffect, useState } from 'react';

type Row = {
  id: string;
  type: string;
  targetId: string;
  reporterId: string;
  reason: string;
  status: string;
  createdAt: string;
};

export default function AdminReports() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    fetch('/api/admin/reports')
      .then((r) => r.json())
      .then((d) => setRows(d.reports || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }
  useEffect(load, []);

  async function act(id: string, action: 'dismiss' | 'delete_target') {
    if (action === 'delete_target' && !confirm("Supprimer l'élément signalé (ou bannir l'utilisateur) ?")) return;
    await fetch('/api/admin/reports', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, action })
    });
    load();
  }

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-gray-900">Signalements</h1>
      {loading ? (
        <p className="text-sm text-gray-400">Chargement…</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-100 p-3">
              <div className="flex items-center gap-2">
                <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[11px] font-bold text-gray-600">{r.type}</span>
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${r.status === 'OPEN' ? 'bg-accent-500/10 text-accent-600' : 'bg-gray-100 text-gray-500'}`}>
                  {r.status}
                </span>
                <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="mt-1 text-sm text-gray-700">{r.reason || '(sans motif)'}</p>
              <p className="text-xs text-gray-400">Cible : {r.targetId}</p>
              {r.status === 'OPEN' && (
                <div className="mt-2 flex gap-2">
                  <button onClick={() => act(r.id, 'delete_target')} className="rounded-lg bg-accent-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600">
                    Supprimer la cible
                  </button>
                  <button onClick={() => act(r.id, 'dismiss')} className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700">
                    Ignorer
                  </button>
                </div>
              )}
            </li>
          ))}
          {rows.length === 0 && <p className="text-sm text-gray-400">Aucun signalement.</p>}
        </ul>
      )}
    </div>
  );
}

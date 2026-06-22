'use client';

import { useLocale } from 'next-intl';
import { useState } from 'react';

export function ContactSellerButton({ listingId, label }: { listingId: string; label: string }) {
  const locale = useLocale();
  const [busy, setBusy] = useState(false);

  async function go() {
    setBusy(true);
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId })
      });
      if (res.status === 401) {
        window.location.assign(`/${locale}/login`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.id) {
        window.location.assign(`/${locale}/messages?c=${data.id}`);
      } else {
        // Article de démo (non enregistré en base) ou erreur → boîte de réception
        window.location.assign(`/${locale}/messages`);
      }
    } catch {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={go}
      disabled={busy}
      className="grid place-items-center rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300 disabled:opacity-60"
    >
      {label}
    </button>
  );
}

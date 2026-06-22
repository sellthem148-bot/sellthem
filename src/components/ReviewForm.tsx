'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export function ReviewForm({ conversationId, onDone }: { conversationId: string; onDone?: () => void }) {
  const t = useTranslations('review');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  async function submit() {
    setBusy(true);
    try {
      await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, rating, comment })
      });
      setSent(true);
      setTimeout(() => onDone?.(), 1500);
    } catch {
      /* ignore */
    } finally {
      setBusy(false);
    }
  }

  if (sent) {
    return <p className="rounded-lg bg-brand-50 px-3 py-2 text-center text-sm font-medium text-brand-700">{t('thanks')}</p>;
  }

  return (
    <div className="rounded-xl border border-gray-200 p-3">
      <p className="mb-2 text-sm font-semibold text-gray-900">{t('title')}</p>
      <div className="mb-2 flex gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            aria-label={`${n}`}
            className="text-2xl leading-none"
          >
            <span className={n <= rating ? 'text-[#f5a524]' : 'text-gray-300'}>★</span>
          </button>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={t('commentPlaceholder')}
        rows={2}
        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
      />
      <button
        type="button"
        onClick={submit}
        disabled={busy}
        className="mt-2 w-full rounded-lg bg-brand-500 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-600 disabled:opacity-60"
      >
        {t('submit')}
      </button>
    </div>
  );
}

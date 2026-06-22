'use client';

import { useTranslations } from 'next-intl';

export function ReportButton({ targetId }: { targetId: string }) {
  const t = useTranslations('item');

  async function report() {
    const reason = window.prompt(t('report'));
    if (reason === null) return;
    const res = await fetch('/api/reports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'LISTING', targetId, reason })
    });
    if (res.status === 401) {
      window.location.assign('login');
      return;
    }
    alert(t('reportThanks'));
  }

  return (
    <button type="button" onClick={report} className="text-xs text-gray-400 underline hover:text-gray-600">
      {t('report')}
    </button>
  );
}

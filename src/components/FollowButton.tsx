'use client';

import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

export function FollowButton({ sellerId }: { sellerId: string }) {
  const t = useTranslations('profile');
  const locale = useLocale();
  const [count, setCount] = useState<number | null>(null);
  const [following, setFollowing] = useState(false);

  function load() {
    fetch(`/api/follow?sellerId=${sellerId}`)
      .then((r) => r.json())
      .then((d) => {
        setCount(d.count ?? 0);
        setFollowing(!!d.following);
      })
      .catch(() => {});
  }
  useEffect(load, [sellerId]);

  async function toggle() {
    const res = await fetch('/api/follow', {
      method: following ? 'DELETE' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sellerId })
    });
    if (res.status === 401) {
      window.location.assign(`/${locale}/login`);
      return;
    }
    // maj optimiste
    setFollowing((f) => !f);
    setCount((c) => (c ?? 0) + (following ? -1 : 1));
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={toggle}
        className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
          following
            ? 'border border-gray-200 text-gray-700 hover:border-gray-300'
            : 'bg-brand-500 text-white hover:bg-brand-600'
        }`}
      >
        {following ? t('following') : t('follow')}
      </button>
      {count !== null && <span className="text-sm text-gray-500">{t('followers', { count })}</span>}
    </div>
  );
}

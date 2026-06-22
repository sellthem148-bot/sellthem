'use client';

import { useTranslations } from 'next-intl';
import { useFavorites } from './FavoritesProvider';

export function FavoriteButton({
  itemId,
  variant = 'icon'
}: {
  itemId: string;
  variant?: 'icon' | 'full';
}) {
  const { isFavorite, toggle } = useFavorites();
  const t = useTranslations('item');
  const active = isFavorite(itemId);

  if (variant === 'full') {
    return (
      <button
        type="button"
        onClick={() => toggle(itemId)}
        aria-pressed={active}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
          active
            ? 'border-accent-500 bg-accent-500/10 text-accent-600'
            : 'border-gray-200 text-gray-700 hover:border-gray-300'
        }`}
      >
        <HeartIcon filled={active} />
        {active ? t('removeFavorite') : t('addFavorite')}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(itemId);
      }}
      aria-label={active ? t('removeFavorite') : t('addFavorite')}
      aria-pressed={active}
      className="absolute end-2 top-2 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-gray-700 shadow-sm backdrop-blur transition hover:bg-white"
    >
      <HeartIcon filled={active} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={filled ? '#ef4444' : 'none'}
      stroke={filled ? '#ef4444' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7Z" />
    </svg>
  );
}

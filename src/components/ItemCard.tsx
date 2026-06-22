import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { formatPrice } from '@/lib/format';
import type { Item } from '@/lib/types';
import { FavoriteButton } from './FavoriteButton';

export function ItemCard({ item }: { item: Item }) {
  const locale = useLocale();
  const t = useTranslations('item');

  return (
    <Link href={`/items/${item.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-gray-100">
        <Image
          src={item.images[0]}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
        <FavoriteButton itemId={item.id} />
        {item.sold && (
          <span className="absolute start-2 top-2 rounded-full bg-gray-900/80 px-2.5 py-1 text-xs font-semibold text-white">
            {t('sold')}
          </span>
        )}
      </div>
      <div className="mt-2 px-0.5">
        <p className="truncate text-sm font-medium text-gray-900">{item.title}</p>
        <p className="truncate text-xs text-gray-500">
          {item.brand !== '-' ? item.brand : ''} {item.size !== '-' ? `· ${item.size}` : ''}
        </p>
        <p className="mt-1 text-sm font-bold text-brand-700">{formatPrice(item.price, locale)}</p>
      </div>
    </Link>
  );
}

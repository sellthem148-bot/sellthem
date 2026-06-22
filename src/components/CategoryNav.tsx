import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { categories } from '@/lib/categories';

export function CategoryNav() {
  const t = useTranslations('categories');

  return (
    <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((c) => (
        <Link
          key={c.key}
          href={`/search?category=${c.key}`}
          className="flex shrink-0 flex-col items-center gap-2 rounded-xl border border-gray-100 bg-white px-5 py-4 text-center shadow-card transition hover:border-brand-200 hover:shadow-card-hover"
        >
          <span className="text-2xl" aria-hidden="true">
            {c.emoji}
          </span>
          <span className="text-xs font-medium text-gray-700">{t(c.key)}</span>
        </Link>
      ))}
    </div>
  );
}

import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { ItemGallery } from '@/components/ItemGallery';
import { ItemGrid } from '@/components/ItemGrid';
import { FavoriteButton } from '@/components/FavoriteButton';
import { ContactSellerButton } from '@/components/ContactSellerButton';
import { ReportButton } from '@/components/ReportButton';
import { Stars } from '@/components/Stars';
import { getItemById, getSellerById, getSimilarItems } from '@/lib/catalog';
import { formatPrice, formatRelative } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function ItemPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const item = await getItemById(params.id);
  if (!item) notFound();

  const seller = await getSellerById(item.sellerId);
  const similar = await getSimilarItems(item);

  const locale = await getLocale();
  const t = await getTranslations('item');
  const tc = await getTranslations('conditions');
  const tcat = await getTranslations('categories');

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="grid gap-8 lg:grid-cols-2">
        <ItemGallery images={item.images} alt={item.title} />

        <div>
          <h1 className="text-2xl font-bold text-gray-900">{item.title}</h1>
          <p className="mt-1 text-3xl font-extrabold text-brand-700">
            {formatPrice(item.price, locale)}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            {t('postedAgo', { date: formatRelative(item.createdAt, locale) })}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-y-3 text-sm">
            <Attr label={t('condition')} value={tc(item.condition)} />
            <Attr label={t('brand')} value={item.brand !== '-' ? item.brand : '—'} />
            <Attr label={t('size')} value={item.size !== '-' ? item.size : '—'} />
            <Attr label={t('color')} value={item.color !== '-' ? item.color : '—'} />
            <Attr label={t('category')} value={tcat(item.category)} />
          </dl>

          <div className="mt-6 space-y-3">
            <Link
              href={`/checkout/${item.id}`}
              className="block w-full rounded-xl bg-brand-500 px-4 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-brand-600"
            >
              {t('buy')}
            </Link>
            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300">
                {t('makeOffer')}
              </button>
              <ContactSellerButton listingId={item.id} label={t('message')} />
            </div>
            <FavoriteButton itemId={item.id} variant="full" />
          </div>

          <div className="mt-8">
            <h2 className="text-sm font-semibold text-gray-900">{t('description')}</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-600">
              {item.description || t('noDescription')}
            </p>
          </div>

          {seller && (
            <Link
              href={`/sellers/${seller.id}`}
              className="mt-8 flex items-center gap-3 rounded-2xl border border-gray-100 p-4 shadow-card transition hover:border-brand-200 hover:shadow-card-hover"
            >
              <Image
                src={seller.avatar}
                alt={seller.name}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">{seller.name}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                  <Stars rating={seller.rating} size={13} />
                  {seller.rating.toFixed(1)} {seller.city ? `· ${seller.city}` : ''}
                </p>
              </div>
              <span className="text-gray-300 rtl:rotate-180">›</span>
            </Link>
          )}

          <div className="mt-6 space-y-3">
            <Reassurance icon="🛡️" title={t('protectionTitle')} desc={t('protectionDesc')} />
            <Reassurance icon="📦" title={t('shippingTitle')} desc={t('shippingDesc')} />
          </div>

          <div className="mt-4 text-end">
            <ReportButton targetId={item.id} />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-lg font-bold text-gray-900">{t('similar')}</h2>
          <ItemGrid items={similar} />
        </section>
      )}
    </div>
  );
}

function Attr({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="font-medium text-gray-900">{value}</dd>
    </div>
  );
}

function Reassurance({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="flex gap-3 rounded-xl bg-gray-50 p-3">
      <span className="text-lg" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{desc}</p>
      </div>
    </div>
  );
}

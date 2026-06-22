import Image from 'next/image';
import { getLocale, getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { ItemGrid } from '@/components/ItemGrid';
import { FollowButton } from '@/components/FollowButton';
import { Stars } from '@/components/Stars';
import { getListingsBySellerId, getReviewsForSeller, getSellerById } from '@/lib/catalog';
import { formatRelative } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function SellerPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const seller = await getSellerById(params.id);
  if (!seller) notFound();

  const listings = await getListingsBySellerId(seller.id);
  const reviews = await getReviewsForSeller(seller.id);

  const locale = await getLocale();
  const t = await getTranslations('profile');
  const tr = await getTranslations('review');

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-gray-100 p-6 text-center shadow-card sm:flex-row sm:text-start">
        <Image src={seller.avatar} alt={seller.name} width={88} height={88} className="rounded-full" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">{seller.name}</h1>
          {seller.city && <p className="mt-0.5 text-sm text-gray-500">📍 {t('memberLocation', { city: seller.city })}</p>}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 sm:justify-start">
            <span className="inline-flex items-center gap-1.5 text-sm text-gray-700">
              <Stars rating={seller.rating} />
              <strong>{seller.rating.toFixed(1)}</strong>
              <span className="text-gray-400">· {t('reviewsCount', { count: seller.reviews })}</span>
            </span>
            <span className="text-sm text-gray-400">·</span>
            <span className="text-sm text-gray-700">{t('itemsCount', { count: listings.length })}</span>
          </div>
          <div className="mt-3 flex justify-center sm:justify-start">
            <FollowButton sellerId={seller.id} />
          </div>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{t('listings')}</h2>
        {listings.length > 0 ? (
          <ItemGrid items={listings} />
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
            {t('noListings')}
          </p>
        )}
      </section>

      <section className="mt-12">
        <h2 className="mb-4 text-lg font-bold text-gray-900">{t('reviews')}</h2>
        {reviews.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2">
            {reviews.map((r) => (
              <li key={r.id} className="rounded-2xl border border-gray-100 p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <Image src={r.authorAvatar} alt={r.authorName} width={40} height={40} className="rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{r.authorName}</p>
                    <p className="text-xs text-gray-400">
                      {formatRelative(r.at, locale)}
                      {r.role && (
                        <span className="ms-2 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                          {r.role === 'BUYER' ? tr('asBuyer') : tr('asSeller')}
                        </span>
                      )}
                    </p>
                  </div>
                  <Stars rating={r.rating} size={14} />
                </div>
                <p className="mt-3 text-sm text-gray-600">{r.comment}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-xl border border-dashed border-gray-200 py-12 text-center text-sm text-gray-500">
            {t('noReviews')}
          </p>
        )}
      </section>
    </div>
  );
}

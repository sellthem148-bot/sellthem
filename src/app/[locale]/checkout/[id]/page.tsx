import { setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { CheckoutClient } from '@/components/CheckoutClient';
import { getItemById } from '@/lib/catalog';

export const dynamic = 'force-dynamic';

export default async function CheckoutPage({
  params
}: {
  params: { locale: string; id: string };
}) {
  setRequestLocale(params.locale);
  const item = await getItemById(params.id);
  if (!item) notFound();

  return <CheckoutClient item={item} />;
}

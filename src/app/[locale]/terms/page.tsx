import { setRequestLocale } from 'next-intl/server';
import { LegalView } from '@/components/LegalView';
import { getLegal } from '@/lib/legal';

export default function TermsPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <LegalView doc={getLegal('terms', params.locale)} />;
}

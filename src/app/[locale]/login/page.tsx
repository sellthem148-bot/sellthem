import { setRequestLocale } from 'next-intl/server';
import { AuthForm } from '@/components/AuthForm';

export default function LoginPage({ params }: { params: { locale: string } }) {
  setRequestLocale(params.locale);
  return <AuthForm mode="login" />;
}

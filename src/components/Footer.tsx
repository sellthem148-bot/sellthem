import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { LogoMark, Wordmark } from './Logo';

export function Footer() {
  const t = useTranslations('footer');
  const tn = useTranslations('nav');

  return (
    <footer className="mt-16 border-t border-gray-100 bg-gray-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <LogoMark size={32} />
            <Wordmark className="text-lg" />
          </div>
          <p className="mt-3 max-w-xs text-sm text-gray-500">{t('tagline')}</p>
        </div>

        <FooterCol title={t('discover')}>
          <FooterLink href="/">{tn('home')}</FooterLink>
          <FooterLink href="/search">{tn('searchPlaceholder')}</FooterLink>
          <FooterLink href="/sell">{tn('sell')}</FooterLink>
        </FooterCol>

        <FooterCol title={t('help')}>
          <FooterLink href="/terms">{t('terms')}</FooterLink>
          <FooterLink href="/privacy">{t('privacy')}</FooterLink>
        </FooterCol>

        <FooterCol title={t('about')}>
          <FooterLink href="/">{t('about')}</FooterLink>
          <FooterLink href="/login">{tn('login')}</FooterLink>
        </FooterCol>
      </div>

      <div className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SellThem · {t('rights')}
      </div>
    </footer>
  );
}

function FooterCol({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <ul className="mt-3 space-y-2">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-gray-500 hover:text-brand-600">
        {children}
      </Link>
    </li>
  );
}

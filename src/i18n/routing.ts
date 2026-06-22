import { defineRouting } from 'next-intl/routing';

export const locales = ['fr', 'he', 'en', 'es', 'ru'] as const;
export type Locale = (typeof locales)[number];

// Langues écrites de droite à gauche
export const rtlLocales: Locale[] = ['he'];

export function isRtl(locale: string): boolean {
  return rtlLocales.includes(locale as Locale);
}

export const localeLabels: Record<Locale, string> = {
  fr: 'Français',
  he: 'עברית',
  en: 'English',
  es: 'Español',
  ru: 'Русский'
};

export const localeFlags: Record<Locale, string> = {
  fr: '🇫🇷',
  he: '🇮🇱',
  en: '🇬🇧',
  es: '🇪🇸',
  ru: '🇷🇺'
};

export const routing = defineRouting({
  locales,
  defaultLocale: 'fr',
  localePrefix: 'always'
});

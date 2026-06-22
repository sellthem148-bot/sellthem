'use client';

import { useLocale } from 'next-intl';
import { useParams } from 'next/navigation';
import { useTransition } from 'react';
import { usePathname, useRouter } from '@/i18n/navigation';
import { locales, localeFlags, localeLabels, type Locale } from '@/i18n/routing';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onChange(next: string) {
    startTransition(() => {
      // @ts-expect-error -- route params are passed through unchanged
      router.replace({ pathname, params }, { locale: next });
    });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Language</span>
      <select
        value={locale}
        disabled={isPending}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-lg border border-gray-200 bg-white py-2 ps-3 pe-8 text-sm text-gray-700 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeFlags[l as Locale]} {localeLabels[l as Locale]}
          </option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute end-2 h-4 w-4 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fillRule="evenodd"
          d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
          clipRule="evenodd"
        />
      </svg>
    </label>
  );
}

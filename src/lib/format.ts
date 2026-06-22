export function formatPrice(amount: number, locale: string): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: 'ILS',
      maximumFractionDigits: 0
    }).format(amount);
  } catch {
    return `${amount} ₪`;
  }
}

export function formatRelative(iso: string, locale: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  const minutes = Math.round(diffMs / 60000);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (Math.abs(days) >= 1) return rtf.format(-days, 'day');
  if (Math.abs(hours) >= 1) return rtf.format(-hours, 'hour');
  return rtf.format(-Math.max(minutes, 1), 'minute');
}

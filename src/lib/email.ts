// Envoi d'e-mails via Resend (API REST, sans dépendance).
// Si RESEND_API_KEY n'est pas défini, les fonctions ne font rien (pas d'erreur).

const FROM = process.env.EMAIL_FROM || 'SellThem <onboarding@resend.dev>';
const BASE = process.env.NEXT_PUBLIC_BASE_URL || 'https://sellthem148.vercel.app';

type Locale = 'fr' | 'he' | 'en' | 'es';
function L(locale?: string | null): Locale {
  return (['fr', 'he', 'en', 'es'].includes(locale || '') ? locale : 'fr') as Locale;
}

export async function sendEmail(to: string, subject: string, html: string) {
  const key = process.env.RESEND_API_KEY;
  if (!key || !to) return; // non configuré → no-op
  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: FROM, to, subject, html })
    });
  } catch {
    /* ignore */
  }
}

function wrap(locale: Locale, title: string, body: string) {
  const cta = { fr: 'Ouvrir SellThem', en: 'Open SellThem', es: 'Abrir SellThem', he: 'פתחו את SellThem' }[locale];
  const dir = locale === 'he' ? 'rtl' : 'ltr';
  return `<div dir="${dir}" style="font-family:system-ui,sans-serif;max-width:480px;margin:auto">
    <h2 style="color:#ea580c">${title}</h2>
    <p style="color:#374151;font-size:15px;line-height:1.5">${body}</p>
    <p><a href="${BASE}/${locale}/messages" style="display:inline-block;background:#f97316;color:#fff;text-decoration:none;padding:10px 18px;border-radius:10px;font-weight:600">${cta}</a></p>
  </div>`;
}

export async function notifyNewMessage(
  to: string,
  toLocale: string | null,
  fromName: string,
  itemTitle: string
) {
  const l = L(toLocale);
  const subject = {
    fr: `Nouveau message de ${fromName}`,
    en: `New message from ${fromName}`,
    es: `Nuevo mensaje de ${fromName}`,
    he: `הודעה חדשה מ${fromName}`
  }[l];
  const body = {
    fr: `${fromName} vous a écrit à propos de « ${itemTitle} ».`,
    en: `${fromName} messaged you about “${itemTitle}”.`,
    es: `${fromName} te escribió sobre «${itemTitle}».`,
    he: `${fromName} כתב/ה לכם בנוגע ל-«${itemTitle}».`
  }[l];
  await sendEmail(to, subject, wrap(l, subject, body));
}

export async function notifyNewOffer(
  to: string,
  toLocale: string | null,
  fromName: string,
  itemTitle: string,
  amount: number
) {
  const l = L(toLocale);
  const subject = {
    fr: `Nouvelle offre : ${amount} ₪`,
    en: `New offer: ₪${amount}`,
    es: `Nueva oferta: ${amount} ₪`,
    he: `הצעה חדשה: ${amount} ₪`
  }[l];
  const body = {
    fr: `${fromName} propose ${amount} ₪ pour « ${itemTitle} ».`,
    en: `${fromName} offered ₪${amount} for “${itemTitle}”.`,
    es: `${fromName} ofrece ${amount} ₪ por «${itemTitle}».`,
    he: `${fromName} מציע/ה ${amount} ₪ עבור «${itemTitle}».`
  }[l];
  await sendEmail(to, subject, wrap(l, subject, body));
}

export async function notifyOfferResult(
  to: string,
  toLocale: string | null,
  itemTitle: string,
  amount: number,
  accepted: boolean
) {
  const l = L(toLocale);
  const subject = accepted
    ? { fr: `Offre acceptée : ${amount} ₪`, en: `Offer accepted: ₪${amount}`, es: `Oferta aceptada: ${amount} ₪`, he: `ההצעה התקבלה: ${amount} ₪` }[l]
    : { fr: `Offre refusée`, en: `Offer declined`, es: `Oferta rechazada`, he: `ההצעה נדחתה` }[l];
  const body = accepted
    ? { fr: `Votre offre de ${amount} ₪ pour « ${itemTitle} » a été acceptée !`, en: `Your offer of ₪${amount} for “${itemTitle}” was accepted!`, es: `¡Tu oferta de ${amount} ₪ por «${itemTitle}» fue aceptada!`, he: `הצעתכם על ${amount} ₪ עבור «${itemTitle}» התקבלה!` }[l]
    : { fr: `Votre offre pour « ${itemTitle} » a été refusée.`, en: `Your offer for “${itemTitle}” was declined.`, es: `Tu oferta por «${itemTitle}» fue rechazada.`, he: `הצעתכם עבור «${itemTitle}» נדחתה.` }[l];
  await sendEmail(to, subject, wrap(l, subject, body));
}

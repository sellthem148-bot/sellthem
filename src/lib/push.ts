import { prisma } from './prisma';

// web-push est CommonJS
const webpush = require('web-push');

export const VAPID_PUBLIC_KEY =
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ||
  'BPRhQLkUHRgMOTrW9Is2AJBl3lR_8CwE5XcPwm8bdqj-u_MVgbelNL4oG4V8a5vTYd5qug6_fbfMG4U__lvyS5U';

let configured = false;
function ensure(): boolean {
  if (configured) return true;
  const priv = process.env.VAPID_PRIVATE_KEY;
  if (!priv) return false;
  try {
    webpush.setVapidDetails('mailto:support@sellthem.co.il', VAPID_PUBLIC_KEY, priv);
    configured = true;
    return true;
  } catch {
    return false;
  }
}

export async function sendPush(
  userId: string,
  payload: { title: string; body: string; url?: string }
) {
  if (!ensure()) return; // clé privée non configurée → no-op
  try {
    const subs = await prisma.pushSubscription.findMany({ where: { userId } });
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification(
            { endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } },
            JSON.stringify(payload)
          );
        } catch (e: unknown) {
          const code = (e as { statusCode?: number })?.statusCode;
          if (code === 404 || code === 410) {
            await prisma.pushSubscription.delete({ where: { endpoint: s.endpoint } }).catch(() => {});
          }
        }
      })
    );
  } catch {
    /* non bloquant */
  }
}

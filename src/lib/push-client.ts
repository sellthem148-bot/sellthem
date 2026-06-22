const DEFAULT_PUBLIC =
  'BPRhQLkUHRgMOTrW9Is2AJBl3lR_8CwE5XcPwm8bdqj-u_MVgbelNL4oG4V8a5vTYd5qug6_fbfMG4U__lvyS5U';

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

export type SubscribeResult = 'ok' | 'denied' | 'unsupported' | 'error';

export async function subscribeToPush(): Promise<SubscribeResult> {
  try {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || typeof Notification === 'undefined') {
      return 'unsupported';
    }
    const perm = await Notification.requestPermission();
    if (perm !== 'granted') return 'denied';

    const reg = await navigator.serviceWorker.ready;
    const key = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || DEFAULT_PUBLIC;
    const existing = await reg.pushManager.getSubscription();
    const sub =
      existing ||
      (await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key) as BufferSource
      }));

    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub })
    });
    return 'ok';
  } catch {
    return 'error';
  }
}

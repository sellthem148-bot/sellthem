import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const COOKIE = 'sellthem_session';
const MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

function secret() {
  const s = process.env.AUTH_SECRET;
  if (!s) {
    // Évite un crash silencieux : message clair côté serveur si la variable manque.
    throw new Error('AUTH_SECRET manquant — ajoute-le dans tes variables d’environnement.');
  }
  return new TextEncoder().encode(s);
}

export async function createSession(userId: string) {
  const token = await new SignJWT({ uid: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret());

  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE
  });
}

export function clearSession() {
  cookies().set(COOKIE, '', { path: '/', maxAge: 0 });
}

export async function getSessionUserId(): Promise<string | null> {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret());
    return (payload.uid as string) ?? null;
  } catch {
    return null;
  }
}

export async function getCurrentUser() {
  const uid = await getSessionUserId();
  if (!uid) return null;
  return prisma.user.findUnique({
    where: { id: uid },
    select: { id: true, name: true, email: true, avatar: true, city: true, role: true, banned: true }
  });
}

export async function getAdminUser() {
  const user = await getCurrentUser();
  if (!user || user.role !== 'ADMIN') return null;
  return user;
}

import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'missing_fields' }, { status: 400 });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    if (!user || !user.passwordHash) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }
    if (user.banned) {
      return NextResponse.json({ error: 'banned' }, { status: 403 });
    }

    const ok = await bcrypt.compare(String(password), user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: 'invalid_credentials' }, { status: 401 });
    }

    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (e) {
    console.error('login error', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

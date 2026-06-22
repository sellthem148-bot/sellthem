import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Profil + mes annonces
export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const listings = await prisma.listing.findMany({
      where: { sellerId: me.id },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ user: me, listings });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (typeof b.name === 'string' && b.name.trim()) data.name = b.name.trim();
    if (typeof b.city === 'string') data.city = b.city || null;
    if (typeof b.avatar === 'string') data.avatar = b.avatar || null;
    await prisma.user.update({ where: { id: me.id }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

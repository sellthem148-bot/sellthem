import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ ids: [] });
    const favs = await prisma.favorite.findMany({ where: { userId: me.id }, select: { listingId: true } });
    return NextResponse.json({ ids: favs.map((f) => f.listingId) });
  } catch {
    return NextResponse.json({ ids: [] });
  }
}

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: 'missing' }, { status: 400 });
    try {
      await prisma.favorite.create({ data: { userId: me.id, listingId: String(listingId) } });
    } catch {
      /* déjà en favori ou article inexistant : on ignore */
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: 'missing' }, { status: 400 });
    await prisma.favorite.deleteMany({ where: { userId: me.id, listingId: String(listingId) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

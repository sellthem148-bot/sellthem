import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const sellerId = new URL(req.url).searchParams.get('sellerId');
    if (!sellerId) return NextResponse.json({ count: 0, following: false });
    const me = await getCurrentUser();
    const [count, mine] = await Promise.all([
      prisma.follow.count({ where: { followeeId: sellerId } }),
      me ? prisma.follow.findFirst({ where: { followeeId: sellerId, followerId: me.id } }) : Promise.resolve(null)
    ]);
    return NextResponse.json({ count, following: !!mine });
  } catch {
    return NextResponse.json({ count: 0, following: false });
  }
}

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const { sellerId } = await req.json();
    if (!sellerId || sellerId === me.id) return NextResponse.json({ error: 'invalid' }, { status: 400 });
    try {
      await prisma.follow.create({ data: { followerId: me.id, followeeId: String(sellerId) } });
    } catch {
      /* déjà suivi */
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
    const { sellerId } = await req.json();
    if (!sellerId) return NextResponse.json({ error: 'missing' }, { status: 400 });
    await prisma.follow.deleteMany({ where: { followerId: me.id, followeeId: String(sellerId) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

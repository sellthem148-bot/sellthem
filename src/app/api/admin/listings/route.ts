import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const q = new URL(req.url).searchParams.get('q') || '';
    const listings = await prisma.listing.findMany({
      where: q ? { title: { contains: q, mode: 'insensitive' } } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, title: true, price: true, status: true, images: true, sellerId: true, createdAt: true }
    });
    return NextResponse.json({ listings });
  } catch {
    return NextResponse.json({ listings: [] });
  }
}

export async function DELETE(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: 'missing' }, { status: 400 });
    await prisma.listing.delete({ where: { id: String(id) } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

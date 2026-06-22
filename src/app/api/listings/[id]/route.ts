import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES = ['WOMEN', 'MEN', 'KIDS', 'HOME', 'ELECTRONICS', 'BEAUTY', 'SPORTS', 'BOOKS', 'TOYS', 'OTHER'];
const CONDITIONS = ['NEW_WITH_TAGS', 'NEW_WITHOUT_TAGS', 'VERY_GOOD', 'GOOD', 'SATISFACTORY'];
const STATUSES = ['ACTIVE', 'RESERVED', 'SOLD'];

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const l = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!l) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (l.sellerId !== me.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    return NextResponse.json({ listing: l });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const existing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (existing.sellerId !== me.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const b = await req.json();
    const data: Record<string, unknown> = {};
    if (typeof b.title === 'string' && b.title.trim()) data.title = b.title.trim();
    if (typeof b.description === 'string') data.description = b.description;
    if (b.price !== undefined) {
      const price = Math.round(Number(b.price));
      if (Number.isFinite(price) && price > 0) data.price = price;
    }
    if (typeof b.brand === 'string') data.brand = b.brand || null;
    if (typeof b.size === 'string') data.size = b.size || null;
    if (typeof b.color === 'string') data.color = b.color || null;
    if (typeof b.subcategory === 'string') data.subcategory = b.subcategory || null;
    if (typeof b.category === 'string' && CATEGORIES.includes(b.category.toUpperCase())) data.category = b.category.toUpperCase();
    if (typeof b.condition === 'string' && CONDITIONS.includes(b.condition.toUpperCase())) data.condition = b.condition.toUpperCase();
    if (typeof b.status === 'string' && STATUSES.includes(b.status.toUpperCase())) data.status = b.status.toUpperCase();
    if (Array.isArray(b.images)) data.images = b.images.filter((x: unknown) => typeof x === 'string').slice(0, 8);

    await prisma.listing.update({ where: { id: params.id }, data: data as never });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const existing = await prisma.listing.findUnique({ where: { id: params.id } });
    if (!existing) return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (existing.sellerId !== me.id) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    await prisma.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

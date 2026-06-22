import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CATEGORIES = ['WOMEN', 'MEN', 'KIDS', 'HOME', 'ELECTRONICS', 'BEAUTY', 'SPORTS', 'BOOKS', 'TOYS', 'OTHER'];
const CONDITIONS = ['NEW_WITH_TAGS', 'NEW_WITHOUT_TAGS', 'VERY_GOOD', 'GOOD', 'SATISFACTORY'];

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const body = await req.json();
    const title = String(body.title || '').trim();
    const price = Math.round(Number(body.price));
    const category = String(body.category || '').toUpperCase();
    const condition = String(body.condition || '').toUpperCase();

    if (!title || !Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    if (!CATEGORIES.includes(category) || !CONDITIONS.includes(condition)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const images = Array.isArray(body.images)
      ? body.images.filter((x: unknown) => typeof x === 'string').slice(0, 8)
      : [];

    const listing = await prisma.listing.create({
      data: {
        title,
        description: String(body.description || ''),
        price,
        brand: body.brand ? String(body.brand) : null,
        size: body.size ? String(body.size) : null,
        color: body.color ? String(body.color) : null,
        subcategory: body.subcategory ? String(body.subcategory) : null,
        category: category as any,
        condition: condition as any,
        images,
        sellerId: user.id,
        status: 'ACTIVE' as any
      }
    });

    return NextResponse.json({ id: listing.id });
  } catch (e) {
    console.error('create listing error', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

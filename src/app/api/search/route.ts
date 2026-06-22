import { NextResponse } from 'next/server';
import { searchItems, type SearchParams } from '@/lib/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const sp = new URL(req.url).searchParams;
    const params: SearchParams = {
      q: sp.get('q') || undefined,
      category: sp.get('category') || undefined,
      subcategory: sp.get('subcategory') || undefined,
      condition: sp.get('condition') || undefined,
      brand: sp.get('brand') || undefined,
      size: sp.get('size') || undefined,
      color: sp.get('color') || undefined,
      min: sp.get('min') || undefined,
      max: sp.get('max') || undefined,
      sort: sp.get('sort') || undefined
    };
    const items = await searchItems(params);
    return NextResponse.json({ items });
  } catch {
    return NextResponse.json({ items: [] });
  }
}

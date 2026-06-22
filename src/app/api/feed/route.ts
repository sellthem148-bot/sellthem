import { NextResponse } from 'next/server';
import { getPopularItems, getRecentItems } from '@/lib/catalog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [recent, popular] = await Promise.all([getRecentItems(12), getPopularItems(5)]);
    return NextResponse.json({ recent, popular });
  } catch {
    return NextResponse.json({ recent: [], popular: [] });
  }
}

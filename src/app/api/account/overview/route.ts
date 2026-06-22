import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const [activeListings, soldListings, favorites, conversations, followers, recentListings] = await Promise.all([
      prisma.listing.count({ where: { sellerId: me.id, status: 'ACTIVE' as never } }),
      prisma.listing.count({ where: { sellerId: me.id, status: 'SOLD' as never } }),
      prisma.favorite.count({ where: { userId: me.id } }),
      prisma.conversation.count({ where: { OR: [{ buyerId: me.id }, { sellerId: me.id }] } }),
      prisma.follow.count({ where: { followeeId: me.id } }),
      prisma.listing.findMany({
        where: { sellerId: me.id },
        orderBy: { createdAt: 'desc' },
        take: 5,
        select: { id: true, title: true, price: true, status: true, images: true }
      })
    ]);

    return NextResponse.json({
      user: me,
      stats: { activeListings, soldListings, favorites, conversations, followers },
      recentListings
    });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

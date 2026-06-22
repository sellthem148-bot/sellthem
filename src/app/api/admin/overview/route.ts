import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - 13);

    const [
      users,
      listings,
      active,
      sold,
      conversations,
      messages,
      openReports,
      catGroups,
      uRows,
      lRows,
      recentUsers,
      recentListings
    ] = await Promise.all([
      prisma.user.count(),
      prisma.listing.count(),
      prisma.listing.count({ where: { status: 'ACTIVE' as never } }),
      prisma.listing.count({ where: { status: 'SOLD' as never } }),
      prisma.conversation.count(),
      prisma.message.count(),
      prisma.report.count({ where: { status: 'OPEN' } }),
      prisma.listing.groupBy({ by: ['category'], _count: { _all: true }, where: { status: 'ACTIVE' as never } }),
      prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.listing.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
      prisma.user.findMany({ orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, name: true, email: true, createdAt: true } }),
      prisma.listing.findMany({ orderBy: { createdAt: 'desc' }, take: 6, select: { id: true, title: true, price: true, createdAt: true } })
    ]);

    // Série quotidienne sur 14 jours
    const key = (d: Date) => `${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const series: { date: string; users: number; listings: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - i);
      series.push({ date: key(d), users: 0, listings: 0 });
    }
    const idx = (d: Date) => series.findIndex((s) => s.date === key(d));
    uRows.forEach((r) => {
      const i = idx(new Date(r.createdAt));
      if (i >= 0) series[i].users++;
    });
    lRows.forEach((r) => {
      const i = idx(new Date(r.createdAt));
      if (i >= 0) series[i].listings++;
    });

    const categories = catGroups
      .map((g) => ({ category: String(g.category).toLowerCase(), count: g._count._all }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      stats: { users, listings, active, sold, conversations, messages, openReports },
      series,
      categories,
      recentUsers,
      recentListings
    });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

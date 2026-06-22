import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { conversationId, rating, comment } = await req.json();
    const r = Math.round(Number(rating));
    if (!conversationId || !Number.isFinite(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const convo = await prisma.conversation.findUnique({ where: { id: String(conversationId) } });
    if (!convo || (convo.buyerId !== me.id && convo.sellerId !== me.id)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }

    const iAmBuyer = convo.buyerId === me.id;
    const targetId = iAmBuyer ? convo.sellerId : convo.buyerId;
    const targetRole = iAmBuyer ? 'SELLER' : 'BUYER'; // je note l'autre selon SON rôle

    await prisma.review.upsert({
      where: { authorId_targetId: { authorId: me.id, targetId } },
      create: {
        authorId: me.id,
        targetId,
        targetRole,
        rating: r,
        comment: String(comment || '').slice(0, 1000),
        conversationId: convo.id
      },
      update: { rating: r, comment: String(comment || '').slice(0, 1000), targetRole, conversationId: convo.id }
    });

    // Recalcule la note moyenne et le nombre d'avis de la cible
    const agg = await prisma.review.aggregate({
      where: { targetId },
      _avg: { rating: true },
      _count: { _all: true }
    });
    await prisma.user.update({
      where: { id: targetId },
      data: { rating: agg._avg.rating || 0, reviewsCount: agg._count._all }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

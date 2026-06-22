import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notifyOfferResult } from '@/lib/email';
import { sendPush } from '@/lib/push';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Accepter / refuser une offre (seul le destinataire de l'offre peut agir)
export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { messageId, action } = await req.json();
    if (!messageId || !['accept', 'decline'].includes(action)) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }

    const msg = await prisma.message.findUnique({ where: { id: String(messageId) } });
    if (!msg || msg.kind !== 'OFFER') return NextResponse.json({ error: 'not_found' }, { status: 404 });
    if (msg.status !== 'PENDING') return NextResponse.json({ error: 'already_handled' }, { status: 409 });

    const convo = await prisma.conversation.findUnique({ where: { id: msg.conversationId } });
    if (!convo || (convo.buyerId !== me.id && convo.sellerId !== me.id)) {
      return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    }
    // On ne peut pas accepter/refuser sa propre offre
    if (msg.senderId === me.id) {
      return NextResponse.json({ error: 'own_offer' }, { status: 403 });
    }

    await prisma.message.update({
      where: { id: msg.id },
      data: { status: action === 'accept' ? 'ACCEPTED' : 'DECLINED' }
    });

    // Notifie l'auteur de l'offre du résultat
    try {
      const [offerer, listing] = await Promise.all([
        prisma.user.findUnique({ where: { id: msg.senderId }, select: { email: true, locale: true } }),
        prisma.listing.findUnique({ where: { id: convo.listingId }, select: { title: true } })
      ]);
      if (offerer?.email) {
        await notifyOfferResult(offerer.email, offerer.locale, listing?.title || '', msg.amount || 0, action === 'accept');
      }
      await sendPush(msg.senderId, {
        title: 'SellThem',
        body: action === 'accept' ? `✅ ${msg.amount} ₪ — ${listing?.title || ''}` : `❌ ${listing?.title || ''}`,
        url: '/messages'
      });
    } catch {
      /* non bloquant */
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('offers POST', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

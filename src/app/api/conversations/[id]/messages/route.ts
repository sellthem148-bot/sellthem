import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { notifyNewMessage, notifyNewOffer } from '@/lib/email';
import { sendPush } from '@/lib/push';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/120?img=8';
const PLACEHOLDER_IMG = 'https://picsum.photos/seed/sellthem/200/200';

async function participantConvo(id: string, userId: string) {
  const convo = await prisma.conversation.findUnique({ where: { id } });
  if (!convo) return null;
  if (convo.buyerId !== userId && convo.sellerId !== userId) return null;
  return convo;
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const convo = await participantConvo(params.id, me.id);
    if (!convo) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const iAmSeller = convo.sellerId === me.id;
    const otherId = iAmSeller ? convo.buyerId : convo.sellerId;

    const [other, listing, msgs] = await Promise.all([
      prisma.user.findUnique({ where: { id: otherId }, select: { name: true, avatar: true } }),
      prisma.listing.findUnique({ where: { id: convo.listingId }, select: { id: true, title: true, images: true, price: true } }),
      prisma.message.findMany({ where: { conversationId: convo.id }, orderBy: { createdAt: 'asc' } })
    ]);

    // Marque comme lus les messages reçus de l'autre partie
    try {
      await prisma.message.updateMany({
        where: { conversationId: convo.id, senderId: { not: me.id }, readAt: null },
        data: { readAt: new Date() }
      });
    } catch {
      /* non bloquant */
    }

    return NextResponse.json({
      iAmSeller,
      other: { name: other?.name || '—', avatar: other?.avatar || DEFAULT_AVATAR },
      listing: {
        id: listing?.id || convo.listingId,
        title: listing?.title || '',
        image: (listing?.images && listing.images[0]) || PLACEHOLDER_IMG,
        price: listing?.price || 0
      },
      messages: msgs.map((m) => ({
        id: m.id,
        fromMe: m.senderId === me.id,
        kind: m.kind,
        text: m.text,
        amount: m.amount,
        status: m.status,
        at: m.createdAt
      }))
    });
  } catch (e) {
    console.error('messages GET', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const convo = await participantConvo(params.id, me.id);
    if (!convo) return NextResponse.json({ error: 'forbidden' }, { status: 403 });

    const body = await req.json();
    const isOffer = body.kind === 'OFFER';
    let offerAmount = 0;

    if (isOffer) {
      offerAmount = Math.round(Number(body.amount));
      if (!Number.isFinite(offerAmount) || offerAmount <= 0) {
        return NextResponse.json({ error: 'invalid_amount' }, { status: 400 });
      }
      await prisma.message.create({
        data: { conversationId: convo.id, senderId: me.id, kind: 'OFFER', amount: offerAmount, status: 'PENDING', text: '' }
      });
    } else {
      const text = String(body.text || '').trim();
      if (!text) return NextResponse.json({ error: 'empty' }, { status: 400 });
      await prisma.message.create({
        data: { conversationId: convo.id, senderId: me.id, kind: 'TEXT', text }
      });
    }

    // Notification e-mail du destinataire (sans bloquer en cas d'échec)
    try {
      const otherId = convo.buyerId === me.id ? convo.sellerId : convo.buyerId;
      const [other, listing] = await Promise.all([
        prisma.user.findUnique({ where: { id: otherId }, select: { email: true, locale: true } }),
        prisma.listing.findUnique({ where: { id: convo.listingId }, select: { title: true } })
      ]);
      if (other?.email) {
        if (isOffer) await notifyNewOffer(other.email, other.locale, me.name, listing?.title || '', offerAmount);
        else await notifyNewMessage(other.email, other.locale, me.name, listing?.title || '');
      }
      await sendPush(otherId, {
        title: isOffer ? `💰 ${me.name}` : `💬 ${me.name}`,
        body: isOffer ? `${offerAmount} ₪ — ${listing?.title || ''}` : listing?.title || '',
        url: '/messages'
      });
    } catch {
      /* notification non bloquante */
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('messages POST', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

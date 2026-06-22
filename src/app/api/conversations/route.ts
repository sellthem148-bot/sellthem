import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/120?img=8';
const PLACEHOLDER_IMG = 'https://picsum.photos/seed/sellthem/200/200';

// Liste des conversations de l'utilisateur connecté
export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const convos = await prisma.conversation.findMany({
      where: { OR: [{ buyerId: me.id }, { sellerId: me.id }] },
      orderBy: { createdAt: 'desc' }
    });

    const result = await Promise.all(
      convos.map(async (c) => {
        const iAmSeller = c.sellerId === me.id;
        const otherId = iAmSeller ? c.buyerId : c.sellerId;
        const [other, listing, last] = await Promise.all([
          prisma.user.findUnique({ where: { id: otherId }, select: { name: true, avatar: true } }),
          prisma.listing.findUnique({ where: { id: c.listingId }, select: { id: true, title: true, images: true } }),
          prisma.message.findFirst({ where: { conversationId: c.id }, orderBy: { createdAt: 'desc' } })
        ]);
        return {
          id: c.id,
          iAmSeller,
          otherName: other?.name || '—',
          otherAvatar: other?.avatar || DEFAULT_AVATAR,
          listingId: listing?.id || c.listingId,
          listingTitle: listing?.title || '',
          listingImage: (listing?.images && listing.images[0]) || PLACEHOLDER_IMG,
          lastMessage: last ? (last.kind === 'OFFER' ? `💰 ${last.amount} ₪` : last.text) : ''
        };
      })
    );

    return NextResponse.json({ conversations: result });
  } catch (e) {
    console.error('conversations GET', e);
    return NextResponse.json({ conversations: [] });
  }
}

// Crée (ou retrouve) une conversation pour un article
export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const { listingId } = await req.json();
    if (!listingId) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const listing = await prisma.listing.findUnique({ where: { id: String(listingId) } });
    if (!listing) return NextResponse.json({ error: 'listing_not_found' }, { status: 404 });
    if (listing.sellerId === me.id) return NextResponse.json({ error: 'own_listing' }, { status: 400 });

    let convo = await prisma.conversation.findFirst({
      where: { listingId: listing.id, buyerId: me.id }
    });
    if (!convo) {
      convo = await prisma.conversation.create({
        data: { listingId: listing.id, buyerId: me.id, sellerId: listing.sellerId }
      });
    }
    return NextResponse.json({ id: convo.id });
  } catch (e) {
    console.error('conversations POST', e);
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

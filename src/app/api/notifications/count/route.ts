import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Nombre de messages non lus pour l'utilisateur connecté
export async function GET() {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ count: 0 });

    const convos = await prisma.conversation.findMany({
      where: { OR: [{ buyerId: me.id }, { sellerId: me.id }] },
      select: { id: true }
    });
    if (convos.length === 0) return NextResponse.json({ count: 0 });

    const count = await prisma.message.count({
      where: {
        conversationId: { in: convos.map((c) => c.id) },
        senderId: { not: me.id },
        readAt: null
      }
    });
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

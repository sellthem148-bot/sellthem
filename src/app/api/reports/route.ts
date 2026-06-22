import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const me = await getCurrentUser();
    if (!me) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    const { type, targetId, reason } = await req.json();
    if (!['LISTING', 'USER'].includes(type) || !targetId) {
      return NextResponse.json({ error: 'invalid' }, { status: 400 });
    }
    await prisma.report.create({
      data: { type, targetId: String(targetId), reporterId: me.id, reason: String(reason || '').slice(0, 500) }
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

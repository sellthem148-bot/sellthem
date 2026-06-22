import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const q = new URL(req.url).searchParams.get('q') || '';
    const users = await prisma.user.findMany({
      where: q
        ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { email: { contains: q, mode: 'insensitive' } }] }
        : undefined,
      orderBy: { createdAt: 'desc' },
      take: 200,
      select: { id: true, name: true, email: true, city: true, role: true, banned: true, createdAt: true }
    });
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ users: [] });
  }
}

export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const { id, banned, role } = await req.json();
    if (!id) return NextResponse.json({ error: 'missing' }, { status: 400 });
    if (id === admin.id) return NextResponse.json({ error: 'self' }, { status: 400 });

    const data: { banned?: boolean; role?: string } = {};
    if (typeof banned === 'boolean') data.banned = banned;
    if (role === 'ADMIN' || role === 'USER') data.role = role;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: 'nothing' }, { status: 400 });

    await prisma.user.update({ where: { id: String(id) }, data });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

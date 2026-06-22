import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const reports = await prisma.report.findMany({ orderBy: [{ status: 'asc' }, { createdAt: 'desc' }], take: 200 });
    return NextResponse.json({ reports });
  } catch {
    return NextResponse.json({ reports: [] });
  }
}

// action : "dismiss" (clore) | "delete_target" (supprimer l'élément signalé puis clore)
export async function PATCH(req: Request) {
  try {
    const admin = await getAdminUser();
    if (!admin) return NextResponse.json({ error: 'forbidden' }, { status: 403 });
    const { id, action } = await req.json();
    if (!id) return NextResponse.json({ error: 'missing' }, { status: 400 });

    const report = await prisma.report.findUnique({ where: { id: String(id) } });
    if (!report) return NextResponse.json({ error: 'not_found' }, { status: 404 });

    if (action === 'delete_target') {
      try {
        if (report.type === 'LISTING') {
          await prisma.listing.delete({ where: { id: report.targetId } });
        } else if (report.type === 'USER') {
          await prisma.user.update({ where: { id: report.targetId }, data: { banned: true } });
        }
      } catch {
        /* cible déjà supprimée */
      }
    }

    await prisma.report.update({ where: { id: report.id }, data: { status: 'RESOLVED' } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'server_error' }, { status: 500 });
  }
}

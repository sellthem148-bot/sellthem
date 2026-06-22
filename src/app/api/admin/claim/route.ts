import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function html(message: string, status = 200) {
  return new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
     <body style="font-family:system-ui,sans-serif;max-width:480px;margin:48px auto;padding:0 16px;text-align:center;color:#111">
     ${message}</body></html>`,
    { status, headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

// Lien secret pour devenir administrateur : /api/admin/claim?key=TON_SECRET
export async function GET(req: Request) {
  const url = new URL(req.url);
  const key = url.searchParams.get('key');
  const secret = process.env.ADMIN_CLAIM_SECRET;

  const me = await getCurrentUser();
  if (!me) {
    return html(
      `<h2>🔒 Connecte-toi d'abord</h2><p>Ouvre le site, connecte-toi avec ton compte, puis rouvre ce lien.</p><p><a href="/fr/login">→ Se connecter</a></p>`,
      401
    );
  }
  if (!secret) {
    return html(
      `<h2>⚠️ Configuration manquante</h2><p>La variable <b>ADMIN_CLAIM_SECRET</b> n'est pas définie sur Vercel.<br>Ajoute-la dans Vercel → Settings → Environment Variables, puis redéploie.</p>`,
      500
    );
  }
  if (key !== secret) {
    return html(`<h2>❌ Clé incorrecte</h2><p>Le paramètre <code>?key=</code> ne correspond pas à ADMIN_CLAIM_SECRET.</p>`, 403);
  }

  try {
    await prisma.user.update({ where: { id: me.id }, data: { role: 'ADMIN' } });
  } catch {
    return html(
      `<h2>⚠️ Base non prête</h2><p>Impossible de mettre à jour le rôle. As-tu lancé <b>supabase/admin.sql</b> dans Supabase ? (la colonne « role » doit exister)</p>`,
      500
    );
  }

  return html(
    `<h2>✅ Tu es maintenant administrateur !</h2><p>Compte : ${me.email}</p><p><a href="/fr/admin">→ Ouvrir le tableau de bord admin</a></p>`
  );
}

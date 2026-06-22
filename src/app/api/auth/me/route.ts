import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getCurrentUser();
    return NextResponse.json({ user });
  } catch {
    // Si la base ou AUTH_SECRET ne sont pas encore configurés, on renvoie simplement "non connecté".
    return NextResponse.json({ user: null });
  }
}

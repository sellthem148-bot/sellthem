import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { uploadListingImage } from '@/lib/storage';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'unauthorized' }, { status: 401 });

    const form = await req.formData();
    const file = form.get('file');
    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'no_file' }, { status: 400 });
    }
    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'too_large' }, { status: 400 });
    }

    const url = await uploadListingImage(file);
    return NextResponse.json({ url });
  } catch (e) {
    console.error('upload error', e);
    return NextResponse.json({ error: 'upload_failed' }, { status: 500 });
  }
}

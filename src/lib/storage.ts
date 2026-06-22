import { createClient } from '@supabase/supabase-js';

const BUCKET = 'listings';

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error('Stockage Supabase non configuré (URL ou SERVICE_ROLE_KEY manquant).');
  }
  return createClient(url, serviceKey, { auth: { persistSession: false } });
}

async function ensureBucket(client: ReturnType<typeof adminClient>) {
  const { data } = await client.storage.getBucket(BUCKET);
  if (!data) {
    await client.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: '8MB'
    });
  }
}

export async function uploadListingImage(file: File): Promise<string> {
  const client = adminClient();
  await ensureBucket(client);

  const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext || 'jpg'}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, bytes, { contentType: file.type || 'image/jpeg', upsert: false });
  if (error) throw error;

  const { data } = client.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

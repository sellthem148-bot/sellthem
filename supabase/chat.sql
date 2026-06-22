-- ============================================================================
-- SellThem — Chat & négociation : ajoute les colonnes d'offres à la table Message
-- À coller dans Supabase → SQL Editor → Run (sans danger, ré-exécutable).
-- ============================================================================

ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "kind"   TEXT NOT NULL DEFAULT 'TEXT';
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "amount" INTEGER;
ALTER TABLE "Message" ADD COLUMN IF NOT EXISTS "status" TEXT;

-- (text peut être vide pour une offre)
ALTER TABLE "Message" ALTER COLUMN "text" SET DEFAULT '';

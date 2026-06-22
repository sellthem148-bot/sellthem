-- ============================================================================
-- SellThem — Avis bidirectionnels (vendeur ↔ acheteur)
-- À coller dans Supabase → SQL Editor → Run (ré-exécutable).
-- (La table "Review" existe déjà via schema.sql ; on ajoute les colonnes.)
-- ============================================================================

ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "targetRole"     TEXT NOT NULL DEFAULT 'SELLER';
ALTER TABLE "Review" ADD COLUMN IF NOT EXISTS "conversationId" TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS "Review_authorId_targetId_key" ON "Review"("authorId", "targetId");

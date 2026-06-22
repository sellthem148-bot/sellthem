-- ============================================================================
-- SellThem — Sous-catégories
-- À coller dans Supabase → SQL Editor → Run (ré-exécutable).
-- ============================================================================

ALTER TABLE "Listing" ADD COLUMN IF NOT EXISTS "subcategory" TEXT;

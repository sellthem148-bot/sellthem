-- ============================================================================
-- SellThem — Suivre un vendeur (abonnements)
-- À coller dans Supabase → SQL Editor → Run (ré-exécutable).
-- ============================================================================

CREATE TABLE IF NOT EXISTS "Follow" (
  "id"         TEXT NOT NULL,
  "followerId" TEXT NOT NULL,
  "followeeId" TEXT NOT NULL,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Follow_followerId_followeeId_key" ON "Follow"("followerId","followeeId");
CREATE INDEX IF NOT EXISTS "Follow_followeeId_idx" ON "Follow"("followeeId");

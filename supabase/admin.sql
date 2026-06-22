-- ============================================================================
-- SellThem — Admin & modération
-- À coller dans Supabase → SQL Editor → Run (ré-exécutable).
-- ============================================================================

-- Rôle + bannissement sur les utilisateurs
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "role"   TEXT NOT NULL DEFAULT 'USER';
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "banned" BOOLEAN NOT NULL DEFAULT false;

-- Table des signalements
CREATE TABLE IF NOT EXISTS "Report" (
  "id"         TEXT NOT NULL,
  "type"       TEXT NOT NULL,            -- LISTING | USER
  "targetId"   TEXT NOT NULL,
  "reporterId" TEXT NOT NULL,
  "reason"     TEXT NOT NULL,
  "status"     TEXT NOT NULL DEFAULT 'OPEN',  -- OPEN | RESOLVED
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Report_status_idx" ON "Report"("status");

-- ⬇️ IMPORTANT : deviens administrateur (remplace par TON adresse e-mail) :
-- UPDATE "User" SET "role" = 'ADMIN' WHERE "email" = 'ton-email@example.com';

-- ============================================================================
-- SellThem — Schéma complet de la base de données (Supabase / PostgreSQL)
-- ----------------------------------------------------------------------------
-- Comment l'utiliser :
--   1. Ouvre ton projet Supabase
--   2. Menu de gauche → "SQL Editor" → "New query"
--   3. Colle TOUT ce fichier
--   4. Clique "Run"  ✅  -> toutes les tables sont créées
--
-- Ce script est "idempotent" : tu peux le relancer sans erreur.
-- Il correspond exactement au schéma Prisma (prisma/schema.prisma).
-- ============================================================================

-- 1) Types énumérés -----------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE "Condition" AS ENUM ('NEW_WITH_TAGS','NEW_WITHOUT_TAGS','VERY_GOOD','GOOD','SATISFACTORY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "Category" AS ENUM ('WOMEN','MEN','KIDS','HOME','ELECTRONICS','BEAUTY','SPORTS','BOOKS','TOYS','OTHER');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "ListingStatus" AS ENUM ('DRAFT','ACTIVE','RESERVED','SOLD','REMOVED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE "OrderStatus" AS ENUM ('PENDING','PAID','SHIPPED','DELIVERED','COMPLETED','CANCELLED','REFUNDED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 2) Tables -------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "User" (
  "id"            TEXT NOT NULL,
  "email"         TEXT NOT NULL,
  "passwordHash"  TEXT,
  "name"          TEXT NOT NULL,
  "avatar"        TEXT,
  "city"          TEXT,
  "locale"        TEXT NOT NULL DEFAULT 'fr',
  "rating"        DOUBLE PRECISION NOT NULL DEFAULT 0,
  "reviewsCount"  INTEGER NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");

CREATE TABLE IF NOT EXISTS "Listing" (
  "id"          TEXT NOT NULL,
  "title"       TEXT NOT NULL,
  "description" TEXT NOT NULL DEFAULT '',
  "price"       INTEGER NOT NULL,
  "brand"       TEXT,
  "size"        TEXT,
  "color"       TEXT,
  "category"    "Category" NOT NULL,
  "condition"   "Condition" NOT NULL,
  "images"      TEXT[],
  "status"      "ListingStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "sellerId"    TEXT NOT NULL,
  CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Listing_category_status_idx" ON "Listing"("category","status");
CREATE INDEX IF NOT EXISTS "Listing_sellerId_idx" ON "Listing"("sellerId");

CREATE TABLE IF NOT EXISTS "Favorite" (
  "id"        TEXT NOT NULL,
  "userId"    TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Favorite_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Favorite_userId_listingId_key" ON "Favorite"("userId","listingId");

CREATE TABLE IF NOT EXISTS "Conversation" (
  "id"        TEXT NOT NULL,
  "listingId" TEXT NOT NULL,
  "buyerId"   TEXT NOT NULL,
  "sellerId"  TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Conversation_listingId_buyerId_key" ON "Conversation"("listingId","buyerId");

CREATE TABLE IF NOT EXISTS "Message" (
  "id"             TEXT NOT NULL,
  "conversationId" TEXT NOT NULL,
  "senderId"       TEXT NOT NULL,
  "text"           TEXT NOT NULL,
  "readAt"         TIMESTAMP(3),
  "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "Message_conversationId_idx" ON "Message"("conversationId");

CREATE TABLE IF NOT EXISTS "Order" (
  "id"          TEXT NOT NULL,
  "listingId"   TEXT NOT NULL,
  "buyerId"     TEXT NOT NULL,
  "sellerId"    TEXT NOT NULL,
  "amount"      INTEGER NOT NULL,
  "shippingFee" INTEGER NOT NULL DEFAULT 0,
  "status"      "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "Order_listingId_key" ON "Order"("listingId");

CREATE TABLE IF NOT EXISTS "Review" (
  "id"        TEXT NOT NULL,
  "orderId"   TEXT,
  "authorId"  TEXT NOT NULL,
  "targetId"  TEXT NOT NULL,
  "rating"    INTEGER NOT NULL,
  "comment"   TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- 3) Clés étrangères (relations) ---------------------------------------------

DO $$ BEGIN
  ALTER TABLE "Listing" ADD CONSTRAINT "Listing_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_listingId_fkey"
    FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey"
    FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey"
    FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_listingId_fkey"
    FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_buyerId_fkey"
    FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Order" ADD CONSTRAINT "Order_listingId_fkey"
    FOREIGN KEY ("listingId") REFERENCES "Listing"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Order" ADD CONSTRAINT "Order_buyerId_fkey"
    FOREIGN KEY ("buyerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Order" ADD CONSTRAINT "Order_sellerId_fkey"
    FOREIGN KEY ("sellerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Review" ADD CONSTRAINT "Review_authorId_fkey"
    FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  ALTER TABLE "Review" ADD CONSTRAINT "Review_targetId_fkey"
    FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ✅ Terminé. Va dans "Table Editor" pour voir tes 7 tables :
--    User, Listing, Favorite, Conversation, Message, Order, Review

# 🛠️ Feuille de route — Backend SellThem

Document à suivre **étape par étape** pour transformer la maquette en vrai produit.
Le mieux : ouvrir une **nouvelle session Claude Code directement sur le dépôt
`sellthem148-bot/sellthem`** et coller le prompt ci-dessous.

---

## 📋 Prompt à donner à la nouvelle session (copier-coller)

> Voici l'app SellThem (marketplace seconde main, Next.js 14 + next-intl, FR/HE/EN/ES).
> Aujourd'hui les données sont fictives (`src/lib/data.ts`) et l'auth est une maquette.
> Je veux brancher le vrai backend sur mon projet Supabase `kdxcnagpruvnhvsxfuig`.
> Les tables sont déjà créées (voir `supabase/schema.sql`, identique à `prisma/schema.prisma`).
> Suis la feuille de route `BACKEND_ROADMAP.md` dans l'ordre. Commence par l'étape 1.

---

## Pré-requis (déjà fait ✅)
- [x] Code sur GitHub + déployé sur Vercel
- [x] Projet Supabase créé
- [x] Tables créées via `supabase/schema.sql` (SQL Editor → Run)

---

## Étape 1 — Connexion à la base
- Ajouter `@prisma/client` + `prisma` (déjà en devDep).
- Renseigner `DATABASE_URL` (Supabase → Settings → Database → Connection string).
- `npx prisma generate` (et `npx prisma db pull` pour vérifier l'alignement).
- Créer un singleton Prisma : `src/lib/prisma.ts`.

## Étape 2 — Données de départ (seed)
- Script `prisma/seed.ts` qui insère les vendeurs + articles actuels (repris de
  `src/lib/data.ts`) pour avoir un catalogue réel dès le départ.

## Étape 3 — Remplacer la couche mock par la base
- Réécrire les fonctions de `src/lib/data.ts` en requêtes Prisma côté serveur
  (`getItems`, `getItem`, `getRecentItems`, `getSimilarItems`, `getSeller`,
  `getListingsBySeller`, `getReviewsForSeller`, + recherche/filtres).
- Garder les mêmes signatures pour ne pas casser les pages.

## Étape 4 — Authentification (clients & vendeurs)
- Choix recommandé : **NextAuth v5** (ou Supabase Auth).
  - Credentials (email + mot de passe **bcrypt**), Google OAuth, Apple OAuth.
  - Session par cookie. Inscription = création d'un `User`.
- Remplacer la maquette `src/components/AuthForm.tsx` par de vraies actions.
- Protéger les pages "vendre", "favoris", "messages", "mon compte".

## Étape 5 — Upload de photos
- **Supabase Storage** (bucket `listings`).
- Brancher le formulaire de mise en vente (`sell/page.tsx`) : upload réel +
  création de l'annonce (`Listing`) via une server action.

## Étape 6 — Favoris liés au compte
- Remplacer/synchroniser le `localStorage` par la table `Favorite`.

## Étape 7 — Messagerie réelle
- Persister `Conversation` / `Message`.
- Option temps réel : **Supabase Realtime** (souscription aux nouveaux messages).
- Notifications e-mail (Resend) à la réception d'un message / d'une vente.

## Étape 8 — Paiement + livraison
- Intégrer **Stripe** (ou un prestataire israélien : Tranzila, PayMe, Meshulam…).
- Tunnel `checkout/[id]` : créer un `Order`, paiement, mise à jour du statut
  (`PENDING → PAID → SHIPPED → DELIVERED → COMPLETED`).
- Frais de livraison + protection acheteurs (déjà calculés côté UI).

## Étape 9 — Avis après achat
- Laisser un avis (`Review`) une fois la commande `COMPLETED`.
- Recalculer `rating` / `reviewsCount` du vendeur.

## Étape 10 — Finitions
- Variables d'environnement sur Vercel (DATABASE_URL, clés OAuth, Stripe, Resend…).
- Pages légales (CGU, confidentialité), SEO, sitemap.
- Modération / signalement + petit back-office admin.

---

## Variables d'environnement (à remplir au fur et à mesure)
```
DATABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=https://kdxcnagpruvnhvsxfuig.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
STRIPE_SECRET_KEY=
RESEND_API_KEY=
```

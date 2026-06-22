# SellThem 🛍️

**SellThem** est une marketplace de seconde main type *Vinted*, pensée pour Israël.
Multilingue dès le départ : **Français** (par défaut), **עברית** (hébreu, RTL), **English**, **Español**.

## Stack

- **Next.js 14** (App Router) + **TypeScript**
- **Tailwind CSS** (identité teal + accent corail)
- **next-intl** pour l'i18n et le routage par langue (`/fr`, `/he`, `/en`, `/es`), avec gestion **RTL** automatique pour l'hébreu
- **Prisma** + PostgreSQL (schéma prêt dans `prisma/schema.prisma` — branché à l'étape suivante)

La couche de données est pour l'instant **mockée** dans `src/lib/data.ts` afin que l'app
tourne immédiatement sans base de données.

## Démarrer

```bash
npm install
npm run dev
# ouvre http://localhost:3000  → redirige vers /fr
```

Autres commandes :

```bash
npm run build       # build de production
npm run typecheck   # vérification TypeScript
npm run lint        # ESLint (next lint)
```

> ⚙️ **Installation complète (GitHub + Supabase + Vercel)** : voir `SETUP.md`.

## Fonctionnalités (MVP actuel)

| Domaine | État | Détail |
|--------|------|--------|
| 🌍 Multilingue FR/HE/EN/ES + RTL | ✅ | Sélecteur de langue, `dir=rtl` auto pour l'hébreu |
| 🏠 Accueil | ✅ | Hero, catégories, nouveautés, populaires |
| 🔎 Recherche + filtres | ✅ | Mot-clé, catégorie, état, prix, tri |
| 🛒 Page produit | ✅ | Galerie, attributs, vendeur, réassurance, similaires |
| 👤 Profil vendeur | ✅ | Articles en vente + avis/notes |
| ➕ Mise en vente | ✅ | Formulaire complet + aperçu (démo) |
| ❤️ Favoris | ✅ | Persistés via `localStorage` |
| 💬 Messagerie | ✅ | UI fonctionnelle (démo locale) |
| 👤 Auth (connexion/inscription) | ✅ (UI) | Email + Google/Apple (démo) |
| 💳 Paiement + livraison | ✅ (UI) | Tunnel de commande complet (démo) |

## Prochaines étapes (backend réel)

1. **Base de données** : brancher Prisma + Supabase (PostgreSQL), remplacer `src/lib/data.ts`.
2. **Auth** : email/mot de passe (bcrypt) + Google/Apple OAuth.
3. **Upload photos** : Supabase Storage.
4. **Paiement & livraison** : intégration prestataire (Stripe ou fournisseur israélien) + suivi de commande.
5. **Apps mobiles** : Expo / React Native partageant le backend.

## Structure

```
.
├── messages/            # Traductions fr / he / en / es
├── prisma/schema.prisma # Modèle de données (futur backend)
└── src/
    ├── app/[locale]/     # Pages localisées (App Router)
    ├── components/       # Header, ItemCard, filtres, favoris…
    ├── i18n/             # Config next-intl (routing, navigation, request)
    └── lib/              # Types, données mock, formatage
```

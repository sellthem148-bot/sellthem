# ⭐ Avis bidirectionnels (vendeur ↔ acheteur)

## 1) Base de données
Supabase → SQL Editor → colle **`supabase/reviews.sql`** → Run
(ajoute les colonnes targetRole / conversationId à la table Review).

## 2) Pousser le code
    cd "/Users/macbookpro/Documents/Claude/Projects/sellthem" && bash push.command

## 3) Tester (2 comptes)
- Ouvre une conversation (acheteur ↔ vendeur)
- Clique **⭐ Laisser un avis** (en haut de la conversation) → note + commentaire → Envoyer
- Va sur le profil de la personne notée (/sellers/...) → l'avis apparaît avec son rôle
  (« En tant que vendeur » ou « En tant qu'acheteur »), et la note moyenne se met à jour.

## ℹ️ Note
Aujourd'hui l'avis se laisse depuis une conversation. Quand le **paiement (PayPlus)**
sera branché, on pourra le restreindre aux **commandes terminées** (comme Vinted).

-- ============================================================================
-- SellThem — Catalogue de démonstration (vendeurs + articles)
-- À coller dans Supabase → SQL Editor → Run (ré-exécutable sans danger).
-- Remplit la base pour que l'accueil et la recherche affichent un vrai catalogue.
-- ============================================================================

-- Vendeurs (comptes de démo, sans mot de passe : non connectables) -----------
INSERT INTO "User" ("id","email","name","avatar","city","rating","reviewsCount","locale","createdAt") VALUES
  ('s1','noa@demo.sellthem',   'Noa L.',   'https://i.pravatar.cc/120?img=5',  'Tel Aviv',   4.9, 213, 'fr', NOW()),
  ('s2','david@demo.sellthem', 'David M.', 'https://i.pravatar.cc/120?img=12', 'Jérusalem',  4.7,  88, 'fr', NOW()),
  ('s3','maya@demo.sellthem',  'Maya R.',  'https://i.pravatar.cc/120?img=32', 'Haïfa',      5.0,  41, 'fr', NOW()),
  ('s4','yossi@demo.sellthem', 'Yossi B.', 'https://i.pravatar.cc/120?img=15', 'Beer Sheva', 4.6, 156, 'fr', NOW()),
  ('s5','tamar@demo.sellthem', 'Tamar K.', 'https://i.pravatar.cc/120?img=45', 'Netanya',    4.8,  67, 'fr', NOW())
ON CONFLICT DO NOTHING;

-- Articles -------------------------------------------------------------------
INSERT INTO "Listing"
  ("id","title","description","price","brand","size","color","category","condition","images","status","sellerId","createdAt")
VALUES
  ('1', $$Veste en jean Levi's vintage$$, $$Veste en jean Levi's authentique, coupe trucker. Délavage moyen, aucun accroc.$$, 120, $$Levi's$$, 'M', 'Bleu', 'WOMEN'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukjacket1/700/900','https://picsum.photos/seed/shukjacket2/700/900','https://picsum.photos/seed/shukjacket3/700/900'], 'ACTIVE'::"ListingStatus", 's1', NOW() - INTERVAL '1 day'),
  ('2', $$Robe d'été fleurie Zara$$, $$Robe légère idéale pour l'été. Taille S, jamais portée, étiquette présente.$$, 75, 'Zara', 'S', 'Multicolore', 'WOMEN'::"Category", 'NEW_WITH_TAGS'::"Condition", ARRAY['https://picsum.photos/seed/shukdress1/700/900','https://picsum.photos/seed/shukdress2/700/900'], 'ACTIVE'::"ListingStatus", 's3', NOW() - INTERVAL '2 days'),
  ('3', $$Sneakers Nike Air Max 90$$, $$Air Max 90, pointure 43. Quelques traces sur la semelle, beaucoup de vie devant elles.$$, 210, 'Nike', '43', 'Blanc', 'MEN'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shuksneakers1/700/900','https://picsum.photos/seed/shuksneakers2/700/900'], 'ACTIVE'::"ListingStatus", 's2', NOW() - INTERVAL '3 days'),
  ('4', $$iPhone 12 64 Go$$, $$iPhone 12 débloqué, batterie à 87%. Vendu avec coque et chargeur. Écran impeccable.$$, 1450, 'Apple', '-', 'Noir', 'ELECTRONICS'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukiphone1/700/900','https://picsum.photos/seed/shukiphone2/700/900'], 'ACTIVE'::"ListingStatus", 's4', NOW() - INTERVAL '1 day'),
  ('5', $$Pull en laine mérinos$$, $$Pull col rond en laine mérinos, très chaud et doux. Couleur camel intemporelle.$$, 95, 'COS', 'L', 'Camel', 'MEN'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shuksweater1/700/900'], 'ACTIVE'::"ListingStatus", 's5', NOW() - INTERVAL '5 days'),
  ('6', $$Sac à main en cuir$$, $$Sac en cuir véritable, plusieurs compartiments. Patine élégante. Bandoulière réglable.$$, 180, 'Mango', '-', 'Marron', 'WOMEN'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukbag1/700/900','https://picsum.photos/seed/shukbag2/700/900'], 'ACTIVE'::"ListingStatus", 's1', NOW() - INTERVAL '4 days'),
  ('7', $$Lego City — caserne de pompiers$$, $$Set complet avec notice. Toutes les pièces présentes. Parfait pour les 6 ans et +.$$, 60, 'Lego', '-', 'Multicolore', 'TOYS'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shuklego1/700/900'], 'ACTIVE'::"ListingStatus", 's2', NOW() - INTERVAL '6 days'),
  ('8', $$Manteau d'hiver enfant$$, $$Doudoune enfant 6 ans, très chaude, capuche amovible. Quelques traces d'usage.$$, 70, 'H&M Kids', '6 ans', 'Rouge', 'KIDS'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukkidcoat1/700/900'], 'ACTIVE'::"ListingStatus", 's3', NOW() - INTERVAL '7 days'),
  ('9', $$Casque Sony WH-1000XM4$$, $$Réduction de bruit excellente. Vendu avec étui et câbles. État quasi neuf.$$, 650, 'Sony', '-', 'Noir', 'ELECTRONICS'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukheadphones1/700/900','https://picsum.photos/seed/shukheadphones2/700/900'], 'ACTIVE'::"ListingStatus", 's4', NOW() - INTERVAL '2 days'),
  ('10', $$Tapis berbère fait main$$, $$Tapis en laine tissé main, motifs géométriques. 120 x 180 cm.$$, 320, 'Artisanat', '120x180', 'Écru', 'HOME'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukrug1/700/900'], 'ACTIVE'::"ListingStatus", 's5', NOW() - INTERVAL '8 days'),
  ('11', $$Palette de maquillage$$, $$Palette de fards à paupières, utilisée une fois, désinfectée. 18 teintes.$$, 45, 'Urban Decay', '-', 'Multicolore', 'BEAUTY'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukmakeup1/700/900'], 'ACTIVE'::"ListingStatus", 's1', NOW() - INTERVAL '3 days'),
  ('12', $$Ballon de basket Spalding$$, $$Ballon taille 7, bon grip. Idéal extérieur. Légèrement usé.$$, 40, 'Spalding', '7', 'Orange', 'SPORTS'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukball1/700/900'], 'ACTIVE'::"ListingStatus", 's2', NOW() - INTERVAL '9 days'),
  ('13', $$Lot de 5 romans en français$$, $$Cinq romans contemporains en très bon état. Idéal pour l'été.$$, 50, NULL, NULL, NULL, 'BOOKS'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukbooks1/700/900'], 'ACTIVE'::"ListingStatus", 's3', NOW() - INTERVAL '4 days'),
  ('14', $$Chemise en lin$$, $$Chemise 100% lin, parfaite pour la chaleur. Coupe décontractée. Très peu portée.$$, 65, 'Uniqlo', 'M', 'Beige', 'MEN'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukshirt1/700/900'], 'ACTIVE'::"ListingStatus", 's5', NOW() - INTERVAL '2 days'),
  ('15', $$Lampe de bureau design$$, $$Lampe articulée style architecte, abat-jour métal. Fonctionne parfaitement.$$, 85, 'IKEA', '-', 'Noir', 'HOME'::"Category", 'GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shuklamp1/700/900'], 'SOLD'::"ListingStatus", 's4', NOW() - INTERVAL '12 days'),
  ('16', $$Montre automatique Seiko$$, $$Montre automatique avec bracelet acier. Révisée récemment. Boîte d'origine incluse.$$, 540, 'Seiko', '-', 'Argent', 'MEN'::"Category", 'VERY_GOOD'::"Condition", ARRAY['https://picsum.photos/seed/shukwatch1/700/900','https://picsum.photos/seed/shukwatch2/700/900'], 'ACTIVE'::"ListingStatus", 's1', NOW() - INTERVAL '1 day')
ON CONFLICT DO NOTHING;

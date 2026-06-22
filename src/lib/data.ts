import type { Conversation, Item, Review, Seller } from './types';

const img = (seed: string) => `https://picsum.photos/seed/${seed}/700/900`;

export const sellers: Seller[] = [
  { id: 's1', name: 'Noa L.', avatar: 'https://i.pravatar.cc/120?img=5', rating: 4.9, reviews: 213, city: 'Tel Aviv' },
  { id: 's2', name: 'David M.', avatar: 'https://i.pravatar.cc/120?img=12', rating: 4.7, reviews: 88, city: 'Jérusalem' },
  { id: 's3', name: 'Maya R.', avatar: 'https://i.pravatar.cc/120?img=32', rating: 5.0, reviews: 41, city: 'Haïfa' },
  { id: 's4', name: 'Yossi B.', avatar: 'https://i.pravatar.cc/120?img=15', rating: 4.6, reviews: 156, city: 'Beer Sheva' },
  { id: 's5', name: 'Tamar K.', avatar: 'https://i.pravatar.cc/120?img=45', rating: 4.8, reviews: 67, city: 'Netanya' }
];

const day = 24 * 60 * 60 * 1000;
const ago = (days: number) => new Date(Date.now() - days * day).toISOString();

export const items: Item[] = [
  {
    id: '1', title: "Veste en jean Levi's vintage", description: "Veste en jean Levi's authentique, coupe trucker. Délavage moyen, aucun accroc. Portée quelques fois.",
    price: 120, brand: "Levi's", size: 'M', color: 'Bleu', category: 'women', condition: 'very_good',
    images: [img('shukjacket1'), img('shukjacket2'), img('shukjacket3')], sellerId: 's1', favorites: 34, sold: false, createdAt: ago(1)
  },
  {
    id: '2', title: 'Robe d\'été fleurie Zara', description: "Robe légère idéale pour l'été israélien. Taille S, jamais portée, étiquette encore présente.",
    price: 75, brand: 'Zara', size: 'S', color: 'Multicolore', category: 'women', condition: 'new_with_tags',
    images: [img('shukdress1'), img('shukdress2')], sellerId: 's3', favorites: 58, sold: false, createdAt: ago(2)
  },
  {
    id: '3', title: 'Sneakers Nike Air Max 90', description: 'Air Max 90, pointure 43. Quelques traces d\'usure sur la semelle mais beaucoup de vie devant elles.',
    price: 210, brand: 'Nike', size: '43', color: 'Blanc', category: 'men', condition: 'good',
    images: [img('shuksneakers1'), img('shuksneakers2')], sellerId: 's2', favorites: 91, sold: false, createdAt: ago(3)
  },
  {
    id: '4', title: 'iPhone 12 64 Go', description: 'iPhone 12 débloqué, batterie à 87%. Vendu avec coque et chargeur. Écran impeccable.',
    price: 1450, brand: 'Apple', size: '-', color: 'Noir', category: 'electronics', condition: 'very_good',
    images: [img('shukiphone1'), img('shukiphone2')], sellerId: 's4', favorites: 120, sold: false, createdAt: ago(1)
  },
  {
    id: '5', title: 'Pull en laine mérinos', description: 'Pull col rond en laine mérinos, très chaud et doux. Couleur camel intemporelle.',
    price: 95, brand: 'COS', size: 'L', color: 'Camel', category: 'men', condition: 'very_good',
    images: [img('shuksweater1')], sellerId: 's5', favorites: 22, sold: false, createdAt: ago(5)
  },
  {
    id: '6', title: 'Sac à main en cuir', description: 'Sac en cuir véritable, plusieurs compartiments. Patine élégante. Bandoulière réglable.',
    price: 180, brand: 'Mango', size: '-', color: 'Marron', category: 'women', condition: 'good',
    images: [img('shukbag1'), img('shukbag2')], sellerId: 's1', favorites: 47, sold: false, createdAt: ago(4)
  },
  {
    id: '7', title: 'Lego City — caserne de pompiers', description: 'Set complet avec notice. Toutes les pièces présentes. Parfait pour les 6 ans et +.',
    price: 60, brand: 'Lego', size: '-', color: 'Multicolore', category: 'toys', condition: 'very_good',
    images: [img('shuklego1')], sellerId: 's2', favorites: 12, sold: false, createdAt: ago(6)
  },
  {
    id: '8', title: 'Manteau d\'hiver enfant', description: 'Doudoune enfant 6 ans, très chaude, capuche amovible. Quelques traces d\'usage.',
    price: 70, brand: 'H&M Kids', size: '6 ans', color: 'Rouge', category: 'kids', condition: 'good',
    images: [img('shukkidcoat1')], sellerId: 's3', favorites: 8, sold: false, createdAt: ago(7)
  },
  {
    id: '9', title: 'Casque audio Sony WH-1000XM4', description: 'Réduction de bruit excellente. Vendu avec étui et câbles. État quasi neuf.',
    price: 650, brand: 'Sony', size: '-', color: 'Noir', category: 'electronics', condition: 'very_good',
    images: [img('shukheadphones1'), img('shukheadphones2')], sellerId: 's4', favorites: 73, sold: false, createdAt: ago(2)
  },
  {
    id: '10', title: 'Tapis berbère fait main', description: 'Tapis en laine tissé main, motifs géométriques. 120 x 180 cm. Apporte de la chaleur à toute pièce.',
    price: 320, brand: 'Artisanat', size: '120x180', color: 'Écru', category: 'home', condition: 'good',
    images: [img('shukrug1')], sellerId: 's5', favorites: 39, sold: false, createdAt: ago(8)
  },
  {
    id: '11', title: 'Palette de maquillage', description: 'Palette de fards à paupières, utilisée une seule fois, désinfectée. 18 teintes.',
    price: 45, brand: 'Urban Decay', size: '-', color: 'Multicolore', category: 'beauty', condition: 'very_good',
    images: [img('shukmakeup1')], sellerId: 's1', favorites: 15, sold: false, createdAt: ago(3)
  },
  {
    id: '12', title: 'Ballon de basket Spalding', description: 'Ballon taille 7, bon grip. Idéal extérieur. Légèrement usé mais parfaitement gonflé.',
    price: 40, brand: 'Spalding', size: '7', color: 'Orange', category: 'sports', condition: 'good',
    images: [img('shukball1')], sellerId: 's2', favorites: 6, sold: false, createdAt: ago(9)
  },
  {
    id: '13', title: 'Lot de 5 romans en français', description: 'Cinq romans contemporains en très bon état. Idéal pour l\'été. Voir photos pour les titres.',
    price: 50, brand: '-', size: '-', color: '-', category: 'books', condition: 'very_good',
    images: [img('shukbooks1')], sellerId: 's3', favorites: 19, sold: false, createdAt: ago(4)
  },
  {
    id: '14', title: 'Chemise en lin', description: 'Chemise 100% lin, parfaite pour la chaleur. Coupe décontractée. Très peu portée.',
    price: 65, brand: 'Uniqlo', size: 'M', color: 'Beige', category: 'men', condition: 'very_good',
    images: [img('shukshirt1')], sellerId: 's5', favorites: 27, sold: false, createdAt: ago(2)
  },
  {
    id: '15', title: 'Lampe de bureau design', description: 'Lampe articulée style architecte, abat-jour métal. Fonctionne parfaitement.',
    price: 85, brand: 'IKEA', size: '-', color: 'Noir', category: 'home', condition: 'good',
    images: [img('shuklamp1')], sellerId: 's4', favorites: 11, sold: true, createdAt: ago(12)
  },
  {
    id: '16', title: 'Montre automatique', description: 'Montre automatique avec bracelet acier. Révisée récemment. Boîte d\'origine incluse.',
    price: 540, brand: 'Seiko', size: '-', color: 'Argent', category: 'men', condition: 'very_good',
    images: [img('shukwatch1'), img('shukwatch2')], sellerId: 's1', favorites: 64, sold: false, createdAt: ago(1)
  }
];

export const conversations: Conversation[] = [
  {
    id: 'c1', itemId: '1', withSeller: 's1', lastMessage: 'Bonjour ! L\'article est toujours disponible ?', unread: 1,
    messages: [
      { id: 'm1', fromMe: true, text: "Bonjour ! La veste est toujours disponible ?", at: ago(0.2) },
      { id: 'm2', fromMe: false, text: "Oui, tout à fait ! Elle taille M, elle vous irait bien.", at: ago(0.1) }
    ]
  },
  {
    id: 'c2', itemId: '4', withSeller: 's4', lastMessage: 'Je peux faire 1400 ₪, ça vous va ?', unread: 0,
    messages: [
      { id: 'm3', fromMe: true, text: "Bonjour, accepteriez-vous 1400 ₪ pour l'iPhone ?", at: ago(1.2) },
      { id: 'm4', fromMe: false, text: "Je peux faire 1400 ₪, ça vous va ?", at: ago(1.0) }
    ]
  }
];

export const reviews: Review[] = [
  { id: 'r1', sellerId: 's1', authorName: 'Léa', authorAvatar: 'https://i.pravatar.cc/80?img=20', rating: 5, comment: 'Article conforme et envoi très rapide. Vendeuse au top !', at: ago(3) },
  { id: 'r2', sellerId: 's1', authorName: 'Avi', authorAvatar: 'https://i.pravatar.cc/80?img=33', rating: 5, comment: 'Parfait, exactement comme décrit. Merci !', at: ago(10) },
  { id: 'r3', sellerId: 's1', authorName: 'Sarah', authorAvatar: 'https://i.pravatar.cc/80?img=47', rating: 4, comment: 'Bon état, communication agréable.', at: ago(25) },
  { id: 'r4', sellerId: 's2', authorName: 'Daniel', authorAvatar: 'https://i.pravatar.cc/80?img=11', rating: 5, comment: 'Super sneakers, emballage soigné.', at: ago(6) },
  { id: 'r5', sellerId: 's2', authorName: 'Rina', authorAvatar: 'https://i.pravatar.cc/80?img=24', rating: 4, comment: 'Très bien, livraison un peu lente mais rien à redire.', at: ago(14) },
  { id: 'r6', sellerId: 's3', authorName: 'Yael', authorAvatar: 'https://i.pravatar.cc/80?img=44', rating: 5, comment: 'Robe magnifique, encore mieux en vrai !', at: ago(2) },
  { id: 'r7', sellerId: 's4', authorName: 'Tom', authorAvatar: 'https://i.pravatar.cc/80?img=13', rating: 5, comment: 'iPhone nickel, transaction sérieuse.', at: ago(5) },
  { id: 'r8', sellerId: 's5', authorName: 'Noa', authorAvatar: 'https://i.pravatar.cc/80?img=49', rating: 5, comment: 'Pull très chaud et doux, je recommande.', at: ago(8) }
];

// ---- Accès aux données (couche mock — sera remplacée par Prisma) ----

export function getItems(): Item[] {
  return [...items];
}

export function getItem(id: string): Item | undefined {
  return items.find((i) => i.id === id);
}

export function getSeller(id: string): Seller | undefined {
  return sellers.find((s) => s.id === id);
}

export function getRecentItems(limit = 12): Item[] {
  return [...items]
    .filter((i) => !i.sold)
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export function getPopularItems(limit = 8): Item[] {
  return [...items]
    .filter((i) => !i.sold)
    .sort((a, b) => b.favorites - a.favorites)
    .slice(0, limit);
}

export function getSimilarItems(item: Item, limit = 4): Item[] {
  return items
    .filter((i) => i.id !== item.id && i.category === item.category && !i.sold)
    .slice(0, limit);
}

export function getListingsBySeller(sellerId: string): Item[] {
  return items.filter((i) => i.sellerId === sellerId);
}

export function getReviewsForSeller(sellerId: string): Review[] {
  return reviews
    .filter((r) => r.sellerId === sellerId)
    .sort((a, b) => +new Date(b.at) - +new Date(a.at));
}

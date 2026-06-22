export type CategoryKey =
  | 'women'
  | 'men'
  | 'kids'
  | 'home'
  | 'electronics'
  | 'beauty'
  | 'sports'
  | 'books'
  | 'toys'
  | 'other';

export type ConditionKey =
  | 'new_with_tags'
  | 'new_without_tags'
  | 'very_good'
  | 'good'
  | 'satisfactory';

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  city: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  brand: string;
  size: string;
  color: string;
  category: CategoryKey;
  subcategory?: string | null;
  condition: ConditionKey;
  images: string[];
  sellerId: string;
  favorites: number;
  sold: boolean;
  createdAt: string; // ISO date
}

export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  at: string;
}

export interface Conversation {
  id: string;
  itemId: string;
  withSeller: string; // seller id
  lastMessage: string;
  unread: number;
  messages: ChatMessage[];
}

export interface Review {
  id: string;
  sellerId: string;
  authorName: string;
  authorAvatar: string;
  rating: number; // 1..5
  comment: string;
  at: string; // ISO date
  role?: string; // SELLER | BUYER (rôle de la personne notée)
}

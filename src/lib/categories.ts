import type { CategoryKey, ConditionKey } from './types';

export const categories: { key: CategoryKey; emoji: string }[] = [
  { key: 'women', emoji: '👗' },
  { key: 'men', emoji: '👔' },
  { key: 'kids', emoji: '🧸' },
  { key: 'home', emoji: '🛋️' },
  { key: 'electronics', emoji: '📱' },
  { key: 'beauty', emoji: '💄' },
  { key: 'sports', emoji: '⚽' },
  { key: 'books', emoji: '📚' },
  { key: 'toys', emoji: '🪀' },
  { key: 'other', emoji: '✨' }
];

export const conditions: ConditionKey[] = [
  'new_with_tags',
  'new_without_tags',
  'very_good',
  'good',
  'satisfactory'
];

// Sous-catégories par catégorie (clés traduites dans le namespace "subcategories")
export const subcategories: Record<CategoryKey, string[]> = {
  women: ['w_dresses', 'w_tops', 'w_shoes', 'w_bags', 'w_outerwear'],
  men: ['m_tops', 'm_pants', 'm_shoes', 'm_accessories'],
  kids: ['k_baby', 'k_clothing', 'k_shoes', 'k_toys'],
  home: ['h_furniture', 'h_decor', 'h_kitchen'],
  electronics: ['e_phones', 'e_computers', 'e_audio', 'e_gaming'],
  beauty: ['b_makeup', 'b_skincare', 'b_fragrance'],
  sports: ['s_fitness', 's_outdoor', 's_cycling'],
  books: ['bk_fiction', 'bk_nonfiction', 'bk_children'],
  toys: ['t_games', 't_figures', 't_educational'],
  other: []
};

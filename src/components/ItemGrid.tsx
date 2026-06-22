import type { Item } from '@/lib/types';
import { ItemCard } from './ItemCard';

export function ItemGrid({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}

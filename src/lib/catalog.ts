import type { Listing } from '@prisma/client';
import { prisma } from './prisma';
import * as mock from './data';
import type { CategoryKey, ConditionKey, Item, Review, Seller } from './types';

const DEFAULT_AVATAR = 'https://i.pravatar.cc/120?img=8';
const PLACEHOLDER_IMG = 'https://picsum.photos/seed/sellthem/700/900';

function toItem(l: Listing): Item {
  return {
    id: l.id,
    title: l.title,
    description: l.description,
    price: l.price,
    brand: l.brand || '-',
    size: l.size || '-',
    color: l.color || '-',
    category: (l.category as string).toLowerCase() as CategoryKey,
    subcategory: l.subcategory || null,
    condition: (l.condition as string).toLowerCase() as ConditionKey,
    images: l.images && l.images.length ? l.images : [PLACEHOLDER_IMG],
    sellerId: l.sellerId,
    favorites: 0,
    sold: (l.status as string) === 'SOLD',
    createdAt: l.createdAt.toISOString()
  };
}

/** Nombre d'annonces en base (−1 si la base ne répond pas). */
async function listingCount(): Promise<number> {
  try {
    return await prisma.listing.count();
  } catch {
    return -1;
  }
}

export async function getItemById(id: string): Promise<Item | undefined> {
  try {
    const l = await prisma.listing.findUnique({ where: { id } });
    if (l) return toItem(l);
  } catch {
    /* repli démo */
  }
  return mock.getItem(id);
}

export async function getSellerById(id: string): Promise<Seller | undefined> {
  try {
    const u = await prisma.user.findUnique({ where: { id } });
    if (u) {
      return {
        id: u.id,
        name: u.name,
        avatar: u.avatar || DEFAULT_AVATAR,
        rating: u.rating,
        reviews: u.reviewsCount,
        city: u.city || ''
      };
    }
  } catch {
    /* repli démo */
  }
  return mock.getSeller(id);
}

export async function getSimilarItems(item: Item, limit = 4): Promise<Item[]> {
  try {
    const ls = await prisma.listing.findMany({
      where: {
        category: item.category.toUpperCase() as never,
        status: 'ACTIVE' as never,
        NOT: { id: item.id }
      },
      take: limit,
      orderBy: { createdAt: 'desc' }
    });
    if (ls.length) return ls.map(toItem);
  } catch {
    /* repli démo */
  }
  return mock.getSimilarItems(item, limit);
}

export async function getRecentItems(limit = 10): Promise<Item[]> {
  if ((await listingCount()) > 0) {
    try {
      const ls = await prisma.listing.findMany({
        where: { status: 'ACTIVE' as never },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      if (ls.length) return ls.map(toItem);
    } catch {
      /* repli démo */
    }
  }
  return mock.getRecentItems(limit);
}

export async function getPopularItems(limit = 5): Promise<Item[]> {
  if ((await listingCount()) > 0) {
    try {
      const ls = await prisma.listing.findMany({
        where: { status: 'ACTIVE' as never },
        orderBy: { createdAt: 'desc' },
        take: limit
      });
      if (ls.length) return ls.map(toItem);
    } catch {
      /* repli démo */
    }
  }
  return mock.getPopularItems(limit);
}

export async function getListingsBySellerId(id: string): Promise<Item[]> {
  try {
    const ls = await prisma.listing.findMany({
      where: { sellerId: id },
      orderBy: { createdAt: 'desc' }
    });
    if (ls.length) return ls.map(toItem);
  } catch {
    /* repli démo */
  }
  return mock.getListingsBySeller(id);
}

export async function getReviewsForSeller(id: string): Promise<Review[]> {
  try {
    const rs = await prisma.review.findMany({
      where: { targetId: id },
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, avatar: true } } }
    });
    if (rs.length) {
      return rs.map((r) => ({
        id: r.id,
        sellerId: r.targetId,
        authorName: r.author?.name || '—',
        authorAvatar: r.author?.avatar || DEFAULT_AVATAR,
        rating: r.rating,
        comment: r.comment || '',
        at: r.createdAt.toISOString(),
        role: r.targetRole
      }));
    }
  } catch {
    /* repli démo */
  }
  return mock.getReviewsForSeller(id);
}

export interface SearchParams {
  q?: string;
  category?: string;
  subcategory?: string;
  condition?: string;
  brand?: string;
  size?: string;
  color?: string;
  min?: string;
  max?: string;
  sort?: string;
}

function mockSearch(p: SearchParams): Item[] {
  let result = mock.getItems().filter((i) => !i.sold);
  if (p.q) {
    const q = p.q.toLowerCase();
    result = result.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        i.brand.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  }
  if (p.category) result = result.filter((i) => i.category === p.category);
  if (p.subcategory) result = result.filter((i) => i.subcategory === p.subcategory);
  if (p.condition) result = result.filter((i) => i.condition === p.condition);
  if (p.brand) result = result.filter((i) => i.brand.toLowerCase().includes(p.brand!.toLowerCase()));
  if (p.size) result = result.filter((i) => i.size.toLowerCase().includes(p.size!.toLowerCase()));
  if (p.color) result = result.filter((i) => i.color.toLowerCase().includes(p.color!.toLowerCase()));
  if (p.min) result = result.filter((i) => i.price >= Number(p.min));
  if (p.max) result = result.filter((i) => i.price <= Number(p.max));
  switch (p.sort) {
    case 'price_asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price_desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'popular':
      result.sort((a, b) => b.favorites - a.favorites);
      break;
    default:
      result.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }
  return result;
}

export async function searchItems(p: SearchParams): Promise<Item[]> {
  if ((await listingCount()) > 0) {
    try {
      const where: Record<string, unknown> = { status: 'ACTIVE' };
      if (p.category) where.category = p.category.toUpperCase();
      if (p.subcategory) where.subcategory = p.subcategory;
      if (p.condition) where.condition = p.condition.toUpperCase();
      if (p.brand) where.brand = { contains: p.brand, mode: 'insensitive' };
      if (p.size) where.size = { contains: p.size, mode: 'insensitive' };
      if (p.color) where.color = { contains: p.color, mode: 'insensitive' };
      if (p.min || p.max) {
        where.price = {
          ...(p.min ? { gte: Number(p.min) } : {}),
          ...(p.max ? { lte: Number(p.max) } : {})
        };
      }
      if (p.q) {
        where.OR = [
          { title: { contains: p.q, mode: 'insensitive' } },
          { brand: { contains: p.q, mode: 'insensitive' } },
          { description: { contains: p.q, mode: 'insensitive' } }
        ];
      }
      let orderBy: Record<string, string> = { createdAt: 'desc' };
      if (p.sort === 'price_asc') orderBy = { price: 'asc' };
      else if (p.sort === 'price_desc') orderBy = { price: 'desc' };

      const ls = await prisma.listing.findMany({ where: where as never, orderBy: orderBy as never, take: 100 });
      return ls.map(toItem);
    } catch {
      /* repli démo */
    }
  }
  return mockSearch(p);
}

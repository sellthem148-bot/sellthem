'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

interface FavoritesContextValue {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  count: number;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

const STORAGE_KEY = 'sellthem:favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const me = await fetch('/api/auth/me').then((r) => r.json());
        if (cancelled) return;
        if (me.user) {
          setLoggedIn(true);
          const data = await fetch('/api/favorites').then((r) => r.json());
          if (!cancelled) setIds(data.ids || []);
          return;
        }
      } catch {
        /* ignore */
      }
      // invité : localStorage
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) setIds(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const toggle = useCallback(
    (id: string) => {
      setIds((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((x) => x !== id) : [...prev, id];

        if (loggedIn) {
          fetch('/api/favorites', {
            method: has ? 'DELETE' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ listingId: id })
          }).catch(() => {});
        } else {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
          } catch {
            /* ignore */
          }
        }
        return next;
      });
    },
    [loggedIn]
  );

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, isFavorite, toggle, count: ids.length }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}

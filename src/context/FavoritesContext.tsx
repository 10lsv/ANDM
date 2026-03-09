import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, FavoriteItem } from '../types';

interface FavoritesContextType {
  favorites: FavoriteItem[];
  categories: string[];
  addFavorite: (product: Product, category?: string) => void;
  removeFavorite: (code: string) => void;
  isFavorite: (code: string) => boolean;
  addCategory: (name: string) => void;
  getFavoritesByCategory: (category: string) => FavoriteItem[];
}

export const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  categories: ['Tous', 'Petit-déjeuner', 'Snacks', 'Boissons', 'Repas'],
  addFavorite: () => {},
  removeFavorite: () => {},
  isFavorite: () => false,
  addCategory: () => {},
  getFavoritesByCategory: () => [],
});

const STORAGE_KEY = '@nutriscan_favorites';
const CATEGORIES_KEY = '@nutriscan_categories';
const DEFAULT_CATEGORIES = ['Tous', 'Petit-déjeuner', 'Snacks', 'Boissons', 'Repas'];

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [categories, setCategories] = useState<string[]>(DEFAULT_CATEGORIES);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [favsData, catsData] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_KEY),
      ]);
      if (favsData) setFavorites(JSON.parse(favsData));
      if (catsData) setCategories(JSON.parse(catsData));
    } catch (e) {
      console.error('Error loading favorites:', e);
    }
  };

  const saveFavorites = async (newFavs: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs));
    } catch (e) {
      console.error('Error saving favorites:', e);
    }
  };

  const addFavorite = useCallback((product: Product, category: string = 'Tous') => {
    setFavorites((prev) => {
      if (prev.some((f) => f.product.code === product.code)) return prev;
      const newFavs = [{ product, category, addedAt: new Date().toISOString() }, ...prev];
      saveFavorites(newFavs);
      return newFavs;
    });
  }, []);

  const removeFavorite = useCallback((code: string) => {
    setFavorites((prev) => {
      const newFavs = prev.filter((f) => f.product.code !== code);
      saveFavorites(newFavs);
      return newFavs;
    });
  }, []);

  const isFavorite = useCallback(
    (code: string) => favorites.some((f) => f.product.code === code),
    [favorites]
  );

  const addCategory = useCallback((name: string) => {
    setCategories((prev) => {
      if (prev.includes(name)) return prev;
      const newCats = [...prev, name];
      AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(newCats));
      return newCats;
    });
  }, []);

  const getFavoritesByCategory = useCallback(
    (category: string) => {
      if (category === 'Tous') return favorites;
      return favorites.filter((f) => f.category === category);
    },
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, categories, addFavorite, removeFavorite, isFavorite, addCategory, getFavoritesByCategory }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

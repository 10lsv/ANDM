import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, ScanHistoryItem } from '../types';

interface HistoryContextType {
  history: ScanHistoryItem[];
  addToHistory: (product: Product) => void;
  clearHistory: () => void;
  removeFromHistory: (code: string) => void;
}

export const HistoryContext = createContext<HistoryContextType>({
  history: [],
  addToHistory: () => {},
  clearHistory: () => {},
  removeFromHistory: () => {},
});

const STORAGE_KEY = '@nutriscan_history';
const MAX_HISTORY = 50;

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const [history, setHistory] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((data) => {
      if (data) setHistory(JSON.parse(data));
    });
  }, []);

  const saveHistory = async (items: ScanHistoryItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving history:', e);
    }
  };

  const addToHistory = useCallback((product: Product) => {
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.product.code !== product.code);
      const newHistory = [
        { product, scannedAt: new Date().toISOString() },
        ...filtered,
      ].slice(0, MAX_HISTORY);
      saveHistory(newHistory);
      return newHistory;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const removeFromHistory = useCallback((code: string) => {
    setHistory((prev) => {
      const newHistory = prev.filter((h) => h.product.code !== code);
      saveHistory(newHistory);
      return newHistory;
    });
  }, []);

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};

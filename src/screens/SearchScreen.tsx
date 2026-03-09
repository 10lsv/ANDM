import React, { useState, useContext, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { FavoritesContext } from '../context/FavoritesContext';
import { SearchBar } from '../components/SearchBar';
import { ProductCard } from '../components/ProductCard';
import { searchProducts } from '../utils/api';
import { Product } from '../types';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export const SearchScreen = () => {
  const { colors, isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);

  // Debounce + abort
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const doSearch = useCallback(async (text: string, pageNum: number = 1) => {
    // Cancel previous request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    if (!text.trim()) {
      setProducts([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    if (pageNum === 1) {
      setLoading(true);
      setSearched(true);
    }

    try {
      const result = await searchProducts(text.trim(), pageNum, controller.signal);
      if (controller.signal.aborted) return;

      if (pageNum === 1) {
        setProducts(result.products);
      } else {
        setProducts((prev) => [...prev, ...result.products]);
      }
      setTotalCount(result.count);
      setPage(pageNum);
    } catch (e) {
      // ignore aborted
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  // Auto-search with 400ms debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (!query.trim()) {
      setProducts([]);
      setSearched(false);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearched(true);

    debounceRef.current = setTimeout(() => {
      doSearch(query);
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const loadMore = useCallback(async () => {
    if (loadingMore || loading || products.length >= totalCount) return;
    setLoadingMore(true);
    doSearch(query, page + 1);
  }, [query, page, loadingMore, loading, products.length, totalCount, doSearch]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Rechercher</Text>
      </View>

      <SearchBar value={query} onChangeText={setQuery} onSubmit={() => doSearch(query)} autoFocus />

      {loading && products.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Recherche en cours...</Text>
        </View>
      ) : searched && products.length === 0 && !loading ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun résultat</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Essayez avec d'autres mots-clés
          </Text>
        </View>
      ) : !searched ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="nutrition-outline" size={48} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Recherchez un produit</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Tapez le nom d'un produit, d'une marque ou d'une catégorie
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item, index) => item.code + index}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              index={index}
              onPress={() => navigation.navigate('ProductDetail', { product: item })}
              isFavorite={isFavorite(item.code)}
              onFavoriteToggle={() =>
                isFavorite(item.code) ? removeFavorite(item.code) : addFavorite(item)
              }
            />
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListHeaderComponent={
            <View style={styles.resultHeader}>
              <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
                {totalCount} résultat{totalCount > 1 ? 's' : ''}
              </Text>
              {loading && <ActivityIndicator size="small" color={colors.primary} />}
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator size="small" color={colors.primary} />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 12,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  resultCount: {
    fontSize: 13,
    fontWeight: '500',
  },
  footerLoading: {
    padding: 20,
  },
});

import React, { useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { HistoryContext } from '../context/HistoryContext';
import { FavoritesContext } from '../context/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import { formatDate } from '../utils/helpers';
import { useNavigation } from '@react-navigation/native';

export const HistoryScreen = () => {
  const { colors, isDark } = useTheme();
  const { history, clearHistory, removeFromHistory } = useContext(HistoryContext);
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const navigation = useNavigation<any>();

  const handleClear = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Voulez-vous vraiment supprimer tout l\'historique de vos scans ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Effacer', style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Historique</Text>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClear}>
            <Text style={[styles.clearBtn, { color: colors.error }]}>Effacer</Text>
          </TouchableOpacity>
        )}
      </View>

      {history.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="time-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun historique</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Vos produits scannés apparaîtront ici
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item, index) => item.product.code + item.scannedAt + index}
          renderItem={({ item, index }) => (
            <View>
              <Text style={[styles.dateLabel, { color: colors.textSecondary }]}>
                {formatDate(item.scannedAt)}
              </Text>
              <ProductCard
                product={item.product}
                index={index}
                onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
                isFavorite={isFavorite(item.product.code)}
                onFavoriteToggle={() =>
                  isFavorite(item.product.code)
                    ? removeFavorite(item.product.code)
                    : addFavorite(item.product)
                }
              />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  clearBtn: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  listContent: {
    paddingVertical: 8,
  },
  dateLabel: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 2,
  },
});

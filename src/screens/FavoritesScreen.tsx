import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { FavoritesContext } from '../context/FavoritesContext';
import { ProductCard } from '../components/ProductCard';
import { useNavigation } from '@react-navigation/native';

export const FavoritesScreen = () => {
  const { colors, isDark } = useTheme();
  const { favorites, categories, removeFavorite, getFavoritesByCategory, addCategory } = useContext(FavoritesContext);
  const navigation = useNavigation<any>();
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  const filteredFavorites = getFavoritesByCategory(selectedCategory);

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName('');
      setShowAddCategory(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Favoris</Text>
        <TouchableOpacity onPress={() => setShowAddCategory(!showAddCategory)}>
          <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {showAddCategory && (
        <View style={[styles.addCategoryRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <TextInput
            style={[styles.addCategoryInput, { color: colors.text, borderColor: colors.border }]}
            placeholder="Nom de la catégorie..."
            placeholderTextColor={colors.textSecondary}
            value={newCategoryName}
            onChangeText={setNewCategoryName}
            onSubmitEditing={handleAddCategory}
            autoFocus
          />
          <TouchableOpacity
            style={[styles.addCategoryBtn, { backgroundColor: colors.primary }]}
            onPress={handleAddCategory}
          >
            <Text style={styles.addCategoryBtnText}>Ajouter</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryList}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryChip,
              {
                backgroundColor: selectedCategory === cat ? colors.primary : colors.card,
                borderColor: selectedCategory === cat ? colors.primary : colors.border,
              },
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.categoryChipText,
                { color: selectedCategory === cat ? '#FFFFFF' : colors.text },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {filteredFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={[styles.emptyIcon, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="heart-outline" size={48} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Aucun favori</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            Ajoutez des produits à vos favoris pour les retrouver facilement
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFavorites}
          keyExtractor={(item, index) => item.product.code + index}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item.product}
              index={index}
              onPress={() => navigation.navigate('ProductDetail', { product: item.product })}
              isFavorite
              onFavoriteToggle={() => removeFavorite(item.product.code)}
            />
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
    paddingBottom: 8,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  addCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    gap: 8,
  },
  addCategoryInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 14,
  },
  addCategoryBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  addCategoryBtnText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 14,
  },
  categoryList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  categoryChipText: {
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
});

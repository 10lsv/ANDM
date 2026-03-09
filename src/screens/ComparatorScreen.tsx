import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { Product } from '../types';
import { HistoryContext } from '../context/HistoryContext';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { getNutriScoreColor, getNovaGroupColor, getNovaGroupLabel } from '../utils/helpers';
import { fetchProductByBarcode, searchProducts } from '../utils/api';
import { useNavigation } from '@react-navigation/native';

export const ComparatorScreen = ({ route }: any) => {
  const navigation = useNavigation<any>();
  const { colors, isDark } = useTheme();
  const { history } = useContext(HistoryContext);
  const [product1, setProduct1] = useState<Product | null>(route?.params?.product1 || null);
  const [product2, setProduct2] = useState<Product | null>(route?.params?.product2 || null);
  const [selectingFor, setSelectingFor] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const result = await searchProducts(searchQuery.trim(), 1);
      setSearchResults(result.products);
    } catch (e) {
      console.error(e);
    } finally {
      setSearching(false);
    }
  };

  const selectProduct = (product: Product) => {
    if (selectingFor === 1) setProduct1(product);
    else setProduct2(product);
    setSelectingFor(null);
    setSearchQuery('');
    setSearchResults([]);
  };

  const compareValue = (val1: number, val2: number, lowerBetter: boolean = true) => {
    if (val1 === val2) return { color1: colors.text, color2: colors.text };
    const better = lowerBetter ? (val1 < val2 ? 1 : 2) : (val1 > val2 ? 1 : 2);
    return {
      color1: better === 1 ? colors.success : colors.error,
      color2: better === 2 ? colors.success : colors.error,
    };
  };

  const nutrients = [
    { key: 'energy_kcal_100g', label: 'Calories', unit: 'kcal', lowerBetter: true },
    { key: 'fat_100g', label: 'Graisses', unit: 'g', lowerBetter: true },
    { key: 'saturated-fat_100g', label: 'Saturées', unit: 'g', lowerBetter: true },
    { key: 'sugars_100g', label: 'Sucres', unit: 'g', lowerBetter: true },
    { key: 'fiber_100g', label: 'Fibres', unit: 'g', lowerBetter: false },
    { key: 'proteins_100g', label: 'Protéines', unit: 'g', lowerBetter: false },
    { key: 'salt_100g', label: 'Sel', unit: 'g', lowerBetter: true },
  ];

  if (selectingFor) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={styles.selectHeader}>
          <TouchableOpacity onPress={() => { setSelectingFor(null); setSearchResults([]); setSearchQuery(''); }}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[styles.selectTitle, { color: colors.text }]}>
            Produit {selectingFor}
          </Text>
        </View>

        <View style={[styles.searchRow, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Rechercher un produit..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            autoFocus
          />
        </View>

        {searching && <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />}

        <ScrollView showsVerticalScrollIndicator={false}>
          {searchResults.length > 0 && (
            <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Résultats</Text>
          )}
          {searchResults.map((p) => (
            <TouchableOpacity
              key={p.code}
              style={[styles.selectItem, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => selectProduct(p)}
            >
              {p.image_url ? (
                <Image source={{ uri: p.image_url }} style={styles.selectItemImage} />
              ) : (
                <View style={[styles.selectItemImagePlaceholder, { backgroundColor: colors.inputBackground }]}>
                  <Ionicons name="nutrition-outline" size={20} color={colors.textSecondary} />
                </View>
              )}
              <View style={styles.selectItemInfo}>
                <Text style={[styles.selectItemName, { color: colors.text }]} numberOfLines={1}>{p.product_name}</Text>
                <Text style={[styles.selectItemBrand, { color: colors.textSecondary }]}>{p.brands}</Text>
              </View>
              <NutriScoreBadge grade={p.nutriscore_grade} size="small" />
            </TouchableOpacity>
          ))}

          {history.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Historique récent</Text>
              {history.slice(0, 10).map((item) => (
                <TouchableOpacity
                  key={item.product.code}
                  style={[styles.selectItem, { backgroundColor: colors.card, borderColor: colors.border }]}
                  onPress={() => selectProduct(item.product)}
                >
                  {item.product.image_url ? (
                    <Image source={{ uri: item.product.image_url }} style={styles.selectItemImage} />
                  ) : (
                    <View style={[styles.selectItemImagePlaceholder, { backgroundColor: colors.inputBackground }]}>
                      <Ionicons name="nutrition-outline" size={20} color={colors.textSecondary} />
                    </View>
                  )}
                  <View style={styles.selectItemInfo}>
                    <Text style={[styles.selectItemName, { color: colors.text }]} numberOfLines={1}>
                      {item.product.product_name}
                    </Text>
                    <Text style={[styles.selectItemBrand, { color: colors.textSecondary }]}>
                      {item.product.brands}
                    </Text>
                  </View>
                  <NutriScoreBadge grade={item.product.nutriscore_grade} size="small" />
                </TouchableOpacity>
              ))}
            </>
          )}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: colors.text }]}>Comparateur</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Product selection */}
        <View style={styles.productSelectRow}>
          <TouchableOpacity
            style={[styles.productSlot, { backgroundColor: colors.card, borderColor: product1 ? colors.primary : colors.border }]}
            onPress={() => setSelectingFor(1)}
          >
            {product1 ? (
              <>
                {product1.image_url ? (
                  <Image source={{ uri: product1.image_url }} style={styles.slotImage} resizeMode="contain" />
                ) : (
                  <View style={[styles.slotImagePlaceholder, { backgroundColor: colors.inputBackground }]}>
                    <Ionicons name="nutrition-outline" size={24} color={colors.textSecondary} />
                  </View>
                )}
                <Text style={[styles.slotName, { color: colors.text }]} numberOfLines={2}>{product1.product_name}</Text>
                <NutriScoreBadge grade={product1.nutriscore_grade} size="small" />
              </>
            ) : (
              <>
                <View style={[styles.addIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="add" size={32} color={colors.primary} />
                </View>
                <Text style={[styles.slotPlaceholder, { color: colors.textSecondary }]}>Produit 1</Text>
              </>
            )}
          </TouchableOpacity>

          <View style={[styles.vsCircle, { backgroundColor: colors.accent }]}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          <TouchableOpacity
            style={[styles.productSlot, { backgroundColor: colors.card, borderColor: product2 ? colors.accent : colors.border }]}
            onPress={() => setSelectingFor(2)}
          >
            {product2 ? (
              <>
                {product2.image_url ? (
                  <Image source={{ uri: product2.image_url }} style={styles.slotImage} resizeMode="contain" />
                ) : (
                  <View style={[styles.slotImagePlaceholder, { backgroundColor: colors.inputBackground }]}>
                    <Ionicons name="nutrition-outline" size={24} color={colors.textSecondary} />
                  </View>
                )}
                <Text style={[styles.slotName, { color: colors.text }]} numberOfLines={2}>{product2.product_name}</Text>
                <NutriScoreBadge grade={product2.nutriscore_grade} size="small" />
              </>
            ) : (
              <>
                <View style={[styles.addIcon, { backgroundColor: colors.accent + '20' }]}>
                  <Ionicons name="add" size={32} color={colors.accent} />
                </View>
                <Text style={[styles.slotPlaceholder, { color: colors.textSecondary }]}>Produit 2</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Comparison table */}
        {product1 && product2 && (
          <View style={[styles.comparisonCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.comparisonTitle, { color: colors.text }]}>Comparaison nutritionnelle</Text>
            <Text style={[styles.comparisonSubtitle, { color: colors.textSecondary }]}>pour 100g</Text>

            {nutrients.map((nutrient) => {
              const val1 = (product1.nutriments as any)[nutrient.key] || 0;
              const val2 = (product2.nutriments as any)[nutrient.key] || 0;
              const comparison = compareValue(val1, val2, nutrient.lowerBetter);
              const maxVal = Math.max(val1, val2, 1);

              return (
                <View key={nutrient.key} style={[styles.compareRow, { borderBottomColor: colors.border }]}>
                  <View style={styles.compareLeft}>
                    <Text style={[styles.compareValue, { color: comparison.color1 }]}>
                      {val1.toFixed(1)}{nutrient.unit}
                    </Text>
                    <View style={styles.barContainer}>
                      <View
                        style={[styles.bar, styles.barLeft, { backgroundColor: colors.primary, width: `${(val1 / maxVal) * 100}%` }]}
                      />
                    </View>
                  </View>
                  <Text style={[styles.compareLabel, { color: colors.text }]}>{nutrient.label}</Text>
                  <View style={styles.compareRight}>
                    <Text style={[styles.compareValue, { color: comparison.color2 }]}>
                      {val2.toFixed(1)}{nutrient.unit}
                    </Text>
                    <View style={styles.barContainer}>
                      <View
                        style={[styles.bar, styles.barRight, { backgroundColor: colors.accent, width: `${(val2 / maxVal) * 100}%` }]}
                      />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {(!product1 || !product2) && (
          <View style={styles.instructionContainer}>
            <Ionicons name="git-compare-outline" size={40} color={colors.textSecondary} />
            <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
              Sélectionnez deux produits pour les comparer
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  productSelectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  productSlot: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    alignItems: 'center',
    minHeight: 180,
    justifyContent: 'center',
    gap: 8,
  },
  slotImage: {
    width: 80,
    height: 80,
  },
  slotImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slotName: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  addIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  slotPlaceholder: {
    fontSize: 14,
    fontWeight: '500',
  },
  vsCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  vsText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 12,
  },
  comparisonCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 2,
  },
  comparisonSubtitle: {
    fontSize: 12,
    marginBottom: 16,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  compareLeft: {
    flex: 1,
    alignItems: 'flex-end',
    gap: 4,
  },
  compareRight: {
    flex: 1,
    alignItems: 'flex-start',
    gap: 4,
  },
  compareLabel: {
    width: 80,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
  },
  compareValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  barContainer: {
    width: '80%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.05)',
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 2,
  },
  barLeft: {
    alignSelf: 'flex-end',
  },
  barRight: {
    alignSelf: 'flex-start',
  },
  instructionContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  instructionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  selectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    gap: 16,
  },
  selectTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
    height: 48,
    gap: 10,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  selectItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  selectItemImage: {
    width: 44,
    height: 44,
    borderRadius: 8,
  },
  selectItemImagePlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectItemInfo: {
    flex: 1,
  },
  selectItemName: {
    fontSize: 14,
    fontWeight: '600',
  },
  selectItemBrand: {
    fontSize: 12,
  },
});

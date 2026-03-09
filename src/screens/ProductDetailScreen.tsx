import React, { useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Animated,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../hooks/useTheme';
import { FavoritesContext } from '../context/FavoritesContext';
import { ProfileContext } from '../context/ProfileContext';
import { Product } from '../types';
import { NutriScoreBadge } from '../components/NutriScoreBadge';
import { getNutriScoreColor, getNovaGroupLabel, getNovaGroupColor, getEcoScoreColor } from '../utils/helpers';
import { getAllergenLabel } from '../utils/api';

const { width } = Dimensions.get('window');

export const ProductDetailScreen = ({ route, navigation }: any) => {
  const { product }: { product: Product } = route.params;
  const { colors, isDark } = useTheme();
  const { isFavorite, addFavorite, removeFavorite } = useContext(FavoritesContext);
  const { hasAllergenConflict } = useContext(ProfileContext);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const conflicts = hasAllergenConflict(product);
  const fav = isFavorite(product.code);

  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);

  const handleFavoriteToggle = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    if (fav) {
      removeFavorite(product.code);
    } else {
      addFavorite(product);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Découvre ${product.product_name} (${product.brands}) - Nutri-Score ${product.nutriscore_grade?.toUpperCase()} sur NutriScan!`,
      });
    } catch (e) {}
  };

  const handleCompare = () => {
    navigation.navigate('Comparator', { product1: product });
  };

  const nutrientData = [
    { label: 'Énergie', value: `${product.nutriments.energy_kcal_100g} kcal`, icon: 'flame-outline' },
    { label: 'Matières grasses', value: `${product.nutriments.fat_100g}g`, icon: 'water-outline' },
    { label: 'dont saturées', value: `${product.nutriments['saturated-fat_100g']}g`, sub: true },
    { label: 'Glucides', value: `${product.nutriments.carbohydrates_100g}g`, icon: 'nutrition-outline' },
    { label: 'dont sucres', value: `${product.nutriments.sugars_100g}g`, sub: true },
    { label: 'Fibres', value: `${product.nutriments.fiber_100g}g`, icon: 'leaf-outline' },
    { label: 'Protéines', value: `${product.nutriments.proteins_100g}g`, icon: 'barbell-outline' },
    { label: 'Sel', value: `${product.nutriments.salt_100g}g`, icon: 'cube-outline' },
  ];

  const imageOpacity = scrollY.interpolate({
    inputRange: [0, 200],
    outputRange: [1, 0.3],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Animated.ScrollView
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Product Image */}
        <Animated.View style={[styles.imageSection, { opacity: imageOpacity }]}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.productImage} resizeMode="contain" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="nutrition-outline" size={64} color={colors.textSecondary} />
            </View>
          )}
        </Animated.View>

        <Animated.View style={[styles.content, { backgroundColor: colors.background, opacity: fadeAnim }]}>
          {/* Header */}
          <View style={styles.productHeader}>
            <View style={styles.productHeaderLeft}>
              <Text style={[styles.productName, { color: colors.text }]}>{product.product_name}</Text>
              <Text style={[styles.productBrand, { color: colors.textSecondary }]}>{product.brands}</Text>
              {product.quantity ? (
                <Text style={[styles.productQuantity, { color: colors.textSecondary }]}>{product.quantity}</Text>
              ) : null}
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleFavoriteToggle} style={styles.actionBtn}>
                <Ionicons name={fav ? 'heart' : 'heart-outline'} size={24} color={fav ? colors.error : colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleShare} style={styles.actionBtn}>
                <Ionicons name="share-outline" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleCompare} style={styles.actionBtn}>
                <Ionicons name="git-compare-outline" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Allergen Warning */}
          {conflicts.length > 0 && (
            <View style={[styles.allergenWarning, { backgroundColor: colors.error + '15', borderColor: colors.error + '40' }]}>
              <Ionicons name="warning" size={24} color={colors.error} />
              <View style={styles.allergenContent}>
                <Text style={[styles.allergenTitle, { color: colors.error }]}>Alerte Allergène</Text>
                <Text style={[styles.allergenText, { color: colors.text }]}>
                  Contient : {conflicts.map(getAllergenLabel).join(', ')}
                </Text>
              </View>
            </View>
          )}

          {/* Scores Section */}
          <View style={[styles.scoresCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Scores</Text>
            <View style={styles.scoresRow}>
              {/* Nutri-Score */}
              <View style={styles.scoreItem}>
                <Text style={[styles.scoreLabel, { color: colors.textSecondary }]}>Nutri-Score</Text>
                <NutriScoreBadge grade={product.nutriscore_grade} size="large" />
              </View>
            </View>
            <View style={styles.scoresRow}>
              {/* NOVA */}
              <View style={[styles.scoreBadge, { backgroundColor: getNovaGroupColor(product.nova_group) + '20' }]}>
                <Text style={[styles.scoreBadgeValue, { color: getNovaGroupColor(product.nova_group) }]}>
                  NOVA {product.nova_group || '?'}
                </Text>
                <Text style={[styles.scoreBadgeLabel, { color: colors.textSecondary }]}>
                  {getNovaGroupLabel(product.nova_group)}
                </Text>
              </View>
              {/* Eco-Score */}
              <View style={[styles.scoreBadge, { backgroundColor: getEcoScoreColor(product.ecoscore_grade) + '20' }]}>
                <Text style={[styles.scoreBadgeValue, { color: getEcoScoreColor(product.ecoscore_grade) }]}>
                  Eco {product.ecoscore_grade?.toUpperCase() || '?'}
                </Text>
                <Text style={[styles.scoreBadgeLabel, { color: colors.textSecondary }]}>Eco-Score</Text>
              </View>
            </View>
          </View>

          {/* Nutrients */}
          <View style={[styles.nutrientsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Valeurs nutritionnelles</Text>
            <Text style={[styles.cardSubtitle, { color: colors.textSecondary }]}>pour 100g</Text>
            {nutrientData.map((item, index) => (
              <View
                key={item.label}
                style={[
                  styles.nutrientRow,
                  item.sub && styles.nutrientRowSub,
                  index < nutrientData.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 },
                ]}
              >
                <View style={styles.nutrientLeft}>
                  {item.icon && !item.sub && (
                    <Ionicons name={item.icon as any} size={18} color={colors.primary} style={styles.nutrientIcon} />
                  )}
                  <Text
                    style={[
                      item.sub ? styles.nutrientLabelSub : styles.nutrientLabel,
                      { color: item.sub ? colors.textSecondary : colors.text },
                    ]}
                  >
                    {item.label}
                  </Text>
                </View>
                <Text style={[styles.nutrientValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Ingredients */}
          <View style={[styles.ingredientsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Ingrédients</Text>
            <Text style={[styles.ingredientsText, { color: colors.textSecondary }]}>
              {product.ingredients_text}
            </Text>
          </View>

          {/* Allergens */}
          {product.allergens_tags && product.allergens_tags.length > 0 && (
            <View style={[styles.allergensCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.cardTitle, { color: colors.text }]}>Allergènes</Text>
              <View style={styles.allergenTags}>
                {product.allergens_tags.map((tag) => (
                  <View
                    key={tag}
                    style={[
                      styles.allergenTag,
                      {
                        backgroundColor: conflicts.includes(tag) ? colors.error + '20' : colors.warning + '20',
                        borderColor: conflicts.includes(tag) ? colors.error + '50' : colors.warning + '50',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.allergenTagText,
                        { color: conflicts.includes(tag) ? colors.error : colors.warning },
                      ]}
                    >
                      {getAllergenLabel(tag)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 40 }} />
        </Animated.View>
      </Animated.ScrollView>

      {/* Back button */}
      <TouchableOpacity
        style={[styles.backButton, { backgroundColor: isDark ? 'rgba(30,41,59,0.9)' : 'rgba(255,255,255,0.9)' }]}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={colors.text} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageSection: {
    height: 300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  productImage: {
    width: width * 0.5,
    height: 220,
  },
  imagePlaceholder: {
    width: width * 0.5,
    height: 220,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -28,
    paddingTop: 24,
    paddingHorizontal: 16,
  },
  productHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  productHeaderLeft: {
    flex: 1,
    marginRight: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 4,
  },
  productBrand: {
    fontSize: 16,
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 14,
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    padding: 8,
  },
  allergenWarning: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  allergenContent: {
    flex: 1,
  },
  allergenTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  allergenText: {
    fontSize: 14,
  },
  scoresCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: -8,
    marginBottom: 12,
  },
  scoresRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  scoreItem: {
    flex: 1,
    gap: 8,
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  scoreBadge: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreBadgeValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  scoreBadgeLabel: {
    fontSize: 11,
    marginTop: 2,
  },
  nutrientsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  nutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  nutrientRowSub: {
    paddingLeft: 34,
  },
  nutrientLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nutrientIcon: {
    marginRight: 10,
  },
  nutrientLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  nutrientLabelSub: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  nutrientValue: {
    fontSize: 15,
    fontWeight: '600',
  },
  ingredientsCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  ingredientsText: {
    fontSize: 14,
    lineHeight: 22,
  },
  allergensCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  allergenTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  allergenTagText: {
    fontSize: 13,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

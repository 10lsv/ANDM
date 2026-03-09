import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Product } from '../types';
import { useTheme } from '../hooks/useTheme';
import { NutriScoreBadge } from './NutriScoreBadge';
import { truncate } from '../utils/helpers';

interface Props {
  product: Product;
  onPress: () => void;
  onFavoriteToggle?: () => void;
  isFavorite?: boolean;
  showFavorite?: boolean;
  index?: number;
}

export const ProductCard = ({ product, onPress, onFavoriteToggle, isFavorite, showFavorite = true, index = 0 }: Props) => {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
      <TouchableOpacity
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image source={{ uri: product.image_url }} style={styles.image} resizeMode="contain" />
          ) : (
            <View style={[styles.imagePlaceholder, { backgroundColor: colors.inputBackground }]}>
              <Ionicons name="nutrition-outline" size={32} color={colors.textSecondary} />
            </View>
          )}
        </View>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
            {truncate(product.product_name, 50)}
          </Text>
          <Text style={[styles.brand, { color: colors.textSecondary }]} numberOfLines={1}>
            {product.brands}
          </Text>
          <View style={styles.badges}>
            <NutriScoreBadge grade={product.nutriscore_grade} size="small" />
          </View>
        </View>
        {showFavorite && onFavoriteToggle && (
          <TouchableOpacity onPress={onFavoriteToggle} style={styles.favoriteBtn} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={22}
              color={isFavorite ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        )}
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} style={styles.chevron} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  imageContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
  },
  brand: {
    fontSize: 13,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  favoriteBtn: {
    padding: 8,
  },
  chevron: {
    marginLeft: 4,
  },
});

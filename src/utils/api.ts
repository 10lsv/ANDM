import { Product } from '../types';

const BASE_URL = 'https://world.openfoodfacts.org';

export const fetchProductByBarcode = async (barcode: string): Promise<Product | null> => {
  try {
    const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
    const data = await response.json();
    if (data.status === 1 && data.product) {
      return normalizeProduct(data.product);
    }
    return null;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
};

// In-memory cache for search results
const searchCache = new Map<string, { products: Product[]; count: number; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const searchProducts = async (
  query: string,
  page: number = 1,
  signal?: AbortSignal
): Promise<{ products: Product[]; count: number }> => {
  const cacheKey = `${query.toLowerCase()}_${page}`;

  // Check cache
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { products: cached.products, count: cached.count };
  }

  try {
    const response = await fetch(
      `${BASE_URL}/cgi/search.pl?search_terms=${encodeURIComponent(query)}&search_simple=1&action=process&json=1&page=${page}&page_size=20`,
      { signal }
    );
    const data = await response.json();
    const result = {
      products: (data.products || []).map(normalizeProduct),
      count: data.count || 0,
    };

    // Store in cache
    searchCache.set(cacheKey, { ...result, timestamp: Date.now() });

    // Evict old entries if cache gets too big
    if (searchCache.size > 50) {
      const oldest = [...searchCache.entries()].sort((a, b) => a[1].timestamp - b[1].timestamp)[0];
      searchCache.delete(oldest[0]);
    }

    return result;
  } catch (error: any) {
    if (error?.name === 'AbortError') {
      return { products: [], count: 0 };
    }
    console.error('Error searching products:', error);
    return { products: [], count: 0 };
  }
};

const normalizeProduct = (raw: any): Product => ({
  code: raw.code || '',
  product_name: raw.product_name || raw.product_name_fr || 'Produit inconnu',
  brands: raw.brands || 'Marque inconnue',
  image_url: raw.image_url || raw.image_front_url || '',
  image_front_url: raw.image_front_url || raw.image_url || '',
  nutriscore_grade: raw.nutriscore_grade || raw.nutrition_grades || 'unknown',
  ecoscore_grade: raw.ecoscore_grade || 'unknown',
  nova_group: raw.nova_group || undefined,
  ingredients_text: raw.ingredients_text || raw.ingredients_text_fr || 'Ingrédients non disponibles',
  allergens_tags: raw.allergens_tags || [],
  nutriments: {
    energy_kcal_100g: raw.nutriments?.energy_kcal_100g || raw.nutriments?.['energy-kcal_100g'] || 0,
    fat_100g: raw.nutriments?.fat_100g || 0,
    'saturated-fat_100g': raw.nutriments?.['saturated-fat_100g'] || 0,
    carbohydrates_100g: raw.nutriments?.carbohydrates_100g || 0,
    sugars_100g: raw.nutriments?.sugars_100g || 0,
    fiber_100g: raw.nutriments?.fiber_100g || 0,
    proteins_100g: raw.nutriments?.proteins_100g || 0,
    salt_100g: raw.nutriments?.salt_100g || 0,
    sodium_100g: raw.nutriments?.sodium_100g || 0,
  },
  categories_tags: raw.categories_tags || [],
  quantity: raw.quantity || '',
  nutrition_grades: raw.nutrition_grades || raw.nutriscore_grade || 'unknown',
});

export const getAllergenLabel = (tag: string): string => {
  const labels: Record<string, string> = {
    'en:gluten': 'Gluten',
    'en:milk': 'Lait',
    'en:eggs': 'Œufs',
    'en:nuts': 'Fruits à coque',
    'en:peanuts': 'Arachides',
    'en:soybeans': 'Soja',
    'en:celery': 'Céleri',
    'en:mustard': 'Moutarde',
    'en:sesame-seeds': 'Sésame',
    'en:fish': 'Poisson',
    'en:crustaceans': 'Crustacés',
    'en:molluscs': 'Mollusques',
    'en:lupin': 'Lupin',
    'en:sulphur-dioxide-and-sulphites': 'Sulfites',
  };
  return labels[tag] || tag.replace('en:', '').replace(/-/g, ' ');
};

export interface Product {
  code: string;
  product_name: string;
  brands: string;
  image_url: string;
  image_front_url?: string;
  nutriscore_grade: string;
  ecoscore_grade?: string;
  nova_group?: number;
  ingredients_text: string;
  allergens_tags: string[];
  nutriments: Nutriments;
  categories_tags?: string[];
  quantity?: string;
  nutrition_grades?: string;
}

export interface Nutriments {
  energy_kcal_100g: number;
  fat_100g: number;
  'saturated-fat_100g': number;
  carbohydrates_100g: number;
  sugars_100g: number;
  fiber_100g: number;
  proteins_100g: number;
  salt_100g: number;
  sodium_100g?: number;
}

export interface ScanHistoryItem {
  product: Product;
  scannedAt: string;
}

export interface FavoriteItem {
  product: Product;
  category: string;
  addedAt: string;
}

export interface AllergenProfile {
  allergens: string[];
}

export interface UserProfile {
  name: string;
  allergens: string[];
  dailyCalorieGoal: number;
}

export type NutriScoreGrade = 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown';

export type RootStackParamList = {
  MainTabs: undefined;
  ProductDetail: { product: Product };
  Comparator: { product1?: Product; product2?: Product };
};

export type TabParamList = {
  Home: undefined;
  Scanner: undefined;
  Search: undefined;
  Favorites: undefined;
  Profile: undefined;
};

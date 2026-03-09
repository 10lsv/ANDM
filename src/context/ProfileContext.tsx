import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, Product } from '../types';

interface DailyIntake {
  date: string;
  calories: number;
  products: string[];
}

interface ProfileContextType {
  profile: UserProfile;
  dailyIntake: DailyIntake;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleAllergen: (allergen: string) => void;
  logProduct: (product: Product) => void;
  hasAllergenConflict: (product: Product) => string[];
}

const DEFAULT_PROFILE: UserProfile = {
  name: '',
  allergens: [],
  dailyCalorieGoal: 2000,
};

const getTodayKey = () => new Date().toISOString().split('T')[0];

export const ProfileContext = createContext<ProfileContextType>({
  profile: DEFAULT_PROFILE,
  dailyIntake: { date: getTodayKey(), calories: 0, products: [] },
  updateProfile: () => {},
  toggleAllergen: () => {},
  logProduct: () => {},
  hasAllergenConflict: () => [],
});

const PROFILE_KEY = '@nutriscan_profile';
const INTAKE_KEY = '@nutriscan_daily_intake';

const COMMON_ALLERGENS = [
  'en:gluten',
  'en:milk',
  'en:eggs',
  'en:nuts',
  'en:peanuts',
  'en:soybeans',
  'en:celery',
  'en:mustard',
  'en:sesame-seeds',
  'en:fish',
  'en:crustaceans',
  'en:molluscs',
  'en:lupin',
  'en:sulphur-dioxide-and-sulphites',
];

export { COMMON_ALLERGENS };

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [dailyIntake, setDailyIntake] = useState<DailyIntake>({
    date: getTodayKey(),
    calories: 0,
    products: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileData, intakeData] = await Promise.all([
        AsyncStorage.getItem(PROFILE_KEY),
        AsyncStorage.getItem(INTAKE_KEY),
      ]);
      if (profileData) setProfile(JSON.parse(profileData));
      if (intakeData) {
        const parsed = JSON.parse(intakeData);
        if (parsed.date === getTodayKey()) {
          setDailyIntake(parsed);
        }
      }
    } catch (e) {
      console.error('Error loading profile:', e);
    }
  };

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile((prev) => {
      const newProfile = { ...prev, ...updates };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  const toggleAllergen = useCallback((allergen: string) => {
    setProfile((prev) => {
      const allergens = prev.allergens.includes(allergen)
        ? prev.allergens.filter((a) => a !== allergen)
        : [...prev.allergens, allergen];
      const newProfile = { ...prev, allergens };
      AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(newProfile));
      return newProfile;
    });
  }, []);

  const logProduct = useCallback((product: Product) => {
    setDailyIntake((prev) => {
      const today = getTodayKey();
      const base = prev.date === today ? prev : { date: today, calories: 0, products: [] };
      const newIntake = {
        ...base,
        calories: base.calories + (product.nutriments?.energy_kcal_100g || 0),
        products: [...base.products, product.code],
      };
      AsyncStorage.setItem(INTAKE_KEY, JSON.stringify(newIntake));
      return newIntake;
    });
  }, []);

  const hasAllergenConflict = useCallback(
    (product: Product): string[] => {
      if (!product.allergens_tags || profile.allergens.length === 0) return [];
      return product.allergens_tags.filter((tag) => profile.allergens.includes(tag));
    },
    [profile.allergens]
  );

  return (
    <ProfileContext.Provider
      value={{ profile, dailyIntake, updateProfile, toggleAllergen, logProduct, hasAllergenConflict }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

import React, { useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Dimensions,
  Switch,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../hooks/useTheme';
import { ProfileContext, COMMON_ALLERGENS } from '../context/ProfileContext';
import { getAllergenLabel } from '../utils/api';

const { width } = Dimensions.get('window');

export const ProfileScreen = () => {
  const { colors, isDark, toggleTheme } = useTheme();
  const { profile, dailyIntake, updateProfile, toggleAllergen } = useContext(ProfileContext);
  const progressAnim = useRef(new Animated.Value(0)).current;

  const calorieProgress = Math.min(dailyIntake.calories / profile.dailyCalorieGoal, 1);

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: calorieProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [calorieProgress]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const progressColor = calorieProgress > 1 ? colors.error : calorieProgress > 0.8 ? colors.warning : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profil</Text>
        </View>

        {/* Dark Mode Toggle */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={[styles.settingIcon, { backgroundColor: isDark ? '#312E81' : '#FEF3C7' }]}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={20} color={isDark ? '#A78BFA' : '#F59E0B'} />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Mode sombre</Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Daily Nutrition Dashboard */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="analytics-outline" size={22} color={colors.primary} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Suivi nutritionnel du jour</Text>
          </View>

          <View style={styles.calorieSection}>
            <View style={styles.calorieHeader}>
              <Text style={[styles.calorieConsumed, { color: colors.text }]}>
                {Math.round(dailyIntake.calories)}
              </Text>
              <Text style={[styles.calorieGoal, { color: colors.textSecondary }]}>
                / {profile.dailyCalorieGoal} kcal
              </Text>
            </View>
            <View style={[styles.progressBar, { backgroundColor: colors.inputBackground }]}>
              <Animated.View
                style={[styles.progressFill, { backgroundColor: progressColor, width: progressWidth }]}
              />
            </View>
            <Text style={[styles.productsScanned, { color: colors.textSecondary }]}>
              {dailyIntake.products.length} produit{dailyIntake.products.length > 1 ? 's' : ''} scanné{dailyIntake.products.length > 1 ? 's' : ''} aujourd'hui
            </Text>
          </View>

          {/* Calorie goal setting */}
          <View style={[styles.goalRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.goalLabel, { color: colors.textSecondary }]}>Objectif calorique :</Text>
            <View style={styles.goalInputRow}>
              <TouchableOpacity
                style={[styles.goalBtn, { backgroundColor: colors.inputBackground }]}
                onPress={() => updateProfile({ dailyCalorieGoal: Math.max(500, profile.dailyCalorieGoal - 100) })}
              >
                <Ionicons name="remove" size={18} color={colors.text} />
              </TouchableOpacity>
              <Text style={[styles.goalValue, { color: colors.text }]}>{profile.dailyCalorieGoal}</Text>
              <TouchableOpacity
                style={[styles.goalBtn, { backgroundColor: colors.inputBackground }]}
                onPress={() => updateProfile({ dailyCalorieGoal: profile.dailyCalorieGoal + 100 })}
              >
                <Ionicons name="add" size={18} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Allergen Profile */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="shield-checkmark-outline" size={22} color={colors.warning} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>Profil allergènes</Text>
          </View>
          <Text style={[styles.allergenDescription, { color: colors.textSecondary }]}>
            Sélectionnez vos allergènes pour recevoir des alertes lors des scans.
          </Text>
          <View style={styles.allergenGrid}>
            {COMMON_ALLERGENS.map((allergen) => {
              const isSelected = profile.allergens.includes(allergen);
              return (
                <TouchableOpacity
                  key={allergen}
                  style={[
                    styles.allergenChip,
                    {
                      backgroundColor: isSelected ? colors.warning + '20' : colors.inputBackground,
                      borderColor: isSelected ? colors.warning : colors.border,
                    },
                  ]}
                  onPress={() => toggleAllergen(allergen)}
                >
                  <Ionicons
                    name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={18}
                    color={isSelected ? colors.warning : colors.textSecondary}
                  />
                  <Text
                    style={[
                      styles.allergenChipText,
                      { color: isSelected ? colors.warning : colors.text },
                    ]}
                  >
                    {getAllergenLabel(allergen)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* App Info */}
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cardHeader}>
            <Ionicons name="information-circle-outline" size={22} color={colors.accent} />
            <Text style={[styles.cardTitle, { color: colors.text }]}>À propos</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Application</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>NutriScan</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Version</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>1.0.0</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>API</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>OpenFoodFacts</Text>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  calorieSection: {
    marginBottom: 12,
  },
  calorieHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 10,
  },
  calorieConsumed: {
    fontSize: 36,
    fontWeight: '800',
  },
  calorieGoal: {
    fontSize: 16,
    marginLeft: 4,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  productsScanned: {
    fontSize: 13,
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  goalLabel: {
    fontSize: 14,
  },
  goalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  goalBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalValue: {
    fontSize: 16,
    fontWeight: '700',
    minWidth: 50,
    textAlign: 'center',
  },
  allergenDescription: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
    marginTop: -8,
  },
  allergenGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  allergenChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  allergenChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
});

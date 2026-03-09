import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeColors {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  accent: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  nutriScoreA: string;
  nutriScoreB: string;
  nutriScoreC: string;
  nutriScoreD: string;
  nutriScoreE: string;
  tabBar: string;
  tabBarInactive: string;
  shadow: string;
  inputBackground: string;
}

const lightTheme: ThemeColors = {
  background: '#F5F7FA',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#1A1A2E',
  textSecondary: '#6B7280',
  primary: '#10B981',
  primaryLight: '#D1FAE5',
  accent: '#6366F1',
  border: '#E5E7EB',
  error: '#EF4444',
  success: '#10B981',
  warning: '#F59E0B',
  nutriScoreA: '#038141',
  nutriScoreB: '#85BB2F',
  nutriScoreC: '#FECB02',
  nutriScoreD: '#EE8100',
  nutriScoreE: '#E63E11',
  tabBar: '#FFFFFF',
  tabBarInactive: '#9CA3AF',
  shadow: '#000000',
  inputBackground: '#F3F4F6',
};

const darkTheme: ThemeColors = {
  background: '#0F172A',
  surface: '#1E293B',
  card: '#1E293B',
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  primary: '#34D399',
  primaryLight: '#064E3B',
  accent: '#818CF8',
  border: '#334155',
  error: '#F87171',
  success: '#34D399',
  warning: '#FBBF24',
  nutriScoreA: '#34D399',
  nutriScoreB: '#A3E635',
  nutriScoreC: '#FDE047',
  nutriScoreD: '#FB923C',
  nutriScoreE: '#F87171',
  tabBar: '#1E293B',
  tabBarInactive: '#64748B',
  shadow: '#000000',
  inputBackground: '#334155',
};

interface ThemeContextType {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  colors: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('theme').then((value) => {
      if (value === 'dark') setIsDark(true);
    });
  }, []);

  const toggleTheme = () => {
    const newValue = !isDark;
    setIsDark(newValue);
    AsyncStorage.setItem('theme', newValue ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: isDark ? darkTheme : lightTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

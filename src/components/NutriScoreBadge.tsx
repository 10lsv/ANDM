import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getNutriScoreColor } from '../utils/helpers';
import { useTheme } from '../hooks/useTheme';

interface Props {
  grade: string;
  size?: 'small' | 'medium' | 'large';
}

export const NutriScoreBadge = ({ grade, size = 'medium' }: Props) => {
  const { colors } = useTheme();
  const letter = grade?.toUpperCase() || '?';
  const color = getNutriScoreColor(grade, colors);
  const grades = ['A', 'B', 'C', 'D', 'E'];

  const dimensions = {
    small: { height: 28, fontSize: 12, dotSize: 6 },
    medium: { height: 36, fontSize: 14, dotSize: 8 },
    large: { height: 48, fontSize: 18, dotSize: 10 },
  }[size];

  return (
    <View style={[styles.container, { height: dimensions.height }]}>
      {grades.map((g) => {
        const gColor = getNutriScoreColor(g.toLowerCase(), colors);
        const isActive = g === letter;
        return (
          <View
            key={g}
            style={[
              styles.grade,
              {
                backgroundColor: isActive ? gColor : 'transparent',
                borderColor: gColor,
                borderWidth: isActive ? 0 : 1.5,
                height: dimensions.height,
                minWidth: dimensions.height,
                borderRadius: 8,
              },
            ]}
          >
            <Text
              style={[
                styles.gradeText,
                {
                  color: isActive ? '#FFFFFF' : gColor,
                  fontSize: dimensions.fontSize,
                  fontWeight: isActive ? '800' : '600',
                },
              ]}
            >
              {g}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  grade: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  gradeText: {
    textAlign: 'center',
  },
});

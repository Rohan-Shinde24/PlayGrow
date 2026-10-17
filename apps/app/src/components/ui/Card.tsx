import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, BorderRadius, Spacing, Shadows } from '@/constants';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'green';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  style,
}) => {
  return (
    <View style={[styles.base, styles[variant], styles[`padding_${padding}`], style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  default: {
    backgroundColor: Colors.white,
    ...Shadows.md,
  },
  elevated: {
    backgroundColor: Colors.white,
    ...Shadows.lg,
  },
  outlined: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  green: {
    backgroundColor: Colors.primary,
  },
  padding_none: {
    padding: 0,
  },
  padding_sm: {
    padding: Spacing.sm,
  },
  padding_md: {
    padding: Spacing.lg,
  },
  padding_lg: {
    padding: Spacing.xl,
  },
});

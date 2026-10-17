import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, BorderRadius } from '@/constants';

interface BadgeProps {
  count?: number;
  color?: string;
  size?: 'sm' | 'md';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  count,
  color = Colors.error,
  size = 'sm',
  dot = false,
}) => {
  if (dot) {
    return <View style={[styles.dot, { backgroundColor: color }]} />;
  }

  if (count === undefined || count <= 0) return null;

  return (
    <View style={[styles.badge, styles[`badge_${size}`], { backgroundColor: color }]}>
      <Text style={[styles.text, styles[`text_${size}`]]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -4,
    right: -4,
  },
  badge_sm: {
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
  },
  badge_md: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
  },
  text: {
    color: Colors.white,
    fontWeight: '700',
  },
  text_sm: {
    fontSize: 9,
  },
  text_md: {
    fontSize: Typography.fontSize.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: 'absolute',
    top: 0,
    right: 0,
  },
});

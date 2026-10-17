import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useScreenInsets } from '@/hooks';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

interface ScreenHeaderProps {
  title: string;
  /** Content rendered on the trailing edge of the header. */
  right?: React.ReactNode;
  /** Overrides the default `router.back()` behaviour. */
  onBack?: () => void;
}

/**
 * Back-button header used by the stacked (non-tab) screens. Applies the
 * safe-area top inset so the title never sits under the status bar.
 */
export const ScreenHeader: React.FC<ScreenHeaderProps> = ({ title, right, onBack }) => {
  const { headerTop } = useScreenInsets();

  return (
    <View style={[styles.header, { paddingTop: headerTop }]}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={onBack ?? (() => router.back())}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.backIcon}>‹</Text>
      </TouchableOpacity>

      <Text style={styles.headerTitle} numberOfLines={1}>
        {title}
      </Text>

      {right}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: -2,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
});

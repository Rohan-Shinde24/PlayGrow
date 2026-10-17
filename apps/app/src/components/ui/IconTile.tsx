import React, { type ComponentProps } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';
import { Button } from './Button';

export type IconName = ComponentProps<typeof Ionicons>['name'];

interface IconTileProps {
  icon: IconName;
  /** Side length of the tile. Defaults to 44. */
  size?: number;
  /** Icon color. Defaults to the brand primary. */
  color?: string;
  /** Tile background. Defaults to the soft primary background. */
  background?: string;
  radius?: number;
}

/**
 * Rounded square used to present a vector icon. This is the standard way the
 * app renders icons for game statuses, transactions, settings rows, etc.
 */
export const IconTile: React.FC<IconTileProps> = ({
  icon,
  size = 44,
  color = Colors.primary,
  background = Colors.primaryBg,
  radius,
}) => {
  return (
    <View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderRadius: radius ?? Math.round(size * 0.3),
          backgroundColor: background,
        },
      ]}
    >
      <Ionicons name={icon} size={Math.round(size * 0.5)} color={color} />
    </View>
  );
};

interface EmptyStateProps {
  icon: IconName;
  title: string;
  message?: string;
  actionTitle?: string;
  onAction?: () => void;
  /** Reduces the vertical padding so it fits inside cards / lists. */
  compact?: boolean;
}

/** Friendly placeholder shown whenever a screen has no data yet. */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  message,
  actionTitle,
  onAction,
  compact = false,
}) => {
  return (
    <View style={[styles.empty, compact && styles.emptyCompact]}>
      <View style={styles.emptyIcon}>
        <Ionicons name={icon} size={30} color={Colors.primary} />
      </View>
      <Text style={styles.emptyTitle}>{title}</Text>
      {!!message && <Text style={styles.emptyMessage}>{message}</Text>}
      {!!actionTitle && onAction && (
        <Button
          title={actionTitle}
          onPress={onAction}
          variant="outline"
          size="sm"
          style={styles.emptyAction}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  tile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['4xl'],
    paddingHorizontal: Spacing['2xl'],
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.border,
  },
  emptyCompact: {
    paddingVertical: Spacing.xl,
    marginHorizontal: 0,
  },
  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: Spacing.xs,
    lineHeight: 20,
  },
  emptyAction: {
    marginTop: Spacing.lg,
  },
});

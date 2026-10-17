import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Game } from '@/store/slices/gamesSlice';
import { BorderRadius, Colors, Shadows, Spacing, Typography } from '@/constants';

interface GameCardProps {
  game: Game;
  onPress: () => void;
  showNewBadge?: boolean;
  layout?: 'standard' | 'horizontal' | 'compact' | 'grid';
}

export function GameCard({
  game,
  onPress,
  showNewBadge = false,
  layout = 'standard',
}: GameCardProps) {
  if (layout === 'compact') {
    return (
      <View
        style={[styles.card, styles.compactCard]}
      >
        <TouchableOpacity
          style={[styles.artwork, styles.compactArtwork, { backgroundColor: game.backgroundColor }]}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`View ${game.title}, ${game.category} game`}
        >
          {showNewBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          <Ionicons name={game.icon} size={34} color={game.accentColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
          <Text style={styles.compactTitle} numberOfLines={1}>{game.title}</Text>
        </TouchableOpacity>
        <Text style={styles.compactCategory} numberOfLines={1}>{game.category}</Text>
        <View style={styles.compactMeta}>
          <Ionicons name="cash-outline" size={12} color={Colors.secondary} />
          <Text style={styles.compactMetaText}>
            {game.isPopular ? 'Popular' : `${game.rewards} coins`}
          </Text>
        </View>
      </View>
    );
  }

  if (layout === 'horizontal') {
    return (
      <View style={[styles.card, styles.horizontalCard]}>
        <TouchableOpacity
          style={[styles.artwork, styles.horizontalArtwork, { backgroundColor: game.backgroundColor }]}
          onPress={onPress}
          activeOpacity={0.85}
          accessibilityRole="button"
          accessibilityLabel={`View ${game.title}, ${game.category} game`}
        >
          {showNewBadge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>NEW</Text>
            </View>
          )}
          <Ionicons name={game.icon} size={36} color={game.accentColor} />
        </TouchableOpacity>
        <View style={styles.horizontalContent}>
          <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
            <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
            <Text style={styles.category}>{game.category}</Text>
          </TouchableOpacity>
          <View style={styles.horizontalFooter}>
            <View style={styles.reward}>
              <Ionicons name="cash-outline" size={14} color={Colors.secondary} />
              <Text style={styles.rewardText}>{game.rewards} coins</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.card, layout === 'grid' && styles.gridCard]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={`View ${game.title}, ${game.category} game`}
    >
      <View style={[styles.artwork, { backgroundColor: game.backgroundColor }]}>
        {showNewBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>NEW</Text>
          </View>
        )}
        <Ionicons name={game.icon} size={42} color={game.accentColor} />
      </View>
      <Text style={styles.title} numberOfLines={1}>{game.title}</Text>
      <Text style={styles.category}>{game.category}</Text>
      <View style={styles.reward}>
        <Ionicons name="cash-outline" size={14} color={Colors.secondary} />
        <Text style={styles.rewardText}>{game.rewards} coins</Text>
      </View>
      {layout === 'grid' && (
        <View style={styles.gridAction}>
          <Text style={styles.gridActionText}>View Game</Text>
          <Ionicons name="arrow-forward" size={14} color={Colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#EDF0EE',
    ...Shadows.sm,
  },
  horizontalCard: {
    width: 300,
    minHeight: 96,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  compactCard: {
    width: 132,
    padding: Spacing.sm,
  },
  compactArtwork: {
    width: '100%',
    height: 102,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
  },
  compactTitle: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  compactCategory: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    color: Colors.text.secondary,
    marginTop: 1,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  compactMetaText: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    color: Colors.text.secondary,
    fontWeight: '600',
  },
  gridCard: {
    width: '48%',
    marginBottom: Spacing.md,
  },
  gridAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  gridActionText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.primary,
  },
  artwork: {
    height: 112,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  horizontalArtwork: {
    width: 72,
    height: 72,
    marginBottom: 0,
    flexShrink: 0,
  },
  horizontalContent: {
    flex: 1,
    justifyContent: 'space-between',
    minHeight: 72,
  },
  badge: {
    position: 'absolute',
    top: Spacing.xs,
    left: Spacing.xs,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: BorderRadius.xs,
    backgroundColor: Colors.primary,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 9,
    lineHeight: 12,
    fontWeight: '800',
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  category: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  reward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.xs,
  },
  horizontalFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  rewardText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.secondary,
  },
});

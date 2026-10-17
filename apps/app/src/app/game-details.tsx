import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useScreenInsets } from '@/hooks';
import { Button, EmptyState } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function GameDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { top, bottom } = useScreenInsets();
  const games = useAppSelector((state) => state.games.games);
  const game = games.find((g) => g.id === id);

  const tabs = ['Overview', 'Rewards', 'About'];
  const [selectedTab, setSelectedTab] = React.useState('Overview');

  if (!game) {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.backBtn, styles.emptyBackBtn, { marginTop: top + Spacing.sm }]}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <EmptyState
          icon="game-controller-outline"
          title="Game not available"
          message="Game details will appear here when game data is available."
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Hero Section */}
      <View style={[styles.hero, { backgroundColor: game.backgroundColor }]}>
        <View style={[styles.heroHeader, { top: top + Spacing.sm }]}>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.heroActionBtn}>
              <Ionicons name="heart-outline" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroActionBtn}>
              <Ionicons name="share-outline" size={20} color={Colors.text.primary} />
            </TouchableOpacity>
          </View>
        </View>
        <Ionicons name={game.icon} size={88} color={game.accentColor} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Game Info */}
        <View style={styles.gameInfo}>
          <View style={styles.gameInfoLeft}>
            <View style={[styles.gameIconLarge, { backgroundColor: game.backgroundColor }]}>
              <Ionicons name={game.icon} size={32} color={game.accentColor} />
            </View>
            <View style={styles.gameInfoText}>
              <Text style={styles.gameTitle}>{game.title}</Text>
              <Text style={styles.gameCategory}>{game.category}</Text>
              <View style={styles.gameMetaRow}>
                {!!game.downloads && (
                  <Text style={styles.metaText}>{game.downloads} downloads</Text>
                )}
              </View>
            </View>
          </View>
          {game.rating > 0 && (
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingValue}>{game.rating}</Text>
              <Ionicons name="star" size={14} color={Colors.secondary} />
              {!!game.reviews && <Text style={styles.ratingReviews}>{game.reviews} reviews</Text>}
            </View>
          )}
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.tabActive]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* About Game */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Game</Text>
          <Text style={styles.aboutText}>{game.description}</Text>
        </View>

        {/* Game Details */}
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Ionicons name="time-outline" size={20} color={Colors.primary} style={styles.detailIcon} />
            <Text style={styles.detailValue}>~ {game.sessionTime}</Text>
            <Text style={styles.detailLabel}>per session</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="phone-portrait-outline" size={20} color={Colors.primary} style={styles.detailIcon} />
            <Text style={styles.detailValue}>{game.platforms.join(' & ')}</Text>
            <Text style={styles.detailLabel}>Supported</Text>
          </View>
          <View style={styles.detailDivider} />
          <View style={styles.detailItem}>
            <Ionicons name="globe-outline" size={20} color={Colors.primary} style={styles.detailIcon} />
            <Text style={styles.detailValue}>{game.requiresOnline ? 'Online' : 'Offline'}</Text>
            <Text style={styles.detailLabel}>{game.requiresOnline ? 'Required' : 'Play'}</Text>
          </View>
        </View>

        <View style={{ height: bottom + 100 }} />
      </ScrollView>

      {/* Play Now Button */}
      <View style={[styles.bottomBar, { paddingBottom: bottom + Spacing.lg }]}>
        <Button
          title="Play Now"
          onPress={() => {}}
          size="lg"
          fullWidth
          style={styles.playButton}
          icon={<Ionicons name="play" size={16} color={Colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  hero: {
    height: 200,
    backgroundColor: Colors.primaryBg,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    zIndex: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  emptyBackBtn: {
    marginLeft: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  backIcon: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text.primary,
    marginTop: -2,
  },
  heroActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  heroActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Game Info
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: Spacing.lg,
    alignItems: 'flex-start',
  },
  gameInfoLeft: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.md,
  },
  gameIconLarge: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  gameInfoText: { flex: 1 },
  gameTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  gameCategory: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  gameMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  fireBadge: { fontSize: 12 },
  metaText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  ratingBadge: {
    alignItems: 'center',
  },
  ratingValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  ratingReviews: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: Spacing.lg,
  },
  tab: {
    paddingVertical: Spacing.md,
    marginRight: Spacing.xl,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '600',
  },

  // Sections
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  seeAll: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  aboutText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 22,
  },

  // Details Row
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: Spacing.lg,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailIcon: { marginBottom: 4 },
  detailValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  detailLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  detailDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
  },

  // Bottom Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.lg,
  },
  playButton: {
    borderRadius: BorderRadius.xl,
  },
});

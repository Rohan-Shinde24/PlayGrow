import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { ChipGroup, AppHeader, EmptyState } from '@/components';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

export default function LeaderboardScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const periods = ['Weekly', 'Monthly', 'All Time'];

  return (
    <View style={styles.container}>
      <AppHeader />

      {/* Period Tabs */}
      <View style={styles.chipsSection}>
        <ChipGroup
          chips={periods}
          selectedChip={selectedPeriod}
          onSelect={setSelectedPeriod}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <EmptyState
          icon="trophy-outline"
          title="No leaderboard data yet"
          message="Leaderboard rankings will appear here when available."
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  chipsSection: { marginBottom: Spacing.md },
  scrollContent: { paddingBottom: Spacing['3xl'] },

  // Top Banner
  topBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    gap: Spacing.md,
    marginBottom: Spacing['2xl'],
  },
  trophyEmoji: { fontSize: 40 },
  bannerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.white,
  },
  bannerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
    lineHeight: 18,
  },

  // Podium
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    marginBottom: Spacing['2xl'],
    paddingHorizontal: Spacing.lg,
  },
  podiumItem: {
    alignItems: 'center',
    flex: 1,
  },
  podiumFirst: {
    marginBottom: 20,
  },
  crownEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  rankBadge1: {
    width: 24, height: 24, borderRadius: 12,
    backgroundColor: '#FFD700',
    alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: 24, right: '30%',
    zIndex: 1,
  },
  rankBadge2: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#C0C0C0',
    alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: -2, right: '30%',
    zIndex: 1,
  },
  rankBadge3: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: '#CD7F32',
    alignItems: 'center', justifyContent: 'center',
    position: 'absolute', top: -2, right: '30%',
    zIndex: 1,
  },
  rankNumber: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  podiumAvatar: {
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    marginBottom: Spacing.sm,
  },
  podiumAvatar1: {
    width: 72, height: 72,
    borderColor: '#FFD700',
    backgroundColor: Colors.primaryBg,
  },
  podiumAvatar2: {
    width: 60, height: 60,
    borderColor: '#C0C0C0',
    backgroundColor: Colors.primaryBg,
  },
  podiumAvatar3: {
    width: 60, height: 60,
    borderColor: '#CD7F32',
    backgroundColor: Colors.primaryBg,
  },
  podiumEmoji: { fontSize: 28 },
  podiumName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  podiumNameFirst: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
  },
  podiumPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  podiumPointsIcon: { fontSize: 12 },
  podiumPointsText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.secondary,
  },

  // Players List
  playersList: {
    paddingHorizontal: Spacing.lg,
  },
  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  playerItemHighlighted: {
    backgroundColor: Colors.primaryBg,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    marginHorizontal: -Spacing.sm,
    borderBottomWidth: 0,
  },
  playerRank: {
    width: 24,
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  playerAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.white,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  playerEmoji: { fontSize: 18 },
  playerName: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  playerNameHighlighted: {
    fontWeight: '700',
    color: Colors.primary,
  },
  playerPoints: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  playerPointsIcon: { fontSize: 14 },
  playerPointsText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  playerPointsHighlighted: {
    color: Colors.primary,
    fontWeight: '700',
  },
});

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '@/hooks';
import { Avatar, Card, EmptyState, ProgressBar, AppHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function ProfileScreen() {
  const user = useAppSelector((state) => state.user);
  const completedGames = useAppSelector(
    (state) => state.games.gameApplications.filter((game) => game.status === 'completed').length
  );

  const stats = [
    { value: user.totalPoints.toLocaleString(), label: 'Total Coins', icon: 'cash-outline' as const },
    { value: user.gamesPlayed.toString(), label: 'Games Played', icon: 'game-controller-outline' as const },
    { value: completedGames.toString(), label: 'Games Completed', icon: 'trophy-outline' as const },
  ];

  const menuItems = [
    { icon: 'create-outline' as const, label: 'Edit Profile', onPress: () => router.push('/edit-profile') },
    { icon: 'game-controller-outline' as const, label: 'My Games', onPress: () => router.push('/(tabs)/my-games') },
    { icon: 'gift-outline' as const, label: 'Reward History', onPress: () => router.push('/reward-history') },
    { icon: 'trophy-outline' as const, label: 'Achievements', onPress: () => router.push('/leaderboard') },
    { icon: 'settings-outline' as const, label: 'Settings', onPress: () => router.push('/settings') },
    { icon: 'help-circle-outline' as const, label: 'Help & Support', onPress: () => router.push('/how-it-works') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader />

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            <Avatar uri={user.avatar} name={user.username} size="xl" />
          </View>
          <Text style={styles.profileName}>
            {user.username ? `@${user.username}` : user.email || 'Your Profile'}
          </Text>

          {/* Level */}
          {user.maxXp > 0 && (
            <View style={styles.levelContainer}>
              <View style={styles.levelBadge}>
                <Ionicons name="ellipse" size={9} color={Colors.primary} />
                <Text style={styles.levelText}>Level {user.level}</Text>
              </View>
              <View style={styles.xpBar}>
                <ProgressBar
                  progress={user.xp / user.maxXp}
                  color={Colors.primary}
                  height={8}
                />
                <Text style={styles.xpText}>{user.xp} / {user.maxXp} XP</Text>
              </View>
            </View>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Ionicons
                name={stat.icon}
                size={20}
                color={stat.label === 'Total Coins' ? Colors.secondary : Colors.primary}
                style={styles.statIcon}
              />
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Achievement Badges */}
        <View style={styles.badgesSection}>
          <View style={styles.badgesHeader}>
            <View style={styles.badgesTitle}>
              <Ionicons name="medal-outline" size={20} color={Colors.primary} />
              <Text style={styles.badgesTitleText}>Achievement Badges</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All ›</Text>
            </TouchableOpacity>
          </View>
          <EmptyState
            icon="trophy-outline"
            title="No achievements yet"
            message="Achievements will appear here as you earn them."
            compact
          />
        </View>

        {/* Menu Items */}
        <Card style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.menuItem,
                index < menuItems.length - 1 && styles.menuItemBorder,
              ]}
              onPress={item.onPress}
              activeOpacity={0.7}
            >
              <Ionicons name={item.icon} size={20} color={Colors.primary} style={styles.menuIcon} />
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuChevron}>›</Text>
            </TouchableOpacity>
          ))}
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },

  // Profile Section
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  avatarLarge: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: Spacing.md,
    position: 'relative',
  },
  profileName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  profileUsername: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  levelContainer: {
    width: '100%',
    alignItems: 'center',
  },
  levelBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    paddingVertical: 4,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  levelText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.primary,
  },
  xpBar: {
    width: '60%',
    alignItems: 'center',
  },
  xpText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 4,
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: { marginBottom: 4 },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    marginTop: 2,
  },

  // Badges
  badgesSection: {
    marginBottom: Spacing.xl,
  },
  badgesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  badgesTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  badgesTitleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  viewAll: {
    fontSize: Typography.fontSize.md,
    color: Colors.primary,
    fontWeight: '500',
  },
  badgesList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  badgeItem: {
    alignItems: 'center',
    width: 65,
  },
  badgeCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 6,
    ...Shadows.sm,
  },
  badgeEmoji: { fontSize: 26 },
  badgeLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },

  // Menu
  menuCard: {
    marginHorizontal: Spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIcon: {
    marginRight: Spacing.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  menuChevron: {
    fontSize: 22,
    color: Colors.text.tertiary,
  },
});

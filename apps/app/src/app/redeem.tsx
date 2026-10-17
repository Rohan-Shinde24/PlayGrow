import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppSelector, useAppDispatch, useScreenInsets } from '@/hooks';
import { Ionicons } from '@expo/vector-icons';
import { setSelectedCategory as setRewardCategory } from '@/store/slices/rewardsSlice';
import { ChipGroup, EmptyState, ScreenHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function RedeemScreen() {
  const dispatch = useAppDispatch();
  const { bottom } = useScreenInsets();
  const { rewards, selectedCategory, categories } = useAppSelector((state) => state.rewards);
  const user = useAppSelector((state) => state.user);

  const filteredRewards =
    selectedCategory === 'All'
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Redeem Rewards"
        right={
          <View style={styles.pointsBadge}>
            <Ionicons name="cash-outline" size={16} color={Colors.primary} />
            <Text style={styles.pointsText}>{user.totalPoints.toLocaleString()}</Text>
          </View>
        }
      />

      <Text style={styles.subtitle}>Use your coins to get exclusive rewards.</Text>

      {/* Category Chips */}
      <View style={styles.chipsSection}>
        <ChipGroup
          chips={categories}
          selectedChip={selectedCategory}
          onSelect={(cat) => dispatch(setRewardCategory(cat))}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + Spacing['3xl'] }}
      >
        {/* Rewards Grid */}
        <View style={styles.grid}>
          {filteredRewards.map((reward) => (
            <View key={reward.id} style={styles.rewardCard}>
              <View style={styles.rewardImage}>
                <Ionicons name="gift-outline" size={40} color={Colors.primary} />
              </View>
              <View style={styles.rewardInfo}>
                <Text style={styles.rewardTitle} numberOfLines={2}>
                  {reward.title}
                </Text>
                <Text style={styles.rewardDesc} numberOfLines={1}>
                  {reward.description}
                </Text>
                <View style={styles.rewardBottom}>
                  <View style={styles.costBadge}>
                    <Ionicons name="cash-outline" size={14} color={Colors.secondary} />
                    <Text style={styles.costText}>{reward.cost.toLocaleString()}</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.redeemBtn,
                      user.availablePoints < reward.cost && styles.redeemBtnDisabled,
                    ]}
                    disabled={user.availablePoints < reward.cost}
                  >
                    <Text
                      style={[
                        styles.redeemBtnText,
                        user.availablePoints < reward.cost && styles.redeemBtnTextDisabled,
                      ]}
                    >
                      Redeem
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>
        {filteredRewards.length === 0 && (
          <View style={styles.emptyRewards}>
            <EmptyState
              icon="gift-outline"
              title="No rewards available yet"
              message="Rewards will appear here when they become available."
              compact
            />
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  pointsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primaryBg,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  pointsText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
  subtitle: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  chipsSection: {
    marginBottom: Spacing.lg,
  },

  // Grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  emptyRewards: {
    paddingHorizontal: Spacing.lg,
  },
  rewardCard: {
    width: '47.5%',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  rewardImage: {
    height: 100,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: {
    padding: Spacing.md,
  },
  rewardTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  rewardDesc: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginBottom: Spacing.sm,
  },
  rewardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  costBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costIcon: { fontSize: 14 },
  costText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.secondary,
  },
  redeemBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  redeemBtnDisabled: {
    backgroundColor: Colors.borderLight,
  },
  redeemBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  redeemBtnTextDisabled: {
    color: Colors.text.tertiary,
  },
});

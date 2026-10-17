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
import { LinearGradient } from 'expo-linear-gradient';
import { useAppSelector } from '@/hooks';
import { EmptyState, SectionHeader, AppHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function RewardsScreen() {
  const user = useAppSelector((state) => state.user);
  const { transactions } = useAppSelector((state) => state.rewards);

  const quickActions = [
    { icon: 'gift-outline' as const, label: 'Redeem', color: '#E8A600', backgroundColor: '#FFF5DF', onPress: () => router.push('/redeem') },
    { icon: 'swap-horizontal-outline' as const, label: 'Transactions', color: '#2585C7', backgroundColor: '#E7F3FC', onPress: () => router.push('/transactions') },
    { icon: 'time-outline' as const, label: 'Reward\nHistory', color: '#6852CC', backgroundColor: '#F0EDFC', onPress: () => router.push('/reward-history') },
    { icon: 'help-circle-outline' as const, label: 'How It\nWorks', color: '#2585C7', backgroundColor: '#E9F3FC', onPress: () => router.push('/how-it-works') },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader onAvatarPress={() => router.push('/(tabs)/profile')} />

        {/* Coins Card */}
        <View style={styles.pointsCard}>
          <LinearGradient
            colors={['#19B923', '#4BCF00']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.pointsGradient}
          >
            <View pointerEvents="none" style={styles.pointsDecoration} />
            <View style={styles.pointsTop}>
              <View style={styles.coinBadge}>
                <View style={styles.coinInner}>
                  <Ionicons name="star" size={30} color="#FFF5A6" />
                </View>
              </View>
              <View style={styles.pointsSummary}>
                <Text style={styles.pointsLabelText}>Total Coins</Text>
                <Text style={styles.pointsValue}>{user.totalPoints.toLocaleString()}</Text>
              </View>
              <TouchableOpacity
                style={styles.arrowCircle}
                onPress={() => router.push('/redeem')}
                accessibilityRole="button"
                accessibilityLabel="Redeem coins"
              >
                <Ionicons name="chevron-forward" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>
            <View style={styles.pointsBottom}>
              <View style={styles.pointsDetail}>
                <View style={styles.pointsDetailHeading}>
                  <Ionicons name="add" size={18} color="#87969A" />
                  <Text style={styles.pointsDetailLabel}>Available</Text>
                </View>
                <Text style={styles.pointsDetailValue}>{user.availablePoints.toLocaleString()}</Text>
              </View>
              <View style={styles.pointsDetailDivider} />
              <View style={styles.pointsDetail}>
                <View style={styles.pointsDetailHeading}>
                  <Ionicons name="time-outline" size={17} color="#87969A" />
                  <Text style={styles.pointsDetailLabel}>Pending</Text>
                </View>
                <Text style={styles.pointsDetailValue}>{user.pendingPoints.toLocaleString()}</Text>
              </View>
              <View style={styles.pointsDetailDivider} />
              <View style={styles.pointsDetail}>
                <View style={styles.pointsDetailHeading}>
                  <Ionicons name="gift-outline" size={17} color="#64A278" />
                  <Text style={styles.pointsDetailLabel}>Redeemed</Text>
                </View>
                <Text style={styles.pointsDetailValue}>{user.redeemedPoints.toLocaleString()}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.quickAction, index < quickActions.length - 1 && styles.quickActionSpacing]}
              onPress={action.onPress}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={action.label.replace('\n', ' ')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: action.backgroundColor }]}>
                <Ionicons name={action.icon} size={24} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Transactions */}
        <SectionHeader title="Recent Transactions" onAction={() => router.push('/transactions')} />
        <View style={styles.transactionsList}>
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons
                  name={transaction.type === 'earned' ? 'add-circle-outline' : 'gift-outline'}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.transactionContent}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionDate}>{transaction.date}</Text>
              </View>
              <Text
                style={[
                  styles.transactionAmount,
                  { color: transaction.amount >= 0 ? Colors.primary : Colors.error },
                ]}
              >
                {transaction.amount >= 0 ? '+' : '-'} {Math.abs(transaction.amount).toLocaleString()} coins
              </Text>
            </View>
          ))}
          {transactions.length === 0 && (
            <EmptyState
              icon="receipt-outline"
              title="No transactions yet"
              message="Your rewards activity will appear here."
              compact
            />
          )}
        </View>
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
  // Points Card
  pointsCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    overflow: 'hidden',
    ...Shadows.md,
  },
  pointsGradient: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    overflow: 'hidden',
  },
  pointsDecoration: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -70,
    top: -82,
  },
  pointsTop: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 94,
    paddingHorizontal: Spacing.xs,
    paddingBottom: Spacing.md,
    gap: Spacing.md,
  },
  coinBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F8BC12',
    borderWidth: 2,
    borderColor: '#FFF2A2',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  coinInner: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsSummary: {
    flex: 1,
    justifyContent: 'center',
  },
  pointsLabelText: {
    fontSize: Typography.fontSize.md,
    color: 'rgba(255,255,255,0.88)',
    fontWeight: '500',
    marginBottom: 2,
  },
  pointsValue: {
    fontSize: 38,
    fontWeight: '700',
    lineHeight: 44,
    color: Colors.white,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointsBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 64,
    paddingHorizontal: Spacing.xs,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.91)',
  },
  pointsDetail: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 0,
  },
  pointsDetailHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  pointsDetailLabel: {
    fontSize: Typography.fontSize.xs,
    color: '#5C6A70',
    fontWeight: '500',
  },
  pointsDetailValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  pointsDetailDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#E0E9E4',
  },

  // Quick Actions
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  quickAction: {
    flex: 1,
    minHeight: 102,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: 2,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#EDF0EE',
    borderRadius: BorderRadius.lg,
    ...Shadows.sm,
  },
  quickActionSpacing: {
    marginRight: Spacing.sm,
  },
  quickActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    color: '#33414A',
    fontWeight: '500',
    textAlign: 'center',
  },

  // Transactions
  transactionsList: {
    paddingHorizontal: Spacing.lg,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  transactionIcon: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center', justifyContent: 'center',
    marginRight: Spacing.md,
  },
  transactionContent: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  transactionDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
});

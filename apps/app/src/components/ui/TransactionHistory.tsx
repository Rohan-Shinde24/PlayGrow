import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState, ScreenHeader } from '@/components';
import { useAppSelector } from '@/hooks';
import { Colors, Spacing, Typography } from '@/constants';

export function TransactionHistory({ rewardsOnly = false }: { rewardsOnly?: boolean }) {
  const transactions = useAppSelector((state) => state.rewards.transactions);
  const visibleTransactions = rewardsOnly
    ? transactions.filter((transaction) => transaction.type === 'redeemed')
    : transactions;

  return (
    <View style={styles.container}>
      <ScreenHeader title={rewardsOnly ? 'Reward History' : 'Transactions'} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {visibleTransactions.length === 0 ? (
          <EmptyState
            icon={rewardsOnly ? 'gift-outline' : 'receipt-outline'}
            title={rewardsOnly ? 'No reward history yet' : 'No transactions yet'}
            message="Your activity will appear here when available."
          />
        ) : (
          visibleTransactions.map((transaction) => (
            <View style={styles.row} key={transaction.id}>
              <View style={styles.icon}>
                <Ionicons
                  name={transaction.type === 'earned' ? 'add-circle-outline' : 'gift-outline'}
                  size={20}
                  color={Colors.primary}
                />
              </View>
              <View style={styles.details}>
                <Text style={styles.title}>{transaction.title}</Text>
                <Text style={styles.date}>{transaction.date}</Text>
              </View>
              <Text style={[
                styles.amount,
                { color: transaction.amount >= 0 ? Colors.primary : Colors.error },
              ]}>
                {transaction.amount >= 0 ? '+' : '-'}{Math.abs(transaction.amount).toLocaleString()} coins
              </Text>
            </View>
          ))
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
  content: {
    flexGrow: 1,
    paddingBottom: Spacing['3xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBg,
  },
  details: {
    flex: 1,
  },
  title: {
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  date: {
    marginTop: 2,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
  },
  amount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
});

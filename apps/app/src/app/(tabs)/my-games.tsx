import React, { useState, type ComponentProps } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AppHeader, ChipGroup, EmptyState } from '@/components';
import { Colors, Spacing, Typography } from '@/constants';
import { useAppSelector } from '@/hooks';

const statuses = ['All', 'Applied', 'Pending', 'Completed'] as const;

export default function MyGamesScreen() {
  const applications = useAppSelector((state) => state.games.gameApplications);
  const [selectedStatus, setSelectedStatus] = useState<(typeof statuses)[number]>('All');

  const filteredApplications =
    selectedStatus === 'All'
      ? applications
      : applications.filter(
          (application) => application.status === selectedStatus.toLowerCase()
        );
  const counts = {
    applied: applications.filter((application) => application.status === 'applied').length,
    pending: applications.filter((application) => application.status === 'pending').length,
    completed: applications.filter((application) => application.status === 'completed').length,
  };

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.titleSection}>
        <Text style={styles.title}>My Games</Text>
        <Text style={styles.subtitle}>Track your game applications and progress.</Text>
      </View>

      <View style={styles.statsRow}>
        <StatusCount label="Applied" count={counts.applied} icon="game-controller-outline" />
        <StatusCount label="Pending" count={counts.pending} icon="time-outline" />
        <StatusCount label="Completed" count={counts.completed} icon="checkmark-circle-outline" />
      </View>

      <View style={styles.filters}>
        <ChipGroup
          chips={[...statuses]}
          selectedChip={selectedStatus}
          onSelect={(status) => setSelectedStatus(status as (typeof statuses)[number])}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {filteredApplications.length === 0 ? (
          <EmptyState
            icon="game-controller-outline"
            title={applications.length === 0 ? 'No games applied yet' : `No ${selectedStatus.toLowerCase()} games`}
            message="Your game applications and progress will appear here."
          />
        ) : (
          filteredApplications.map((application) => (
            <View key={application.id} style={styles.gameRow}>
              <View style={styles.gameIcon}>
                <Text style={styles.gameInitial}>{application.gameTitle.charAt(0)}</Text>
              </View>
              <View style={styles.gameDetails}>
                <Text style={styles.gameTitle}>{application.gameTitle}</Text>
                <Text style={styles.gameStatus}>
                  {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

function StatusCount({
  label,
  count,
  icon,
}: {
  label: string;
  count: number;
  icon: ComponentProps<typeof Ionicons>['name'];
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueRow}>
        <Text style={styles.statValue}>{count}</Text>
        <Ionicons name={icon} size={18} color={Colors.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  titleSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  subtitle: {
    marginTop: Spacing.xs,
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    minHeight: 88,
    padding: Spacing.md,
    borderRadius: 14,
    backgroundColor: Colors.white,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
  },
  statValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  filters: {
    marginBottom: Spacing.md,
  },
  listContent: {
    paddingBottom: Spacing['3xl'],
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  gameIcon: {
    width: 44,
    height: 44,
    marginRight: Spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBg,
  },
  gameInitial: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
  },
  gameDetails: {
    flex: 1,
  },
  gameTitle: {
    color: Colors.text.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: '600',
  },
  gameStatus: {
    marginTop: 2,
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.sm,
  },
});

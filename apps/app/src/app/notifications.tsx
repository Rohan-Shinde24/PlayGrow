import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch, useScreenInsets } from '@/hooks';
import { setSelectedFilter, markAllAsRead, markAsRead } from '@/store/slices/notificationsSlice';
import { ChipGroup, ScreenHeader } from '@/components';
import { Colors, Typography, Spacing } from '@/constants';

export default function NotificationsScreen() {
  const dispatch = useAppDispatch();
  const { bottom } = useScreenInsets();
  const { notifications, selectedFilter, filters } = useAppSelector(
    (state) => state.notifications
  );

  const filteredNotifications =
    selectedFilter === 'All'
      ? notifications
      : notifications.filter((n) => {
          const filterMap: Record<string, string> = {
            Rewards: 'reward',
            Games: 'game',
            Updates: 'update',
          };
          return n.type === filterMap[selectedFilter];
        });

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Notifications"
        right={
          <TouchableOpacity onPress={() => dispatch(markAllAsRead())}>
            <Text style={styles.markAllRead}>Mark All Read</Text>
          </TouchableOpacity>
        }
      />

      {/* Filter Chips */}
      <View style={styles.chipsSection}>
        <ChipGroup
          chips={filters}
          selectedChip={selectedFilter}
          onSelect={(filter) => dispatch(setSelectedFilter(filter))}
          size="sm"
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + Spacing['3xl'] }}
      >
        {filteredNotifications.map((notification) => (
          <TouchableOpacity
            key={notification.id}
            style={[
              styles.notificationItem,
              !notification.isRead && styles.notificationUnread,
            ]}
            onPress={() => dispatch(markAsRead(notification.id))}
            activeOpacity={0.7}
          >
            <View style={styles.notifIconContainer}>
              <Ionicons
                name={
                  notification.type === 'reward'
                    ? 'gift-outline'
                    : notification.type === 'game'
                      ? 'game-controller-outline'
                      : notification.type === 'update'
                        ? 'information-circle-outline'
                        : 'notifications-outline'
                }
                size={20}
                color={Colors.primary}
              />
            </View>
            <View style={styles.notifContent}>
              <View style={styles.notifTitleRow}>
                <Text style={[styles.notifTitle, !notification.isRead && styles.notifTitleUnread]}>
                  {notification.title}
                </Text>
                <Text style={styles.notifDate}>{notification.date}</Text>
              </View>
              <Text style={styles.notifMessage} numberOfLines={2}>
                {notification.message}
              </Text>
            </View>
            {!notification.isRead && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}

        {filteredNotifications.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-outline" size={44} color={Colors.primary} style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No notifications</Text>
            <Text style={styles.emptySubtext}>{"You're all caught up!"}</Text>
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
  markAllRead: {
    fontSize: Typography.fontSize.md,
    color: Colors.primary,
    fontWeight: '600',
  },
  chipsSection: {
    marginBottom: Spacing.md,
  },

  // Notification Items
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  notificationUnread: {
    backgroundColor: '#F0FFF0',
  },
  notifIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    color: Colors.text.primary,
    flex: 1,
  },
  notifTitleUnread: {
    fontWeight: '700',
  },
  notifDate: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.tertiary,
    marginLeft: Spacing.sm,
  },
  notifMessage: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: Spacing.sm,
    marginTop: 6,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: { marginBottom: Spacing.md },
  emptyText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    marginTop: 4,
  },
});

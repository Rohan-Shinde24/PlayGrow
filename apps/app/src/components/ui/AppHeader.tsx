import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useScreenInsets } from '@/hooks';
import { Avatar } from './Avatar';
import { Colors, Typography, Spacing, Shadows } from '@/constants';

interface AppHeaderProps {
  /**
   * When provided the avatar becomes a button that calls this handler.
   * Omit it on screens where the avatar is purely decorative.
   */
  onAvatarPress?: () => void;
}

/**
 * The "Play Grow" branding header used across the main tab screens.
 * Handles the safe-area top inset so the branding never sits under the
 * status bar / notch.
 */
export const AppHeader: React.FC<AppHeaderProps> = ({ onAvatarPress }) => {
  const { headerTop } = useScreenInsets();
  const unreadCount = useAppSelector((state) => state.notifications.unreadCount);
  const user = useAppSelector((state) => state.user);

  const avatar = (
    <View style={styles.avatar}>
      <Avatar uri={user.avatar} name={user.username} size="sm" />
    </View>
  );

  return (
    <View style={[styles.header, { paddingTop: headerTop }]}>
      <View style={styles.logoRow}>
        <Text style={styles.logoPlay}>Play</Text>
        <Text style={styles.logoGrow}>Grow</Text>
      </View>

      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.notifButton}
          onPress={() => router.push('/notifications')}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="notifications-outline" size={22} color={Colors.text.primary} />
          {unreadCount > 0 && (
            <View style={styles.notifBadge}>
              <Text style={styles.notifBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {onAvatarPress ? (
          <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.8}>
            {avatar}
          </TouchableOpacity>
        ) : (
          avatar
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  logoRow: {
    flexDirection: 'row',
  },
  logoPlay: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  logoGrow: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '700',
    color: Colors.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  notifButton: {
    position: 'relative',
    padding: Spacing.xs,
  },
  notifBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 3,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notifBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  avatarEmoji: {
    fontSize: 18,
  },
});

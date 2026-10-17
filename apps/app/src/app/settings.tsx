import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useAppDispatch, useAppSelector, useScreenInsets } from '@/hooks';
import { logout } from '@/store/slices/userSlice';
import { logoutSession } from '@/services/authApi';
import { Avatar, Button, ScreenHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

interface SettingItemProps {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  onPress?: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggle?: (value: boolean) => void;
  danger?: boolean;
}

function SettingItem({ icon, label, onPress, hasToggle, toggleValue, onToggle, danger }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      activeOpacity={hasToggle ? 1 : 0.7}
      disabled={hasToggle}
    >
      <Ionicons name={icon} size={20} color={Colors.primary} style={styles.settingIcon} />
      <Text style={[styles.settingLabel, danger && styles.settingLabelDanger]}>{label}</Text>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primaryLight }}
          thumbColor={toggleValue ? Colors.primary : Colors.white}
        />
      ) : (
        <Ionicons name="chevron-forward" size={18} color={Colors.text.tertiary} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsScreen() {
  const dispatch = useAppDispatch();
  const { bottom } = useScreenInsets();
  const user = useAppSelector((state) => state.user);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [gameUpdates, setGameUpdates] = useState(true);
  const [rewardUpdates, setRewardUpdates] = useState(true);

  const handleLogout = () => {
    void logoutSession().catch(() => undefined).finally(() => {
      dispatch(logout());
      router.replace('/login');
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Settings"
        right={
          <View style={styles.avatarSmall}>
            <Avatar uri={user.avatar} name={user.username} size="sm" />
          </View>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottom + Spacing['3xl'] }}
      >
        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="person-outline" label="Edit Personal Details" onPress={() => router.push('/edit-profile')} />
          <SettingItem icon="lock-closed-outline" label="Change Password" onPress={() => {}} />
          <SettingItem icon="shield-checkmark-outline" label="Account Security" onPress={() => {}} />
          <SettingItem icon="link-outline" label="Linked Accounts" onPress={() => {}} />
        </View>

        {/* Notifications Section */}
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.sectionCard}>
          <SettingItem
            icon="notifications-outline"
            label="Push Notifications"
            hasToggle
            toggleValue={pushNotifs}
            onToggle={setPushNotifs}
          />
          <SettingItem
            icon="mail-outline"
            label="Email Notifications"
            hasToggle
            toggleValue={emailNotifs}
            onToggle={setEmailNotifs}
          />
          <SettingItem
            icon="game-controller-outline"
            label="Game Updates"
            hasToggle
            toggleValue={gameUpdates}
            onToggle={setGameUpdates}
          />
          <SettingItem
            icon="gift-outline"
            label="Reward Updates"
            hasToggle
            toggleValue={rewardUpdates}
            onToggle={setRewardUpdates}
          />
        </View>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="help-circle-outline" label="Help Center" onPress={() => router.push('/how-it-works')} />
          <SettingItem icon="book-outline" label="FAQs" onPress={() => router.push('/how-it-works')} />
          <SettingItem icon="call-outline" label="Contact Support" onPress={() => {}} />
          <SettingItem icon="bug-outline" label="Report a Problem" onPress={() => {}} />
        </View>

        {/* Legal Section */}
        <Text style={styles.sectionTitle}>Legal</Text>
        <View style={styles.sectionCard}>
          <SettingItem icon="document-text-outline" label="Terms of Service" onPress={() => {}} />
          <SettingItem icon="lock-closed-outline" label="Privacy Policy" onPress={() => {}} />
        </View>

        {/* Logout Button */}
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutBtn}
          icon={<Ionicons name="log-out-outline" size={18} color={Colors.error} />}
        />

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  avatarSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Section
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    paddingHorizontal: Spacing.lg,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  sectionCard: {
    backgroundColor: Colors.white,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    ...Shadows.sm,
  },

  // Setting Item
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingIcon: {
    marginRight: Spacing.md,
  },
  settingLabel: {
    flex: 1,
    fontSize: Typography.fontSize.lg,
    color: Colors.text.primary,
    fontWeight: '500',
  },
  settingLabelDanger: {
    color: Colors.error,
  },

  // Logout
  logoutBtn: {
    width: 180,
    alignSelf: 'center',
    marginTop: Spacing['2xl'],
  },
});

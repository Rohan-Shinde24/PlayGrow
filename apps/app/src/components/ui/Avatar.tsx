import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants';

interface AvatarProps {
  /** Local file URI or remote URL of the profile photo. */
  uri?: string | null;
  /** Display name, used to render initials when there is no photo. */
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  backgroundColor?: string;
  style?: ViewStyle;
  showBadge?: boolean;
  badgeColor?: string;
}

const sizeMap = { sm: 32, md: 40, lg: 56, xl: 96 };
const fontMap = { sm: 13, md: 15, lg: 20, xl: 32 };

function getInitials(name?: string): string {
  if (!name?.trim()) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

export const Avatar: React.FC<AvatarProps> = ({
  uri,
  name,
  size = 'md',
  backgroundColor = Colors.primaryBg,
  style,
  showBadge = false,
  badgeColor = Colors.success,
}) => {
  const s = sizeMap[size];
  const initials = getInitials(name);

  return (
    <View
      style={[
        styles.container,
        { width: s, height: s, borderRadius: s / 2, backgroundColor },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={styles.image} contentFit="cover" transition={150} />
      ) : initials ? (
        <Text style={[styles.initials, { fontSize: fontMap[size], color: Colors.primary }]}>
          {initials}
        </Text>
      ) : (
        <Ionicons name="person" size={Math.round(s * 0.5)} color={Colors.primary} />
      )}
      {showBadge && (
        <View
          style={[
            styles.badge,
            {
              backgroundColor: badgeColor,
              width: s * 0.25,
              height: s * 0.25,
              borderRadius: s * 0.125,
            },
          ]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initials: {
    fontWeight: '700',
  },
  badge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});

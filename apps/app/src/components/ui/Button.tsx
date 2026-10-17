import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
} from 'react-native';
import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
}) => {
  const getContainerStyle = (): ViewStyle[] => {
    const base: ViewStyle[] = [styles.base, styles[`size_${size}`]];

    switch (variant) {
      case 'primary':
        base.push(styles.primary);
        break;
      case 'secondary':
        base.push(styles.secondary);
        break;
      case 'outline':
        base.push(styles.outline);
        break;
      case 'ghost':
        base.push(styles.ghost);
        break;
      case 'danger':
        base.push(styles.danger);
        break;
    }

    if (disabled) base.push(styles.disabled);
    if (fullWidth) base.push(styles.fullWidth);
    if (style) base.push(style);

    return base;
  };

  const getTextStyle = (): TextStyle[] => {
    const base: TextStyle[] = [styles.text, styles[`text_${size}`]];

    switch (variant) {
      case 'primary':
        base.push(styles.textPrimary);
        break;
      case 'secondary':
        base.push(styles.textSecondary);
        break;
      case 'outline':
        base.push(styles.textOutline);
        break;
      case 'ghost':
        base.push(styles.textGhost);
        break;
      case 'danger':
        base.push(styles.textDanger);
        break;
    }

    if (disabled) base.push(styles.textDisabled);
    if (textStyle) base.push(textStyle);

    return base;
  };

  return (
    <TouchableOpacity
      style={getContainerStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary : Colors.white}
          size="small"
        />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && <View style={styles.iconLeft}>{icon}</View>}
          <Text style={getTextStyle()}>{title}</Text>
          {icon && iconPosition === 'right' && <View style={styles.iconRight}>{icon}</View>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Sizes
  size_sm: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
  },
  size_md: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
  },
  size_lg: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing['2xl'],
    borderRadius: BorderRadius.xl,
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
    ...Shadows.md,
  },
  secondary: {
    backgroundColor: Colors.secondary,
    ...Shadows.md,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  disabled: {
    opacity: 0.5,
  },
  fullWidth: {
    width: '100%',
  },

  // Text
  text: {
    fontWeight: '600',
  },
  text_sm: {
    fontSize: Typography.fontSize.sm,
  },
  text_md: {
    fontSize: Typography.fontSize.lg,
  },
  text_lg: {
    fontSize: Typography.fontSize.xl,
  },
  textPrimary: {
    color: Colors.white,
  },
  textSecondary: {
    color: Colors.white,
  },
  textOutline: {
    color: Colors.primary,
  },
  textGhost: {
    color: Colors.primary,
  },
  textDanger: {
    color: Colors.error,
  },
  textDisabled: {
    color: Colors.text.tertiary,
  },

  // Icon
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
});

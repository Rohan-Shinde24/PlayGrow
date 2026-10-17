import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet, TextStyle } from 'react-native';
import { Colors, Typography } from '@/constants';

interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'bodySmall' | 'caption' | 'label' | 'overline';
  color?: string;
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right';
}

export const AppText: React.FC<TextProps> = ({
  variant = 'body',
  color,
  weight,
  align,
  style,
  children,
  ...props
}) => {
  const textStyles: TextStyle[] = [styles[variant]];

  if (color) textStyles.push({ color });
  if (weight) textStyles.push(styles[`weight_${weight}`]);
  if (align) textStyles.push({ textAlign: align });
  if (style) textStyles.push(style as TextStyle);

  return (
    <RNText style={textStyles} {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: Typography.fontSize['5xl'],
    lineHeight: Typography.lineHeight['5xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  h2: {
    fontSize: Typography.fontSize['3xl'],
    lineHeight: Typography.lineHeight['3xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  h3: {
    fontSize: Typography.fontSize['2xl'],
    lineHeight: Typography.lineHeight['2xl'],
    fontWeight: '600',
    color: Colors.text.primary,
  },
  h4: {
    fontSize: Typography.fontSize.xl,
    lineHeight: Typography.lineHeight.xl,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  body: {
    fontSize: Typography.fontSize.lg,
    lineHeight: Typography.lineHeight.lg,
    fontWeight: '400',
    color: Colors.text.primary,
  },
  bodySmall: {
    fontSize: Typography.fontSize.md,
    lineHeight: Typography.lineHeight.md,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  caption: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: '400',
    color: Colors.text.tertiary,
  },
  label: {
    fontSize: Typography.fontSize.sm,
    lineHeight: Typography.lineHeight.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  overline: {
    fontSize: Typography.fontSize.xs,
    lineHeight: Typography.lineHeight.xs,
    fontWeight: '600',
    color: Colors.text.tertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },

  // Weights
  weight_regular: { fontWeight: '400' },
  weight_medium: { fontWeight: '500' },
  weight_semibold: { fontWeight: '600' },
  weight_bold: { fontWeight: '700' },
});

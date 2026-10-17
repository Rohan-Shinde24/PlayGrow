import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, BorderRadius, Spacing } from '@/constants';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  variant = 'filled',
  size = 'md',
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        styles[`chip_${size}`],
        selected
          ? variant === 'filled'
            ? styles.chipSelected
            : styles.chipOutlineSelected
          : variant === 'filled'
          ? styles.chipDefault
          : styles.chipOutline,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.chipText,
          styles[`chipText_${size}`],
          selected ? styles.chipTextSelected : styles.chipTextDefault,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

interface ChipGroupProps {
  chips: string[];
  selectedChip: string;
  onSelect: (chip: string) => void;
  variant?: 'filled' | 'outlined';
  size?: 'sm' | 'md';
  scrollable?: boolean;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  chips,
  selectedChip,
  onSelect,
  variant = 'filled',
  size = 'md',
  scrollable = true,
}) => {
  const content = (
    <View style={styles.chipGroup}>
      {chips.map((chip) => (
        <Chip
          key={chip}
          label={chip}
          selected={selectedChip === chip}
          onPress={() => onSelect(chip)}
          variant={variant}
          size={size}
        />
      ))}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {content}
      </ScrollView>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip_sm: {
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
  },
  chip_md: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
  },
  chipDefault: {
    backgroundColor: Colors.borderLight,
  },
  chipOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipOutlineSelected: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  chipText: {
    fontWeight: '500',
  },
  chipText_sm: {
    fontSize: Typography.fontSize.sm,
  },
  chipText_md: {
    fontSize: Typography.fontSize.md,
  },
  chipTextSelected: {
    color: Colors.white,
  },
  chipTextDefault: {
    color: Colors.text.secondary,
  },
  chipGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
});

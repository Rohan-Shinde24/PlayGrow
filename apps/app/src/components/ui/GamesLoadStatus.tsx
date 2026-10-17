import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, Spacing, Typography } from '@/constants';

interface GamesLoadStatusProps {
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function GamesLoadStatus({ isLoading, error, onRetry }: GamesLoadStatusProps) {
  if (!isLoading && !error) return null;

  return (
    <View style={styles.container}>
      {isLoading ? (
        <>
          <ActivityIndicator color={Colors.primary} />
          <Text style={styles.message}>Loading games…</Text>
        </>
      ) : (
        <>
          <Text style={styles.error} accessibilityRole="alert">{error}</Text>
          <TouchableOpacity onPress={onRetry} accessibilityRole="button">
            <Text style={styles.retry}>Try again</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  message: {
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.md,
    marginTop: Spacing.sm,
  },
  error: {
    color: Colors.error,
    fontSize: Typography.fontSize.md,
    textAlign: 'center',
  },
  retry: {
    color: Colors.primary,
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    marginTop: Spacing.sm,
  },
});

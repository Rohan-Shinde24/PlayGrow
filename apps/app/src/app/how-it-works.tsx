import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '@/components';
import { Colors, Spacing, Typography } from '@/constants';

const steps = [
  { icon: 'game-controller-outline' as const, title: 'Explore games', description: 'Browse games and choose one to play.' },
  { icon: 'cash-outline' as const, title: 'Earn coins', description: 'Coins and game progress will update when the service is connected.' },
  { icon: 'gift-outline' as const, title: 'Redeem rewards', description: 'Use available coins to redeem rewards when they are offered.' },
];

export default function HowItWorksScreen() {
  return (
    <View style={styles.container}>
      <ScreenHeader title="How It Works" />
      <ScrollView contentContainerStyle={styles.content}>
        {steps.map((step, index) => (
          <View style={styles.step} key={step.title}>
            <View style={styles.icon}>
              <Ionicons name={step.icon} size={24} color={Colors.primary} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepNumber}>STEP {index + 1}</Text>
              <Text style={styles.title}>{step.title}</Text>
              <Text style={styles.description}>{step.description}</Text>
            </View>
          </View>
        ))}
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
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  step: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.lg,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  icon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primaryBg,
    marginRight: Spacing.md,
  },
  stepContent: {
    flex: 1,
  },
  stepNumber: {
    color: Colors.primary,
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  title: {
    marginTop: 2,
    color: Colors.text.primary,
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
  description: {
    marginTop: Spacing.xs,
    color: Colors.text.secondary,
    fontSize: Typography.fontSize.md,
    lineHeight: 20,
  },
});

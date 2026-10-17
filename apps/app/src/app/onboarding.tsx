import React, { useCallback, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import type { ViewToken } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { useAppDispatch, useScreenInsets } from '@/hooks';
import { setOnboarded } from '@/store/slices/userSlice';
import { Button } from '@/components';
import { Colors, Typography, Spacing, BorderRadius } from '@/constants';

const { width } = Dimensions.get('window');

const VIEWABILITY_CONFIG = { viewAreaCoveragePercentThreshold: 50 };

interface OnboardingSlide {
  id: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  title: string;
  titleHighlight: string;
  description: string;
  features: { icon: ComponentProps<typeof Ionicons>['name']; title: string; description: string }[];
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'game-controller-outline',
    title: 'Play, Achieve\nand ',
    titleHighlight: 'Grow',
    description: 'Discover amazing games, track your progress and earn exciting rewards.',
    features: [
      { icon: 'game-controller-outline', title: 'Discover Games', description: 'Explore a wide range of games you\'ll love.' },
      { icon: 'stats-chart-outline', title: 'Track Your Games', description: 'Follow your game applications and progress.' },
      { icon: 'gift-outline', title: 'Earn Rewards', description: 'Collect eligible rewards and enjoy exclusive benefits.' },
    ],
  },
  {
    id: '2',
    icon: 'trophy-outline',
    title: 'Compete &\n',
    titleHighlight: 'Win Big',
    description: 'Join leaderboards, climb ranks, and showcase your gaming skills to the world.',
    features: [
      { icon: 'podium-outline', title: 'Leaderboards', description: 'See how you rank among other players.' },
      { icon: 'flame-outline', title: 'Daily Streaks', description: 'Play daily to maintain your streak bonus.' },
      { icon: 'medal-outline', title: 'Achievements', description: 'Unlock special badges and milestones.' },
    ],
  },
  {
    id: '3',
    icon: 'diamond-outline',
    title: 'Redeem\n',
    titleHighlight: 'Rewards',
    description: 'Convert your coins into real rewards - gift cards, game credits, and more!',
    features: [
      { icon: 'card-outline', title: 'Gift Cards', description: 'Amazon, Google Play, and more.' },
      { icon: 'cash-outline', title: 'Game Credits', description: 'Get in-game currency for your favorite games.' },
      { icon: 'flash-outline', title: 'Instant Delivery', description: 'Receive rewards directly in your account.' },
    ],
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [scrollX] = useState(() => new Animated.Value(0));
  const dispatch = useAppDispatch();
  const { headerTop, bottom } = useScreenInsets();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = () => {
    dispatch(setOnboarded(true));
    router.replace('/(tabs)');
  };

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={[styles.slide, { paddingTop: headerTop }]}>
      {/* Skip button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Main emoji illustration */}
      <View style={styles.illustrationContainer}>
        <View style={styles.illustrationBg}>
          <Ionicons name={item.icon} size={76} color={Colors.primary} />
        </View>
      </View>

      {/* Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>
          {item.title}
          <Text style={styles.titleHighlight}>{item.titleHighlight}</Text>
        </Text>
      </View>

      {/* Description */}
      <Text style={styles.description}>{item.description}</Text>

      {/* Features */}
      <View style={styles.featuresContainer}>
        {item.features.map((feature, index) => (
          <View key={index} style={styles.featureRow}>
            <View style={styles.featureIcon}>
              <Ionicons name={feature.icon} size={24} color={Colors.primary} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{feature.title}</Text>
              <Text style={styles.featureDescription}>{feature.description}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const onViewableItemsChanged = useCallback(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index ?? 0);
    }
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={VIEWABILITY_CONFIG}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
      />

      {/* Bottom section */}
      <View style={[styles.bottomSection, { paddingBottom: bottom + Spacing['2xl'] }]}>
        {/* Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        {/* Get Started button */}
        <Button
          title={currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
          size="lg"
          fullWidth
          style={styles.getStartedButton}
          iconPosition="right"
          icon={<Ionicons name="arrow-forward" size={18} color={Colors.white} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  slide: {
    width,
    paddingHorizontal: Spacing['2xl'],
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: Spacing.sm,
  },
  skipText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
  illustrationContainer: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing['3xl'],
    position: 'relative',
  },
  illustrationBg: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: '700',
    color: Colors.text.primary,
    lineHeight: 36,
  },
  titleHighlight: {
    color: Colors.primary,
  },
  description: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: Spacing['2xl'],
  },
  featuresContainer: {
    gap: Spacing.lg,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  featureDescription: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  bottomSection: {
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.xl,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: Colors.primary,
  },
  dotInactive: {
    width: 8,
    backgroundColor: Colors.border,
  },
  getStartedButton: {
    borderRadius: BorderRadius.xl,
  },
});

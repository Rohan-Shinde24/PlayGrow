import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '@/hooks';
import { AppHeader, Card, EmptyState, GameCard, GamesLoadStatus, SectionHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';
import { fetchGames } from '@/store/slices/gamesSlice';

const adSlides = [
  { id: 'ad-1', icon: 'megaphone-outline' as const },
  { id: 'ad-2', icon: 'sparkles-outline' as const },
  { id: 'ad-3', icon: 'image-outline' as const },
];

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const games = useAppSelector((state) => state.games);
  const { width: screenWidth } = useWindowDimensions();
  const carouselRef = useRef<FlatList<(typeof adSlides)[number]>>(null);
  const slideIndex = useRef(0);
  const slideDirection = useRef(1);
  const [activeSlide, setActiveSlide] = useState(0);
  const slideWidth = screenWidth - Spacing.lg * 2;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  useEffect(() => {
    const interval = setInterval(() => {
      let nextIndex = slideIndex.current + slideDirection.current;
      if (nextIndex >= adSlides.length - 1) {
        slideDirection.current = -1;
      } else if (nextIndex <= 0) {
        slideDirection.current = 1;
      }
      nextIndex = Math.max(0, Math.min(nextIndex, adSlides.length - 1));
      slideIndex.current = nextIndex;
      setActiveSlide(nextIndex);
      carouselRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <AppHeader onAvatarPress={() => router.push('/(tabs)/profile')} />
        <GamesLoadStatus
          isLoading={games.isLoading}
          error={games.error}
          onRetry={() => { void dispatch(fetchGames()); }}
        />

        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>
            {user.username ? `Hi, ${user.username}!` : 'Welcome!'}
          </Text>
          <Text style={styles.greetingSubtitle}>Ready to play and earn today?</Text>
        </View>

        <View style={styles.adCarousel}>
          <FlatList
            ref={carouselRef}
            data={adSlides}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            getItemLayout={(_, index) => ({
              length: slideWidth,
              offset: slideWidth * index,
              index,
            })}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(event.nativeEvent.contentOffset.x / slideWidth);
              slideIndex.current = index;
              setActiveSlide(index);
            }}
            renderItem={({ item, index }) => (
              <View style={[styles.adSlide, { width: slideWidth }]}>
                <Ionicons name={item.icon} size={28} color={Colors.primary} />
                <View style={styles.adCopy}>
                  <Text style={styles.adTitle}>Ad space</Text>
                  <Text style={styles.adSubtitle}>Your promotion can go here</Text>
                </View>
                <Text style={styles.adCount}>{index + 1}/3</Text>
              </View>
            )}
          />
          <View style={styles.adDots}>
            {adSlides.map((slide, index) => (
              <View
                key={slide.id}
                style={[styles.adDot, index === activeSlide && styles.adDotActive]}
              />
            ))}
          </View>
        </View>

        {/* 7 Day Streak */}
        {user.streak > 0 && (
          <Card style={styles.streakCard}>
            <View style={styles.streakHeader}>
              <View style={styles.streakTitle}>
                <Ionicons name="flame" size={22} color={Colors.secondary} />
                <View>
                  <Text style={styles.streakTitleText}>{user.streak} Day Streak</Text>
                  <Text style={styles.streakSubtitle}>Keep playing to earn more!</Text>
                </View>
              </View>
            </View>
            <View style={styles.streakDays}>
              {days.map((day, index) => (
                <View key={day} style={styles.streakDay}>
                  <View
                    style={[
                      styles.streakCircle,
                      user.streakDays[index] ? styles.streakCircleActive : styles.streakCircleInactive,
                    ]}
                  >
                    {user.streakDays[index] ? (
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    ) : null}
                  </View>
                  <Text style={styles.streakDayLabel}>{day}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Featured Game */}
        {games.featuredGame && (
          <>
            <SectionHeader title="Featured Game" onAction={() => router.push('/(tabs)/explore')} />
            <TouchableOpacity
              style={styles.featuredCard}
              onPress={() => router.push({ pathname: '/game-details', params: { id: games.featuredGame!.id } })}
              activeOpacity={0.9}
            >
              <View style={[styles.featuredBg, { backgroundColor: games.featuredGame.backgroundColor }]}>
                <Ionicons
                  name={games.featuredGame.icon}
                  size={64}
                  color={games.featuredGame.accentColor}
                />
              </View>
              <View style={styles.featuredOverlay}>
                <Text style={styles.featuredTitle}>{games.featuredGame.title}</Text>
                <Text style={styles.featuredCategory}>
                  {games.featuredGame.category} • {games.featuredGame.isPopular ? 'Popular' : 'New'}
                </Text>
                <TouchableOpacity style={styles.playNowBtn}>
                  <Text style={styles.playNowText}>Play Now</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* New Games */}
        {games.games.length > 0 && (
          <>
            <SectionHeader title="New Games" onAction={() => router.push('/(tabs)/explore')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newGamesList}
            >
              {games.games
                .filter((game) => game.id !== games.featuredGame?.id)
                .slice(0, 6)
                .map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPress={() => router.push({ pathname: '/game-details', params: { id: game.id } })}
                    showNewBadge
                    layout="compact"
                  />
                ))}
            </ScrollView>
          </>
        )}

        {/* Continue Playing */}
        {games.continuePlayingGames.length > 0 && (
          <>
            <SectionHeader title="Continue Playing" onAction={() => router.push('/(tabs)/explore')} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.continueList}
            >
              {games.continuePlayingGames.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.continueItem}
                  onPress={() => router.push({ pathname: '/game-details', params: { id: game.id } })}
                >
                  <View style={[styles.continueIcon, { backgroundColor: game.backgroundColor }]}>
                    <Ionicons name={game.icon} size={30} color={game.accentColor} />
                  </View>
                  <Text style={styles.continueName} numberOfLines={1}>{game.title}</Text>
                  <Text style={styles.continueCategory}>{game.category}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}
        {!games.isLoading && !games.error && games.games.length === 0 && (
          <View style={styles.emptyGames}>
            <EmptyState
              icon="game-controller-outline"
              title="No games available yet"
              message="Games will appear here when they become available."
              compact
            />
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
  emptyGames: {
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  greetingSection: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  greetingTitle: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '700',
    color: Colors.text.primary,
  },
  greetingSubtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  adCarousel: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: BorderRadius.xl,
    backgroundColor: Colors.white,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  adSlide: {
    minHeight: 112,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
  },
  adCopy: {
    flex: 1,
  },
  adTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  adSubtitle: {
    marginTop: 2,
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  adCount: {
    alignSelf: 'flex-start',
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
  adDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingBottom: Spacing.md,
  },
  adDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  adDotActive: {
    width: 16,
    backgroundColor: Colors.primary,
  },

  // Streak
  streakCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  streakHeader: {
    marginBottom: Spacing.lg,
  },
  streakTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakTitleText: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  streakSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  streakDays: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDay: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  streakCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakCircleActive: {
    backgroundColor: Colors.primary,
  },
  streakCircleInactive: {
    backgroundColor: Colors.borderLight,
  },
  streakDayLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.secondary,
    fontWeight: '500',
  },

  // Featured Game
  featuredCard: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
    height: 140,
    ...Shadows.lg,
  },
  featuredBg: {
    flex: 1,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featuredOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '55%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: Spacing.md,
    justifyContent: 'center',
  },
  featuredTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  featuredCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  playNowBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  playNowText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.fontSize.md,
  },

  // New Games
  newGamesList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  // Continue Playing
  continueList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.lg,
  },
  continueItem: {
    alignItems: 'center',
    width: 75,
  },
  continueIcon: {
    width: 64,
    height: 64,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primaryBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
    ...Shadows.sm,
  },
  continueName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
    textAlign: 'center',
  },
  continueCategory: {
    fontSize: Typography.fontSize.xs,
    color: Colors.text.tertiary,
  },
});

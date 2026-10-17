import React, { useMemo, useState } from 'react';
import {
  Modal,
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector, useAppDispatch } from '@/hooks';
import { setSelectedCategory, setSearchQuery } from '@/store/slices/gamesSlice';
import { AppHeader, ChipGroup, EmptyState, GameCard, SectionHeader } from '@/components';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants';

export default function ExploreScreen() {
  const dispatch = useAppDispatch();
  const { games, categories, selectedCategory, searchQuery, featuredGame } = useAppSelector((state) => state.games);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'highest-reward' | 'top-rated'>('recommended');

  const filteredGames = selectedCategory === 'All'
    ? games
    : games.filter((g) => g.category === selectedCategory);

  const sortedGames = useMemo(() => {
    const result = [...filteredGames];
    if (sortBy === 'highest-reward') {
      result.sort((a, b) => b.rewards - a.rewards);
    } else if (sortBy === 'top-rated') {
      result.sort((a, b) => b.rating - a.rating);
    }
    return result;
  }, [filteredGames, sortBy]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    return filteredGames
      .map((game) => {
        const title = game.title.toLowerCase();
        const category = game.category.toLowerCase();
        const tags = game.tags.map((tag) => tag.toLowerCase());
        const relevance = title === query
          ? 0
          : title.startsWith(query)
            ? 1
            : title.includes(query)
              ? 2
              : category === query
                ? 3
                : category.startsWith(query)
                  ? 4
                  : category.includes(query) || tags.some((tag) => tag.includes(query))
                    ? 5
                    : Number.POSITIVE_INFINITY;
        return { game, relevance };
      })
      .filter((result) => Number.isFinite(result.relevance))
      .sort((a, b) => a.relevance - b.relevance || b.game.rating - a.game.rating)
      .map((result) => result.game);
  }, [filteredGames, searchQuery]);

  const popularGames = sortedGames.filter((game) => game.isPopular);
  const recommendedGames = sortedGames.filter(
    (game) => game.isTrending && !game.isFeatured && !game.isPopular
  );

  return (
    <View style={[styles.container, searchQuery.trim() && styles.searchResultsScreen]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={searchQuery.trim() ? styles.searchResultsScreen : undefined}
        contentContainerStyle={[
          styles.scrollContent,
          searchQuery.trim() && styles.searchResultsContent,
        ]}
      >
        <AppHeader onAvatarPress={() => router.push('/(tabs)/profile')} />

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={18} color={Colors.text.tertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search games..."
              placeholderTextColor={Colors.text.tertiary}
              value={searchQuery}
              onChangeText={(text) => dispatch(setSearchQuery(text))}
              returnKeyType="search"
            />
            {!!searchQuery && (
              <TouchableOpacity
                onPress={() => dispatch(setSearchQuery(''))}
                accessibilityRole="button"
                accessibilityLabel="Clear search"
              >
                <Ionicons name="close-circle" size={18} color={Colors.text.tertiary} />
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity
            style={[styles.filterButton, selectedCategory !== 'All' && styles.filterButtonActive]}
            onPress={() => setFilterVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Filter and sort games"
          >
            <Ionicons
              name="options-outline"
              size={20}
              color={selectedCategory !== 'All' ? Colors.primary : Colors.text.primary}
            />
          </TouchableOpacity>
        </View>

        {searchQuery.trim() ? (
          <View style={styles.searchResults}>
            <View style={styles.searchResultsHeader}>
              <View>
                <Text style={styles.searchResultsTitle}>Search results</Text>
                <Text style={styles.searchResultsSubtitle}>
                  {searchResults.length} {searchResults.length === 1 ? 'game' : 'games'} found
                </Text>
              </View>
              <Ionicons name="search-outline" size={22} color={Colors.text.tertiary} />
            </View>
            {searchResults.length > 0 ? (
              searchResults.map((game, index) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.searchResultRow}
                  onPress={() => router.push({ pathname: '/game-details', params: { id: game.id } })}
                  activeOpacity={0.75}
                  accessibilityRole="button"
                  accessibilityLabel={`Result ${index + 1}: ${game.title}, ${game.category}`}
                >
                  <Text style={styles.searchRank}>{index + 1}</Text>
                  <View style={[styles.searchResultIcon, { backgroundColor: game.backgroundColor }]}>
                    <Ionicons name={game.icon} size={24} color={game.accentColor} />
                  </View>
                  <View style={styles.searchResultInfo}>
                    <Text style={styles.searchResultName} numberOfLines={1}>{game.title}</Text>
                    <Text style={styles.searchResultCategory}>
                      {game.category} · {game.rating.toFixed(1)} rating
                    </Text>
                  </View>
                  <View style={styles.searchResultReward}>
                    <Ionicons name="cash-outline" size={13} color={Colors.secondary} />
                    <Text style={styles.searchResultRewardText}>{game.rewards}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={Colors.text.tertiary} />
                </TouchableOpacity>
              ))
            ) : (
              <EmptyState
                icon="search-outline"
                title="No games found"
                message="Try a different game name or genre."
                compact
              />
            )}
          </View>
        ) : (
          <>
            {/* Category Chips */}
            <View style={styles.chipsSection}>
              <ChipGroup
                chips={categories}
                selectedChip={selectedCategory}
                onSelect={(cat) => dispatch(setSelectedCategory(cat))}
              />
            </View>

            {/* Featured Banner */}
            {featuredGame && (
          <TouchableOpacity
            style={styles.banner}
            onPress={() => router.push({ pathname: '/game-details', params: { id: featuredGame.id } })}
            activeOpacity={0.9}
          >
            <View style={[styles.bannerBg, { backgroundColor: featuredGame.backgroundColor }]}>
              <Ionicons name={featuredGame.icon} size={76} color={featuredGame.accentColor} />
            </View>
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{featuredGame.title}</Text>
              <Text style={styles.bannerSub}>{featuredGame.category}</Text>
              <TouchableOpacity style={styles.bannerBtn}>
                <Text style={styles.bannerBtnText}>Play Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}

        {/* Pagination Dots */}
        {featuredGame && (
          <View style={styles.dotsRow}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        )}

        {/* Popular Games */}
        <SectionHeader
          title="Popular Games"
          onAction={() => router.push({ pathname: '/games-list', params: { collection: 'popular' } })}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesList}
        >
          {popularGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={() => router.push({ pathname: '/game-details', params: { id: game.id } })}
              layout="compact"
            />
          ))}
        </ScrollView>
        {popularGames.length === 0 && (
          <EmptyState
            icon="game-controller-outline"
            title="No popular games yet"
            message="Games will appear here when they become available."
            compact
          />
        )}

        {/* Recommended for You */}
        <SectionHeader
          title="Recommended for You"
          onAction={() => router.push({ pathname: '/games-list', params: { collection: 'recommended' } })}
        />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gamesList}
        >
          {recommendedGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onPress={() => router.push({ pathname: '/game-details', params: { id: game.id } })}
              layout="compact"
            />
          ))}
        </ScrollView>
        {recommendedGames.length === 0 && (
          <EmptyState
            icon="search-outline"
            title={games.length === 0 ? 'No games available yet' : 'No recommended games found'}
            message={games.length === 0 ? 'Games will appear here when they become available.' : 'Try a different search or category.'}
            compact
          />
        )}
          </>
        )}
      </ScrollView>

      <Modal
        visible={filterVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFilterVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setFilterVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Close filters"
          />
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filter games</Text>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
                accessibilityRole="button"
                accessibilityLabel="Close filters"
              >
                <Ionicons name="close" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <Text style={styles.filterSectionTitle}>Genre</Text>
            <View style={styles.filterOptions}>
              {categories.map((category) => {
                const selected = selectedCategory === category;
                return (
                  <TouchableOpacity
                    key={category}
                    style={[styles.filterChip, selected && styles.filterChipSelected]}
                    onPress={() => {
                      dispatch(setSelectedCategory(category));
                      setFilterVisible(false);
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text style={[styles.filterChipText, selected && styles.filterChipTextSelected]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.filterSectionTitle}>Sort by</Text>
            {([
              ['recommended', 'Recommended'],
              ['highest-reward', 'Highest rewards'],
              ['top-rated', 'Top rated'],
            ] as const).map(([value, label]) => {
              const selected = sortBy === value;
              return (
                <TouchableOpacity
                  key={value}
                  style={styles.sortOption}
                  onPress={() => setSortBy(value)}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: selected }}
                >
                  <Text style={styles.sortOptionText}>{label}</Text>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selected ? Colors.primary : Colors.text.tertiary}
                  />
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              style={styles.clearFilters}
              onPress={() => {
                dispatch(setSelectedCategory('All'));
                setSortBy('recommended');
                setFilterVisible(false);
              }}
              accessibilityRole="button"
            >
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingBottom: Spacing['3xl'],
  },
  searchResultsScreen: {
    backgroundColor: Colors.white,
  },
  searchResultsContent: {
    flexGrow: 1,
    backgroundColor: Colors.white,
  },
  searchResults: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.lg,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    marginBottom: Spacing.xs,
  },
  searchResultsTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  searchResultsSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  searchResultRow: {
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  searchRank: {
    width: 22,
    textAlign: 'center',
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.text.tertiary,
  },
  searchResultIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  searchResultCategory: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 3,
  },
  searchResultReward: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  searchResultRewardText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.text.primary,
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  filterButton: {
    width: 44, height: 44,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryBg,
    borderColor: Colors.primary,
  },

  chipsSection: {
    marginBottom: Spacing.lg,
  },

  // Banner
  banner: {
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    height: 160,
    flexDirection: 'row',
    backgroundColor: Colors.primaryBg,
    ...Shadows.md,
    marginBottom: Spacing.md,
  },
  bannerBg: {
    width: '45%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerContent: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  bannerSub: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
    marginTop: 2,
    marginBottom: Spacing.md,
  },
  bannerBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
  },
  bannerBtnText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: Typography.fontSize.md,
  },

  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: Colors.border,
  },
  dotActive: {
    width: 20,
    backgroundColor: Colors.primary,
  },

  // Games
  gamesList: {
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
    alignItems: 'flex-start',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(8, 20, 13, 0.45)',
  },
  filterSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing['3xl'],
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  filterTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  filterSectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  filterChip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  filterChipSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryBg,
  },
  filterChipText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.text.secondary,
  },
  filterChipTextSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
  sortOption: {
    minHeight: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  sortOptionText: {
    fontSize: Typography.fontSize.md,
    color: Colors.text.primary,
  },
  clearFilters: {
    alignSelf: 'center',
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  clearFiltersText: {
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    color: Colors.primary,
  },
});

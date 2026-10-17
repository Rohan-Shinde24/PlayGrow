import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useAppSelector, useScreenInsets } from '@/hooks';
import { EmptyState, GameCard, ScreenHeader } from '@/components';
import { Colors, Spacing } from '@/constants';

export default function GamesListScreen() {
  const { collection: collectionParam } = useLocalSearchParams<{ collection?: string }>();
  const collection = collectionParam === 'popular' ? 'popular' : 'recommended';
  const games = useAppSelector((state) => state.games.games);
  const { bottom } = useScreenInsets();
  const filteredGames = games.filter((game) =>
    collection === 'popular'
      ? game.isPopular
      : game.isTrending && !game.isFeatured && !game.isPopular
  );

  return (
    <View style={styles.container}>
      <ScreenHeader title={collection === 'popular' ? 'Popular Games' : 'Recommended Games'} />
      <FlatList
        data={filteredGames}
        numColumns={2}
        keyExtractor={(game) => game.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.list, { paddingBottom: bottom + Spacing['3xl'] }]}
        renderItem={({ item }) => (
          <GameCard
            game={item}
            layout="grid"
            onPress={() => router.push({ pathname: '/game-details', params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            icon="game-controller-outline"
            title={collection === 'popular' ? 'No popular games yet' : 'No recommended games yet'}
            message="Games will appear here when they are available."
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: Spacing.lg,
  },
  row: {
    justifyContent: 'space-between',
  },
});

import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { fetchGames as fetchGamesFromApi } from '@/services/gamesApi';

type GameIcon = ComponentProps<typeof Ionicons>['name'];

export interface Game {
  id: string;
  title: string;
  category: string;
  icon: GameIcon;
  accentColor: string;
  backgroundColor: string;
  rating: number;
  reviews: string;
  downloads: string;
  description: string;
  tags: string[];
  rewards: number;
  isFeatured: boolean;
  isTrending: boolean;
  isPopular: boolean;
  sessionTime: string;
  platforms: string[];
  requiresOnline: boolean;
}

export interface GameApplication {
  id: string;
  gameTitle: string;
  status: 'applied' | 'pending' | 'completed';
}

export interface GamesState {
  games: Game[];
  gameApplications: GameApplication[];
  categories: string[];
  selectedCategory: string;
  featuredGame: Game | null;
  continuePlayingGames: Game[];
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  games: [],
  gameApplications: [],
  categories: ['All', 'Casual', 'Puzzle', 'Action', 'Strategy', 'Sports', 'Adventure', 'Arcade', 'Racing', 'Simulation', 'Music', 'Word'],
  selectedCategory: 'All',
  featuredGame: null,
  continuePlayingGames: [],
  searchQuery: '',
  isLoading: false,
  error: null,
};

export const fetchGames = createAsyncThunk<Game[], void, { rejectValue: string }>(
  'games/fetchGames',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchGamesFromApi();
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unable to load games.');
    }
  }
);

const gamesSlice = createSlice({
  name: 'games',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setGameApplications(state, action: PayloadAction<GameApplication[]>) {
      state.gameApplications = action.payload;
    },
    setFeaturedGame(state, action: PayloadAction<Game>) {
      state.featuredGame = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGames.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGames.fulfilled, (state, action) => {
        state.isLoading = false;
        state.games = action.payload;
        state.featuredGame = action.payload.find((game) => game.isFeatured) ?? null;
        const apiCategories = action.payload.map((game) => game.category);
        state.categories = [...new Set(['All', ...state.categories.filter((category) => category !== 'All'), ...apiCategories])];
      })
      .addCase(fetchGames.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? action.error.message ?? 'Unable to load games.';
      });
  },
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setGameApplications,
  setFeaturedGame,
} = gamesSlice.actions;
export default gamesSlice.reducer;

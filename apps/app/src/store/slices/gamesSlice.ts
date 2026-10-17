import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

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

const gamesCatalog: Game[] = [
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    category: 'Racing',
    icon: 'car-sport-outline',
    accentColor: '#2874D0',
    backgroundColor: '#EAF2FF',
    rating: 4.8,
    reviews: '',
    downloads: '',
    description: 'Race through glowing city streets, master sharp turns, and beat your best lap time.',
    tags: ['Racing', 'Arcade'],
    rewards: 120,
    isFeatured: true,
    isTrending: true,
    isPopular: true,
    sessionTime: '5-10 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: true,
  },
  {
    id: 'mystic-match',
    title: 'Mystic Match',
    category: 'Puzzle',
    icon: 'shapes-outline',
    accentColor: '#7654C8',
    backgroundColor: '#F1ECFF',
    rating: 4.7,
    reviews: '',
    downloads: '',
    description: 'Match magical symbols, solve clever board puzzles, and uncover a world of secrets.',
    tags: ['Puzzle', 'Casual'],
    rewards: 90,
    isFeatured: false,
    isTrending: true,
    isPopular: true,
    sessionTime: '5-15 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
  {
    id: 'pocket-planet',
    title: 'Pocket Planet',
    category: 'Simulation',
    icon: 'planet-outline',
    accentColor: '#178A71',
    backgroundColor: '#E6F7F1',
    rating: 4.6,
    reviews: '',
    downloads: '',
    description: 'Build a tiny thriving planet, grow its habitats, and keep your little world in balance.',
    tags: ['Simulation', 'Casual'],
    rewards: 150,
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    sessionTime: '10-20 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
  {
    id: 'shadow-quest',
    title: 'Shadow Quest',
    category: 'Adventure',
    icon: 'compass-outline',
    accentColor: '#C6533F',
    backgroundColor: '#FFF0EA',
    rating: 4.8,
    reviews: '',
    downloads: '',
    description: 'Explore forgotten ruins, follow hidden clues, and make your way through a story-rich quest.',
    tags: ['Adventure', 'Story'],
    rewards: 180,
    isFeatured: false,
    isTrending: true,
    isPopular: false,
    sessionTime: '10-20 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: true,
  },
  {
    id: 'goal-rush',
    title: 'Goal Rush',
    category: 'Sports',
    icon: 'football-outline',
    accentColor: '#20864A',
    backgroundColor: '#E8F6EC',
    rating: 4.5,
    reviews: '',
    downloads: '',
    description: 'Take quick shots on goal, beat the keeper, and climb the friendly league table.',
    tags: ['Sports', 'Arcade'],
    rewards: 100,
    isFeatured: false,
    isTrending: false,
    isPopular: true,
    sessionTime: '3-8 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: true,
  },
  {
    id: 'neon-blaster',
    title: 'Neon Blaster',
    category: 'Action',
    icon: 'flash-outline',
    accentColor: '#D14B86',
    backgroundColor: '#FCEAF2',
    rating: 4.6,
    reviews: '',
    downloads: '',
    description: 'Dodge incoming obstacles and defend your ship in fast, colorful arcade rounds.',
    tags: ['Action', 'Arcade'],
    rewards: 130,
    isFeatured: false,
    isTrending: true,
    isPopular: false,
    sessionTime: '3-8 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
  {
    id: 'kingdom-tactics',
    title: 'Kingdom Tactics',
    category: 'Strategy',
    icon: 'shield-outline',
    accentColor: '#B47719',
    backgroundColor: '#FBF2E2',
    rating: 4.7,
    reviews: '',
    downloads: '',
    description: 'Plan your moves, protect your outpost, and outsmart opponents in bite-size battles.',
    tags: ['Strategy', 'Tactics'],
    rewards: 160,
    isFeatured: false,
    isTrending: false,
    isPopular: false,
    sessionTime: '8-15 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: true,
  },
  {
    id: 'gem-pop',
    title: 'Gem Pop',
    category: 'Casual',
    icon: 'diamond-outline',
    accentColor: '#2186A5',
    backgroundColor: '#E7F5FA',
    rating: 4.5,
    reviews: '',
    downloads: '',
    description: 'Clear colorful gems in relaxing quick-play rounds and chase a new high score.',
    tags: ['Casual', 'Puzzle'],
    rewards: 80,
    isFeatured: false,
    isTrending: false,
    isPopular: false,
    sessionTime: '2-5 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
  {
    id: 'rhythm-rally',
    title: 'Rhythm Rally',
    category: 'Music',
    icon: 'musical-notes-outline',
    accentColor: '#7954C7',
    backgroundColor: '#F0ECFC',
    rating: 4.6,
    reviews: '',
    downloads: '',
    description: 'Tap along to an original beat, keep your combo going, and improve your rhythm score.',
    tags: ['Music', 'Arcade'],
    rewards: 110,
    isFeatured: false,
    isTrending: true,
    isPopular: false,
    sessionTime: '3-6 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
  {
    id: 'wordsmith',
    title: 'Wordsmith',
    category: 'Word',
    icon: 'book-outline',
    accentColor: '#A16035',
    backgroundColor: '#F8EEE7',
    rating: 4.7,
    reviews: '',
    downloads: '',
    description: 'Find words from a changing letter grid and give your vocabulary a fun daily workout.',
    tags: ['Word', 'Puzzle'],
    rewards: 95,
    isFeatured: false,
    isTrending: false,
    isPopular: false,
    sessionTime: '5-10 min',
    platforms: ['iOS', 'Android'],
    requiresOnline: false,
  },
];

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
}

const initialState: GamesState = {
  games: gamesCatalog,
  gameApplications: [],
  categories: ['All', 'Casual', 'Puzzle', 'Action', 'Strategy', 'Sports', 'Adventure', 'Arcade', 'Racing', 'Simulation', 'Music', 'Word'],
  selectedCategory: 'All',
  featuredGame: gamesCatalog[0],
  continuePlayingGames: [],
  searchQuery: '',
};

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
});

export const {
  setSelectedCategory,
  setSearchQuery,
  setGameApplications,
  setFeaturedGame,
} = gamesSlice.actions;
export default gamesSlice.reducer;

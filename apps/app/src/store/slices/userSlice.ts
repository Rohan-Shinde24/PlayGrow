import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string;
  role: 'player' | 'company' | 'admin';
  name: string;
  email: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  maxXp: number;
  totalPoints: number;
  availablePoints: number;
  pendingPoints: number;
  redeemedPoints: number;
  gamesPlayed: number;
  streak: number;
  streakDays: boolean[];
  isLoggedIn: boolean;
  isOnboarded: boolean;
}

const initialState: UserState = {
  id: '',
  role: 'player',
  name: '',
  email: '',
  username: '',
  avatar: '',
  level: 0,
  xp: 0,
  maxXp: 0,
  totalPoints: 0,
  availablePoints: 0,
  pendingPoints: 0,
  redeemedPoints: 0,
  gamesPlayed: 0,
  streak: 0,
  streakDays: [false, false, false, false, false, false, false],
  isLoggedIn: false,
  isOnboarded: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setOnboarded(state, action: PayloadAction<boolean>) {
      state.isOnboarded = action.payload;
    },
    updatePoints(state, action: PayloadAction<{ available: number; pending: number }>) {
      state.availablePoints = action.payload.available;
      state.pendingPoints = action.payload.pending;
      state.totalPoints = action.payload.available + action.payload.pending;
    },
    addPoints(state, action: PayloadAction<number>) {
      state.availablePoints += action.payload;
      state.totalPoints += action.payload;
    },
    updateProfile(state, action: PayloadAction<Partial<UserState>>) {
      return { ...state, ...action.payload };
    },
    incrementStreak(state) {
      state.streak += 1;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.id = '';
      state.name = '';
      state.username = '';
      state.email = '';
      state.avatar = '';
      state.role = 'player';
      state.level = 0;
      state.xp = 0;
      state.maxXp = 0;
      state.totalPoints = 0;
      state.availablePoints = 0;
      state.pendingPoints = 0;
      state.redeemedPoints = 0;
      state.gamesPlayed = 0;
      state.streak = 0;
      state.streakDays = [false, false, false, false, false, false, false];
    },
  },
});

export const {
  setLoggedIn,
  setOnboarded,
  updatePoints,
  addPoints,
  updateProfile,
  incrementStreak,
  logout,
} = userSlice.actions;

export default userSlice.reducer;

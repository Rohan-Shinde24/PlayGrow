import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import gamesReducer from './slices/gamesSlice';
import rewardsReducer from './slices/rewardsSlice';
import notificationsReducer from './slices/notificationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    games: gamesReducer,
    rewards: rewardsReducer,
    notifications: notificationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'reward' | 'game' | 'update';
  icon: string;
  isRead: boolean;
}

export interface NotificationsState {
  notifications: Notification[];
  selectedFilter: string;
  filters: string[];
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  selectedFilter: 'All',
  filters: ['All', 'Rewards', 'Games', 'Updates'],
  unreadCount: 0,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setSelectedFilter(state, action: PayloadAction<string>) {
      state.selectedFilter = action.payload;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.notifications.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead(state) {
      state.notifications.forEach((n) => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    },
  },
});

export const { setSelectedFilter, markAsRead, markAllAsRead, addNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;

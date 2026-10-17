import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Reward {
  id: string;
  title: string;
  description: string;
  image: string;
  cost: number;
  category: 'Game Credits' | 'Gift Cards' | 'Others';
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: 'earned' | 'redeemed';
  icon: string;
}

export interface RewardsState {
  rewards: Reward[];
  transactions: Transaction[];
  selectedCategory: string;
  categories: string[];
}

const initialState: RewardsState = {
  rewards: [],
  transactions: [],
  selectedCategory: 'All',
  categories: ['All', 'Game Credits', 'Gift Cards', 'Others'],
};

const rewardsSlice = createSlice({
  name: 'rewards',
  initialState,
  reducers: {
    setSelectedCategory(state, action: PayloadAction<string>) {
      state.selectedCategory = action.payload;
    },
    redeemReward(state, action: PayloadAction<string>) {
      const reward = state.rewards.find((r) => r.id === action.payload);
      if (reward) {
        state.transactions.unshift({
          id: `t${Date.now()}`,
          title: `Redeemed: ${reward.title}`,
          date: new Date().toLocaleString(),
          amount: -reward.cost,
          type: 'redeemed',
          icon: 'gift-outline',
        });
      }
    },
    addTransaction(state, action: PayloadAction<Transaction>) {
      state.transactions.unshift(action.payload);
    },
  },
});

export const { setSelectedCategory, redeemReward, addTransaction } = rewardsSlice.actions;
export default rewardsSlice.reducer;

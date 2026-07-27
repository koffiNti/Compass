import { create } from 'zustand';
import { Goal } from '../types';
import { goalsService } from '../services/goals';

interface GoalsState {
  goals: Goal[];
  isLoading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: Partial<Goal>) => Promise<void>;
  addMilestone: (goalId: string, title: string) => Promise<void>;
}

export const useGoalsStore = create<GoalsState>((set, get) => ({
  goals: [],
  isLoading: false,
  error: null,

  fetchGoals: async () => {
    set({ isLoading: true });
    try {
      const list = await goalsService.listGoals();
      set({ goals: list, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch goals.', isLoading: false });
    }
  },

  createGoal: async (goalData) => {
    try {
      await goalsService.createGoal(goalData);
      get().fetchGoals();
    } catch (err) {
      console.error('Error creating goal:', err);
    }
  },

  addMilestone: async (goalId, title) => {
    try {
      await goalsService.addMilestone(goalId, title);
      get().fetchGoals();
    } catch (err) {
      console.error('Error adding goal milestone:', err);
    }
  },
}));

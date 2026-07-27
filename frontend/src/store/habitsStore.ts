import { create } from 'zustand';
import { Habit } from '../types';
import { habitsService } from '../services/habits';

interface HabitsState {
  habits: Habit[];
  isLoading: boolean;
  error: string | null;
  fetchHabits: (checkDate?: string) => Promise<void>;
  createHabit: (habitData: Partial<Habit>) => Promise<void>;
  toggleHabit: (habitId: string, dateStr: string, completed: boolean, notes?: string) => Promise<void>;
}

export const useHabitsStore = create<HabitsState>((set, get) => ({
  habits: [],
  isLoading: false,
  error: null,

  fetchHabits: async (checkDate) => {
    set({ isLoading: true });
    try {
      const list = await habitsService.listHabits(checkDate);
      set({ habits: list, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch habits.', isLoading: false });
    }
  },

  createHabit: async (habitData) => {
    try {
      await habitsService.createHabit(habitData);
      get().fetchHabits();
    } catch (err) {
      console.error('Error creating habit:', err);
    }
  },

  toggleHabit: async (habitId, dateStr, completed, notes) => {
    // Optimistic UI update
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === habitId
          ? {
              ...h,
              completed_today: completed,
              current_streak: completed
                ? (h.current_streak || 0) + 1
                : Math.max(0, (h.current_streak || 1) - 1),
            }
          : h
      ),
    }));

    try {
      await habitsService.toggleHabitLog(habitId, dateStr, completed, notes);
      get().fetchHabits(dateStr);
    } catch (err) {
      get().fetchHabits(dateStr);
    }
  },
}));

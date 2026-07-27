import { api } from './api';
import { Habit, HabitLog } from '../types';

export const habitsService = {
  listHabits: async (checkDate?: string): Promise<Habit[]> => {
    const res = await api.get('/habits', { params: { check_date: checkDate } });
    return res.data;
  },

  createHabit: async (habitData: Partial<Habit>): Promise<Habit> => {
    const res = await api.post('/habits', habitData);
    return res.data;
  },

  toggleHabitLog: async (habitId: string, dateStr: string, completed: boolean, notes?: string): Promise<HabitLog> => {
    const res = await api.post('/habits/log', {
      habit_id: habitId,
      date: dateStr,
      completed,
      notes,
    });
    return res.data;
  },
};

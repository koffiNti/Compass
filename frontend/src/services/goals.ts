import { api } from './api';
import { Goal } from '../types';

export const goalsService = {
  listGoals: async (): Promise<Goal[]> => {
    const res = await api.get('/goals');
    return res.data;
  },

  createGoal: async (goalData: Partial<Goal>): Promise<Goal> => {
    const res = await api.post('/goals', goalData);
    return res.data;
  },

  addMilestone: async (goalId: string, title: string) => {
    const res = await api.post(`/goals/${goalId}/milestones`, null, { params: { title } });
    return res.data;
  },
};

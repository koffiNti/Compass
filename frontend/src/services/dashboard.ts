import { api } from './api';

export interface DashboardOverview {
  date: string;
  mood_score: number;
  energy_score: number;
  has_journaled_today: boolean;
  coding_minutes: number;
  study_minutes: number;
  reading_minutes: number;
  lecture_attended: boolean;
  trading_notes: string;
  habits_completed: number;
  habits_total: number;
  average_streak: number;
  habits_summary: Array<{
    id: string;
    title: string;
    completed_today: boolean;
    current_streak: number;
  }>;
}

export const dashboardService = {
  getOverview: async (targetDate?: string): Promise<DashboardOverview> => {
    const res = await api.get('/dashboard/overview', {
      params: { target_date: targetDate },
    });
    return res.data;
  },
};

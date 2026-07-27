import { api } from './api';

export interface AnalyticsData {
  time_frame_days: number;
  summary: {
    total_coding_hours: number;
    total_study_hours: number;
    average_mood_score: number;
    average_sleep_hours: number;
    lecture_attendance_count: number;
  };
  time_series: Array<{
    date: string;
    mood: number;
    energy: number;
    coding_minutes: number;
    study_minutes: number;
    sleep_hours: number;
  }>;
}

export const analyticsService = {
  getTrends: async (days: number = 30): Promise<AnalyticsData> => {
    const res = await api.get('/analytics/trends', { params: { days } });
    return res.data;
  },
};

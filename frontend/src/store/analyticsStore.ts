import { create } from 'zustand';
import { analyticsService, AnalyticsData } from '../services/analytics';

interface AnalyticsState {
  data: AnalyticsData | null;
  isLoading: boolean;
  error: string | null;
  fetchTrends: (days?: number) => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  data: null,
  isLoading: false,
  error: null,

  fetchTrends: async (days = 30) => {
    set({ isLoading: true });
    try {
      const res = await analyticsService.getTrends(days);
      set({ data: res, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch analytics trends.', isLoading: false });
    }
  },
}));

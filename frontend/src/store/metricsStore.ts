import { create } from 'zustand';
import { MetricDefinition, DailyMetricEntry } from '../types';
import { metricsService } from '../services/metrics';

interface MetricsState {
  definitions: MetricDefinition[];
  dailyEntries: DailyMetricEntry[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchDefinitions: () => Promise<void>;
  fetchDailyEntries: (dateStr: string) => Promise<void>;
  logBatch: (dateStr: string, entries: Partial<DailyMetricEntry>[]) => Promise<void>;
  createDefinition: (defData: Partial<MetricDefinition>) => Promise<void>;
}

export const useMetricsStore = create<MetricsState>((set, get) => ({
  definitions: [],
  dailyEntries: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchDefinitions: async () => {
    set({ isLoading: true });
    try {
      const defs = await metricsService.getDefinitions();
      set({ definitions: defs, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load metric definitions.', isLoading: false });
    }
  },

  fetchDailyEntries: async (dateStr: string) => {
    set({ isLoading: true });
    try {
      const entries = await metricsService.getDailyEntries(dateStr);
      set({ dailyEntries: entries, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to load daily metrics.', isLoading: false });
    }
  },

  logBatch: async (dateStr: string, entries) => {
    set({ isSaving: true });
    try {
      const updated = await metricsService.logBatch(dateStr, entries);
      set({ dailyEntries: updated, isSaving: false });
    } catch (err) {
      set({ error: 'Failed to log metrics.', isSaving: false });
    }
  },

  createDefinition: async (defData) => {
    try {
      await metricsService.createDefinition(defData);
      get().fetchDefinitions();
    } catch (err) {
      console.error('Error creating metric definition:', err);
    }
  },
}));

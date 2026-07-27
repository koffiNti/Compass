import { api } from './api';
import { MetricDefinition, DailyMetricEntry } from '../types';

export const metricsService = {
  getDefinitions: async (): Promise<MetricDefinition[]> => {
    const res = await api.get('/metrics/definitions');
    return res.data;
  },

  createDefinition: async (defData: Partial<MetricDefinition>): Promise<MetricDefinition> => {
    const res = await api.post('/metrics/definitions', defData);
    return res.data;
  },

  getDailyEntries: async (dateStr: string): Promise<DailyMetricEntry[]> => {
    const res = await api.get(`/metrics/date/${dateStr}`);
    return res.data;
  },

  logBatch: async (dateStr: string, entries: Partial<DailyMetricEntry>[]): Promise<DailyMetricEntry[]> => {
    const res = await api.post('/metrics/log', {
      date: dateStr,
      entries,
    });
    return res.data;
  },
};

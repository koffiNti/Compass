import { api } from './api';
import { JournalEntry } from '../types';

export const journalService = {
  getByDate: async (dateStr: string): Promise<JournalEntry | null> => {
    const res = await api.get(`/journal/date/${dateStr}`);
    return res.data;
  },

  listEntries: async (limit: number = 30): Promise<JournalEntry[]> => {
    const res = await api.get('/journal', { params: { limit } });
    return res.data;
  },

  saveEntry: async (entryData: Partial<JournalEntry>): Promise<JournalEntry> => {
    const res = await api.post('/journal', entryData);
    return res.data;
  },
};

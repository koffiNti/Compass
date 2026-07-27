import { create } from 'zustand';
import { JournalEntry } from '../types';
import { journalService } from '../services/journal';

interface JournalState {
  currentEntry: JournalEntry | null;
  entriesList: JournalEntry[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  fetchEntryByDate: (dateStr: string) => Promise<void>;
  fetchEntriesList: () => Promise<void>;
  saveEntry: (entryData: Partial<JournalEntry>) => Promise<void>;
}

export const useJournalStore = create<JournalState>((set, get) => ({
  currentEntry: null,
  entriesList: [],
  isLoading: false,
  isSaving: false,
  error: null,

  fetchEntryByDate: async (dateStr: string) => {
    set({ isLoading: true, error: null });
    try {
      const entry = await journalService.getByDate(dateStr);
      set({ currentEntry: entry, isLoading: false });
    } catch (err: any) {
      set({ error: 'Failed to load journal entry.', isLoading: false });
    }
  },

  fetchEntriesList: async () => {
    try {
      const list = await journalService.listEntries(30);
      set({ entriesList: list });
    } catch (err: any) {
      console.error('Error fetching journal list:', err);
    }
  },

  saveEntry: async (entryData) => {
    set({ isSaving: true, error: null });
    try {
      const saved = await journalService.saveEntry(entryData);
      set({ currentEntry: saved, isSaving: false });
      get().fetchEntriesList();
    } catch (err: any) {
      set({ error: 'Failed to save journal entry.', isSaving: false });
    }
  },
}));

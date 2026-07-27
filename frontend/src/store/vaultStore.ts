import { create } from 'zustand';
import { VaultItem } from '../types';
import { vaultService, VaultSearchResult } from '../services/vault';

interface VaultState {
  items: VaultItem[];
  searchResults: VaultSearchResult[];
  isSearching: boolean;
  isLoading: boolean;
  error: string | null;
  fetchItems: () => Promise<void>;
  createItem: (itemData: Partial<VaultItem>) => Promise<void>;
  searchVault: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useVaultStore = create<VaultState>((set, get) => ({
  items: [],
  searchResults: [],
  isSearching: false,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true });
    try {
      const list = await vaultService.listItems();
      set({ items: list, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch vault items.', isLoading: false });
    }
  },

  createItem: async (itemData) => {
    try {
      await vaultService.createItem(itemData);
      get().fetchItems();
    } catch (err) {
      console.error('Error creating vault item:', err);
    }
  },

  searchVault: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }
    set({ isSearching: true });
    try {
      const results = await vaultService.searchVault(query);
      set({ searchResults: results, isSearching: false });
    } catch (err) {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),
}));

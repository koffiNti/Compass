import { api } from './api';
import { VaultItem } from '../types';

export interface VaultSearchResult {
  item: VaultItem;
  similarity_score: number;
  matched_chunk: string;
}

export const vaultService = {
  listItems: async (): Promise<VaultItem[]> => {
    const res = await api.get('/vault');
    return res.data;
  },

  createItem: async (itemData: Partial<VaultItem>): Promise<VaultItem> => {
    const res = await api.post('/vault', itemData);
    return res.data;
  },

  searchVault: async (query: string): Promise<VaultSearchResult[]> => {
    const res = await api.get('/vault/search', { params: { q: query } });
    return res.data;
  },
};

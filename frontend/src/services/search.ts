import { api } from './api';

export interface SearchMatch {
  category: string;
  title: string;
  date: string;
  excerpt: string;
  link_id: string;
}

export interface UniversalSearchResponse {
  query: string;
  count: number;
  results: SearchMatch[];
}

export const searchService = {
  universalSearch: async (query: string): Promise<UniversalSearchResponse> => {
    const res = await api.get('/search/universal', { params: { q: query } });
    return res.data;
  },
};

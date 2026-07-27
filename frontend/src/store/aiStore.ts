import { create } from 'zustand';
import { coachService, AIReview, AIMessage } from '../services/coach';
import { searchService, SearchMatch } from '../services/search';

interface AIState {
  currentReview: AIReview | null;
  messages: AIMessage[];
  searchResults: SearchMatch[];
  isGeneratingReview: boolean;
  isAskingCoach: boolean;
  isSearching: boolean;
  error: string | null;
  generateReview: (type: string) => Promise<void>;
  askCoach: (question: string) => Promise<void>;
  universalSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
}

export const useAIStore = create<AIState>((set, get) => ({
  currentReview: null,
  messages: [],
  searchResults: [],
  isGeneratingReview: false,
  isAskingCoach: false,
  isSearching: false,
  error: null,

  generateReview: async (type) => {
    set({ isGeneratingReview: true, error: null });
    try {
      const review = await coachService.generateReview(type);
      set({ currentReview: review, isGeneratingReview: false });
    } catch (err) {
      set({ error: 'Failed to generate review.', isGeneratingReview: false });
    }
  },

  askCoach: async (question) => {
    const userMsg: AIMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: question,
      created_at: new Date().toISOString(),
    };
    set((state) => ({
      messages: [...state.messages, userMsg],
      isAskingCoach: true,
    }));

    try {
      const reply = await coachService.askCoach(question);
      set((state) => ({
        messages: [...state.messages, reply],
        isAskingCoach: false,
      }));
    } catch (err) {
      set({ isAskingCoach: false });
    }
  },

  universalSearch: async (query) => {
    if (!query.trim()) {
      set({ searchResults: [], isSearching: false });
      return;
    }
    set({ isSearching: true });
    try {
      const res = await searchService.universalSearch(query);
      set({ searchResults: res.results, isSearching: false });
    } catch (err) {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchResults: [], isSearching: false }),
}));

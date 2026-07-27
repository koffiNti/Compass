import { api } from './api';

export interface AIReview {
  id: string;
  review_type: string;
  period_start: string;
  period_end: string;
  summary_markdown: string;
  insights: Record<string, any>;
  action_items: string[];
  created_at: string;
}

export interface AIMessage {
  id: string;
  sender: string;
  content: string;
  created_at: string;
}

export const coachService = {
  generateReview: async (reviewType: string): Promise<AIReview> => {
    const res = await api.post('/coach/review', { review_type: reviewType });
    return res.data;
  },

  askCoach: async (question: string, conversationId?: string): Promise<AIMessage> => {
    const res = await api.post('/coach/chat', { question, conversation_id: conversationId });
    return res.data;
  },
};

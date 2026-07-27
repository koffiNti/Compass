export interface UserPreference {
  id: string;
  user_id: string;
  ai_provider: string;
  ai_model: string;
  api_key?: string;
  custom_base_url?: string;
  theme: string;
  daily_reminder_time: string;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  created_at: string;
  preferences?: UserPreference;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface MetricDefinition {
  id: string;
  key: string;
  label: string;
  unit?: string;
  metric_type: 'numeric' | 'boolean' | 'rating' | 'text';
  is_active: boolean;
  display_order: number;
}

export interface DailyMetricEntry {
  id: string;
  date: string;
  metric_id: string;
  numeric_value?: number;
  boolean_value?: boolean;
  string_value?: string;
}

export interface JournalEntry {
  id: string;
  date: string;
  mood_score: number;
  energy_score: number;
  content_markdown: string;
  wins?: string;
  challenges?: string;
  lessons?: string;
  gratitude?: string;
  tomorrow_goals?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  title: string;
  description?: string;
  category: string;
  frequency: string;
  target_count: number;
  is_archived: boolean;
  created_at: string;
  current_streak?: number;
  longest_streak?: number;
  completed_today?: boolean;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface Goal {
  id: string;
  parent_goal_id?: string;
  title: string;
  description?: string;
  timeframe: 'long_term' | 'quarterly' | 'monthly' | 'weekly' | 'daily';
  target_date?: string;
  progress_percentage: number;
  status: 'in_progress' | 'completed' | 'paused' | 'abandoned';
  category?: string;
  created_at: string;
  sub_goals?: Goal[];
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  status: string;
  technologies?: string[];
  repo_url?: string;
  demo_url?: string;
  progress_percentage: number;
  created_at: string;
}

export interface VaultItem {
  id: string;
  title: string;
  item_type: 'article' | 'idea' | 'lecture_note' | 'bookmark' | 'document';
  content_markdown?: string;
  source_url?: string;
  tags?: string[];
  created_at: string;
}

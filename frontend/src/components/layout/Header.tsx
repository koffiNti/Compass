import React from 'react';
import { Calendar, Sparkles, Bell, Settings } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface HeaderProps {
  title: string;
  onOpenAISettings?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, onOpenAISettings }) => {
  const { user } = useAuthStore();
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <header className="h-16 border-b border-white/10 px-8 flex items-center justify-between glass-panel sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-white font-sans">{title}</h2>
      </div>

      <div className="flex items-center space-x-3">
        {/* Date Display */}
        <div className="hidden sm:flex items-center space-x-2 text-xs text-zinc-400 bg-zinc-900/60 border border-white/5 rounded-xl px-3 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-blue-400" />
          <span>{today}</span>
        </div>

        {/* AI Key & Provider Settings Trigger Button */}
        <button
          onClick={onOpenAISettings}
          title="Configure AI Keys & Engine"
          className="flex items-center space-x-2 text-xs text-zinc-300 hover:text-white bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-xl px-3 py-1.5 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
          <span className="capitalize">{user?.preferences?.ai_provider || 'OpenAI'}</span>
          <span className="text-[10px] bg-purple-900/40 text-purple-300 px-1.5 py-0.5 rounded uppercase font-mono border border-purple-500/20">
            {user?.preferences?.ai_model || 'gpt-4o'}
          </span>
          <Settings className="w-3.5 h-3.5 text-zinc-400 ml-1" />
        </button>

        {/* Bell Notifications */}
        <button
          title="Notifications"
          className="relative p-2 rounded-xl bg-zinc-900/60 border border-white/5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500" />
        </button>
      </div>
    </header>
  );
};

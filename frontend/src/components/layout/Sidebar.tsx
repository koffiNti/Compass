import React from 'react';
import {
  Compass,
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  BarChart2,
  FolderGit2,
  Archive,
  Bot,
  Search,
  Sparkles,
  LogOut,
  Target
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export type NavTab = 
  | 'dashboard'
  | 'journal'
  | 'metrics'
  | 'habits'
  | 'goals'
  | 'projects'
  | 'vault'
  | 'coach'
  | 'analytics'
  | 'search';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenCommandPalette: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
}) => {
  const { user, logout } = useAuthStore();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'journal', label: 'Daily Journal', icon: BookOpen },
    { id: 'metrics', label: 'Daily Metrics', icon: CheckSquare },
    { id: 'habits', label: 'Habit Tracker', icon: Sparkles },
    { id: 'goals', label: 'Goals', icon: Target },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'vault', label: 'Knowledge Vault', icon: Archive },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'search', label: 'AI Search', icon: Search },
  ];

  return (
    <aside className="w-64 h-screen glass-panel border-r border-white/10 flex flex-col justify-between p-4 select-none shrink-0">
      <div>
        {/* Brand Header */}
        <div className="flex items-center space-x-3 px-2 py-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Compass className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-white font-sans">Compass</h1>
            <p className="text-[11px] text-zinc-400 font-medium">Personal OS v1.0</p>
          </div>
        </div>

        {/* Command Search Bar Button */}
        <button
          onClick={onOpenCommandPalette}
          className="w-full mb-6 bg-zinc-900/60 hover:bg-zinc-800/80 border border-white/10 rounded-xl px-3 py-2 flex items-center justify-between text-xs text-zinc-400 transition-all cursor-pointer group"
        >
          <div className="flex items-center space-x-2">
            <Search className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
            <span>Search OS...</span>
          </div>
          <kbd className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded border border-zinc-700 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Navigation Section */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-zinc-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile */}
      <div className="border-t border-white/5 pt-4">
        <div className="flex items-center justify-between px-2 py-2 rounded-xl bg-zinc-900/40 border border-white/5">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-zinc-200 truncate">{user?.full_name || 'User'}</p>
              <p className="text-[10px] text-zinc-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign Out"
            className="text-zinc-500 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-white/5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};

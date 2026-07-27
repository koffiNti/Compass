import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  LayoutDashboard,
  BookOpen,
  CheckSquare,
  Sparkles,
  Target,
  FolderGit2,
  Archive,
  Bot,
  BarChart2,
  ArrowRight,
  X
} from 'lucide-react';
import { NavTab } from '../layout/Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveTab: (tab: NavTab) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  setActiveTab,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: { id: NavTab; label: string; description: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Overview', description: 'Daily operational overview & command picture', icon: LayoutDashboard },
    { id: 'journal', label: 'Daily Journal', description: 'Reflect on wins, problems, lessons, and mood', icon: BookOpen },
    { id: 'metrics', label: 'Daily Metrics', description: 'Log coding minutes, study time, gym, and sleep', icon: CheckSquare },
    { id: 'habits', label: 'Habit Tracker', description: 'Track daily discipline, streaks, and heatmaps', icon: Sparkles },
    { id: 'goals', label: 'Goals Hierarchy', description: 'Manage long-term, quarterly, and daily goals', icon: Target },
    { id: 'projects', label: 'Software Projects', description: 'Repository hub, milestones, and tech stack', icon: FolderGit2 },
    { id: 'vault', label: 'Knowledge Vault', description: 'Semantic search across articles, notes & bookmarks', icon: Archive },
    { id: 'coach', label: 'AI Personal Coach', description: 'Automated weekly reviews & diagnostic Q&A', icon: Bot },
    { id: 'analytics', label: 'Analytics', description: 'Multi-year charts for mood, coding & discipline', icon: BarChart2 },
    { id: 'search', label: 'AI Universal Search', description: 'Natural language search across all second brain data', icon: Search },
  ];

  const filteredCommands = commands.filter(
    (c) =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.description.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          setActiveTab(filteredCommands[selectedIndex].id);
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, setActiveTab, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          className="w-full max-w-xl glass-panel rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 border-b border-white/10 py-3">
            <Search className="w-4 h-4 text-zinc-500 mr-3 shrink-0" />
            <input
              type="text"
              autoFocus
              placeholder="Type a command or jump to module..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none font-sans"
            />
            <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer ml-2">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtered Command List */}
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            {filteredCommands.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500">No matching OS commands found.</div>
            ) : (
              filteredCommands.map((cmd, idx) => {
                const Icon = cmd.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <div
                    key={cmd.id}
                    onClick={() => {
                      setActiveTab(cmd.id);
                      onClose();
                    }}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-all ${
                      isSelected ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'text-zinc-400 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-zinc-500'}`} />
                      <div>
                        <p className="text-xs font-semibold text-zinc-100">{cmd.label}</p>
                        <p className="text-[11px] text-zinc-500">{cmd.description}</p>
                      </div>
                    </div>
                    {isSelected && <ArrowRight className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="border-t border-white/5 px-4 py-2 bg-zinc-950/60 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
            <span>Navigation: ↑↓ Navigate | ↵ Select | Esc Close</span>
            <span>Compass Personal OS</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

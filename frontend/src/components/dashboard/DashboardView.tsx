import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  GraduationCap,
  Sparkles,
  Smile,
  Zap,
  TrendingUp,
  CheckCircle2,
  XCircle,
  BookOpen,
  ArrowRight,
  Flame
} from 'lucide-react';
import { dashboardService, DashboardOverview } from '../../services/dashboard';
import { NavTab } from '../layout/Sidebar';

interface DashboardViewProps {
  setActiveTab: (tab: NavTab) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getOverview().then((res) => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
        Loading operating picture...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Greeting Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Today's Command Summary</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white font-sans">
              Operational Focus
            </h1>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl leading-relaxed">
              Track consistency across code, academia, discipline, and emotional well-being.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setActiveTab('journal')}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2.5 px-5 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{data.has_journaled_today ? 'Edit Daily Journal' : 'Write Journal'}</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Top Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Coding Minutes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-400">Coding Time</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Code className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{data.coding_minutes}</span>
            <span className="text-xs text-zinc-500 font-medium">mins today</span>
          </div>
        </motion.div>

        {/* Study Time */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-400">Study & Academia</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{data.study_minutes}</span>
            <span className="text-xs text-zinc-500 font-medium">mins today</span>
          </div>
        </motion.div>

        {/* Habit Completion */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-400">Habit Execution</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">
              {data.habits_completed} / {data.habits_total}
            </span>
            <span className="text-xs text-zinc-500 font-medium">habits</span>
          </div>
        </motion.div>

        {/* Active Streak */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 rounded-2xl border border-white/10"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-medium text-zinc-400">Average Streak</span>
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
              <Flame className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-bold text-white font-mono">{data.average_streak}</span>
            <span className="text-xs text-zinc-500 font-medium">days consecutive</span>
          </div>
        </motion.div>
      </div>

      {/* Mood & Energy Bar + Habit Strip */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mood & Energy Gauges */}
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <h3 className="text-sm font-semibold text-white mb-4">State of Mind</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="flex items-center space-x-2 text-zinc-400">
                  <Smile className="w-4 h-4 text-emerald-400" />
                  <span>Mood Score</span>
                </span>
                <span className="font-mono font-bold text-emerald-400">{data.mood_score} / 10</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${(data.mood_score / 10) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="flex items-center space-x-2 text-zinc-400">
                  <Zap className="w-4 h-4 text-amber-400" />
                  <span>Energy Level</span>
                </span>
                <span className="font-mono font-bold text-amber-400">{data.energy_score} / 10</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-amber-500 h-full rounded-full transition-all"
                  style={{ width: `${(data.energy_score / 10) * 100}%` }}
                />
              </div>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('journal')}
            className="mt-6 w-full text-xs text-zinc-400 hover:text-white flex items-center justify-center space-x-1 py-2 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors"
          >
            <span>Update State in Journal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Habit Summary Strip */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Daily Habit Execution</h3>
            <button
              onClick={() => setActiveTab('habits')}
              className="text-xs text-blue-400 hover:underline font-medium"
            >
              Manage Habits
            </button>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {data.habits_summary.length === 0 ? (
              <p className="text-xs text-zinc-500 py-4 text-center">No habits added yet.</p>
            ) : (
              data.habits_summary.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-900/60 border border-white/5"
                >
                  <div className="flex items-center space-x-3">
                    {h.completed_today ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <XCircle className="w-4 h-4 text-zinc-600" />
                    )}
                    <span className="text-xs font-medium text-zinc-200">{h.title}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] font-mono text-zinc-500">
                      {h.current_streak} day streak
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Trading Notes Summary if present */}
      {data.trading_notes && (
        <div className="glass-card p-6 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2">
            <TrendingUp className="w-4 h-4" />
            <span>Today's Trading Notes</span>
          </div>
          <p className="text-xs text-zinc-300 font-mono leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-white/5">
            {data.trading_notes}
          </p>
        </div>
      )}
    </div>
  );
};

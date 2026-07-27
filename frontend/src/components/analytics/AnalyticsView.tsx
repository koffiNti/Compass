import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart2,
  TrendingUp,
  Clock,
  Code,
  GraduationCap,
  Smile,
  Moon,
  CheckCircle2
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';
import { useAnalyticsStore } from '../../store/analyticsStore';

export const AnalyticsView: React.FC = () => {
  const { data, fetchTrends, isLoading } = useAnalyticsStore();
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchTrends(days);
  }, [days]);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64 text-zinc-500 text-sm">
        Loading analytics engine trends...
      </div>
    );
  }

  const chartData = data.time_series.map((item) => ({
    date: item.date.slice(5),
    Mood: item.mood,
    Energy: item.energy,
    Coding: item.coding_minutes,
    Study: item.study_minutes,
    Sleep: item.sleep_hours,
  }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Range Selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white">Multi-Year Operating Analytics</h2>
          <p className="text-xs text-zinc-400">Evaluate correlations between sleep, mood, coding velocity, and academic consistency.</p>
        </div>

        <div className="flex space-x-1 bg-zinc-900 border border-white/10 p-1 rounded-xl">
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                days === d ? 'bg-blue-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {d} Days
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">Total Coding</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-white">{data.summary.total_coding_hours}</span>
            <span className="text-xs text-zinc-500 font-medium">hours</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">Total Study</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-white">{data.summary.total_study_hours}</span>
            <span className="text-xs text-zinc-500 font-medium">hours</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">Average Mood</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-emerald-400">{data.summary.average_mood_score}</span>
            <span className="text-xs text-zinc-500 font-medium">/ 10</span>
          </div>
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <span className="text-[11px] text-zinc-400 font-medium block mb-1">Average Sleep</span>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-2xl font-bold font-mono text-indigo-400">{data.summary.average_sleep_hours}</span>
            <span className="text-xs text-zinc-500 font-medium">hours/night</span>
          </div>
        </div>
      </div>

      {/* Coding vs Study Time Bar Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
          <Code className="w-4 h-4" />
          <span>Coding vs. Study Output (Minutes)</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
              <YAxis stroke="#71717a" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Bar dataKey="Coding" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Study" fill="#a855f7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mood vs Energy Area Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
          <Smile className="w-4 h-4" />
          <span>Mood & Energy Level Trajectory</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorEnergy" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="date" stroke="#71717a" fontSize={11} />
              <YAxis domain={[0, 10]} stroke="#71717a" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="Mood" stroke="#10b981" fillOpacity={1} fill="url(#colorMood)" />
              <Area type="monotone" dataKey="Energy" stroke="#f59e0b" fillOpacity={1} fill="url(#colorEnergy)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Check, Flame, Trophy, Calendar, Sparkles } from 'lucide-react';
import { useHabitsStore } from '../../store/habitsStore';

export const HabitsView: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const { habits, fetchHabits, createHabit, toggleHabit } = useHabitsStore();

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('coding');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchHabits(todayStr);
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await createHabit({ title, category, description, frequency: 'daily' });
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  // Generate 365-day Heatmap mock matrix grid for visual representation
  const renderHeatmap = () => {
    const days = 100;
    const squares = [];
    for (let i = 0; i < days; i++) {
      // Simulate higher activity intensity
      const level = (i * 7 + 3) % 4;
      let bg = 'bg-zinc-800/40';
      if (level === 1) bg = 'bg-blue-900/60';
      if (level === 2) bg = 'bg-blue-600/80';
      if (level === 3) bg = 'bg-blue-400';

      squares.push(
        <div
          key={i}
          className={`w-3 h-3 rounded-sm ${bg} transition-colors hover:ring-1 hover:ring-white`}
          title={`Day ${i + 1}`}
        />
      );
    }
    return squares;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header & Add Habit Button */}
      <div className="flex items-center justify-between glass-panel p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white">Habit Consistency</h2>
          <p className="text-xs text-zinc-400">Track daily execution discipline over years.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Habit</span>
        </button>
      </div>

      {/* 365-Day Consistency Heatmap */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span>Consistency Heatmap Matrix</span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">Last 100 Days</span>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-start">{renderHeatmap()}</div>
      </div>

      {/* Habit Cards List */}
      <div className="space-y-3">
        {habits.length === 0 ? (
          <div className="glass-panel p-12 text-center text-zinc-500 text-xs rounded-2xl">
            No habits created yet. Click "New Habit" to start tracking.
          </div>
        ) : (
          habits.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl border border-white/10 flex items-center justify-between gap-4"
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => toggleHabit(h.id, todayStr, !h.completed_today)}
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                    h.completed_today
                      ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 shadow-md shadow-emerald-500/20'
                      : 'bg-zinc-900 border-white/10 text-zinc-600 hover:text-zinc-300'
                  }`}
                >
                  <Check className={`w-5 h-5 ${h.completed_today ? 'opacity-100' : 'opacity-30'}`} />
                </button>

                <div>
                  <h4 className="text-sm font-semibold text-white">{h.title}</h4>
                  {h.description && <p className="text-xs text-zinc-400 mt-0.5">{h.description}</p>}
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2 text-xs">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block font-medium uppercase">Current</span>
                    <span className="text-white font-mono font-bold">{h.current_streak || 0} days</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs border-l border-white/5 pl-6">
                  <Trophy className="w-4 h-4 text-amber-400" />
                  <div>
                    <span className="text-zinc-500 text-[10px] block font-medium uppercase">Record</span>
                    <span className="text-white font-mono font-bold">{h.longest_streak || 0} days</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Habit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Create New Custom Habit</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Habit Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 2 Hours Python / Rust Coding"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="coding">Coding & Software</option>
                  <option value="academics">Academics & Study</option>
                  <option value="health">Health & Fitness</option>
                  <option value="mindfulness">Mindfulness & Mental</option>
                  <option value="trading">Trading & Finance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Optional notes or goals for this habit..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl"
                >
                  Create Habit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

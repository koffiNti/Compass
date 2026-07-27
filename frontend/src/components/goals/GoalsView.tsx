import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, CheckCircle2, Circle, Flag, Calendar, Sparkles } from 'lucide-react';
import { useGoalsStore } from '../../store/goalsStore';

export const GoalsView: React.FC = () => {
  const { goals, fetchGoals, createGoal, addMilestone } = useGoalsStore();
  const [activeTab, setActiveTab] = useState<string>('all');

  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [timeframe, setTimeframe] = useState('quarterly');
  const [category, setCategory] = useState('career');
  const [progress, setProgress] = useState(0);

  const [newMilestoneTitle, setNewMilestoneTitle] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    await createGoal({
      title,
      description,
      timeframe: timeframe as any,
      category,
      progress_percentage: progress,
    });
    setTitle('');
    setDescription('');
    setShowAddModal(false);
  };

  const handleAddMilestone = async (goalId: string) => {
    const text = newMilestoneTitle[goalId];
    if (!text) return;
    await addMilestone(goalId, text);
    setNewMilestoneTitle({ ...newMilestoneTitle, [goalId]: '' });
  };

  const filteredGoals = goals.filter((g) => {
    if (activeTab === 'all') return true;
    return g.timeframe === activeTab;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div>
          <h2 className="text-base font-semibold text-white">Multi-Horizon Goals Engine</h2>
          <p className="text-xs text-zinc-400">Align long-term vision with quarterly and daily objectives.</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Timeframe Filter Buttons */}
      <div className="flex space-x-2 border-b border-white/10 pb-3">
        {['all', 'long_term', 'quarterly', 'monthly', 'weekly', 'daily'].map((tf) => (
          <button
            key={tf}
            onClick={() => setActiveTab(tf)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium capitalize transition-all cursor-pointer ${
              activeTab === tf
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tf.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Goals Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredGoals.length === 0 ? (
          <div className="col-span-2 glass-panel p-12 text-center text-zinc-500 text-xs rounded-2xl">
            No goals found for this timeframe.
          </div>
        ) : (
          filteredGoals.map((g) => (
            <motion.div
              key={g.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {g.timeframe.replace('_', ' ')}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">
                    {g.progress_percentage}% Done
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-1">{g.title}</h3>
                {g.description && <p className="text-xs text-zinc-400 mb-4">{g.description}</p>}

                {/* Progress Bar */}
                <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden mb-4">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all"
                    style={{ width: `${g.progress_percentage}%` }}
                  />
                </div>
              </div>

              {/* Milestones Add Section */}
              <div className="border-t border-white/5 pt-3 mt-2">
                <p className="text-[11px] font-semibold text-zinc-400 mb-2">Milestones</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Add milestone..."
                    value={newMilestoneTitle[g.id] || ''}
                    onChange={(e) =>
                      setNewMilestoneTitle({ ...newMilestoneTitle, [g.id]: e.target.value })
                    }
                    onKeyDown={(e) => e.key === 'Enter' && handleAddMilestone(g.id)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50"
                  />
                  <button
                    onClick={() => handleAddMilestone(g.id)}
                    className="p-1.5 bg-blue-600/30 text-blue-300 rounded-xl border border-blue-500/30 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Create Operating Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Deep Learning Architecture"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Timeframe</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="long_term">Long-Term Multi-Year</option>
                  <option value="quarterly">Quarterly (3 Months)</option>
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="daily">Daily Objective</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Initial Progress (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(parseFloat(e.target.value))}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Key metrics or outcomes..."
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
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

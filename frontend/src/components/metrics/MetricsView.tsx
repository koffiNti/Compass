import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Save, Plus, Check, Clock, Code, GraduationCap, Dumbbell, BookOpen, Droplet, Moon, TrendingUp, Sparkles } from 'lucide-react';
import { useMetricsStore } from '../../store/metricsStore';

export const MetricsView: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const {
    definitions,
    dailyEntries,
    fetchDefinitions,
    fetchDailyEntries,
    logBatch,
    createDefinition,
    isSaving
  } = useMetricsStore();

  const [formValues, setFormValues] = useState<Record<string, { numeric_value?: number; boolean_value?: boolean; string_value?: string }>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState('numeric');
  const [newUnit, setNewUnit] = useState('mins');

  useEffect(() => {
    fetchDefinitions();
  }, []);

  useEffect(() => {
    fetchDailyEntries(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    const valMap: Record<string, any> = {};
    dailyEntries.forEach((e) => {
      valMap[e.metric_id] = {
        numeric_value: e.numeric_value ?? undefined,
        boolean_value: e.boolean_value ?? undefined,
        string_value: e.string_value ?? undefined,
      };
    });
    setFormValues(valMap);
  }, [dailyEntries]);

  const handleNumericChange = (metricId: string, val: string) => {
    const num = val === '' ? undefined : parseFloat(val);
    setFormValues({
      ...formValues,
      [metricId]: { ...formValues[metricId], numeric_value: num },
    });
  };

  const handleBooleanToggle = (metricId: string) => {
    const current = formValues[metricId]?.boolean_value || false;
    setFormValues({
      ...formValues,
      [metricId]: { ...formValues[metricId], boolean_value: !current },
    });
  };

  const handleTextChange = (metricId: string, txt: string) => {
    setFormValues({
      ...formValues,
      [metricId]: { ...formValues[metricId], string_value: txt },
    });
  };

  const handleSaveAll = async () => {
    const entries = definitions.map((d) => ({
      metric_id: d.id,
      date: selectedDate as any,
      numeric_value: formValues[d.id]?.numeric_value,
      boolean_value: formValues[d.id]?.boolean_value,
      string_value: formValues[d.id]?.string_value,
    }));
    await logBatch(selectedDate, entries);
  };

  const handleCreateCustom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel) return;
    const key = newLabel.toLowerCase().replace(/\s+/g, '_');
    await createDefinition({
      key,
      label: newLabel,
      metric_type: newType as any,
      unit: newUnit,
      display_order: definitions.length + 1,
    });
    setNewLabel('');
    setShowAddModal(false);
  };

  const getIcon = (key: string) => {
    switch (key) {
      case 'coding_minutes': return <Code className="w-4 h-4 text-blue-400" />;
      case 'study_minutes': return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'reading_minutes': return <BookOpen className="w-4 h-4 text-amber-400" />;
      case 'gym_workout': return <Dumbbell className="w-4 h-4 text-red-400" />;
      case 'sleep_hours': return <Moon className="w-4 h-4 text-indigo-400" />;
      case 'water_intake': return <Droplet className="w-4 h-4 text-cyan-400" />;
      case 'trading_notes': return <TrendingUp className="w-4 h-4 text-emerald-400" />;
      default: return <Clock className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-white/10">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-100 font-mono focus:outline-none focus:border-blue-500/50"
          />
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="text-xs text-zinc-400 hover:text-white bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer"
          >
            Today
          </button>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 px-3 py-1.5 rounded-xl border border-white/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Custom Metric</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Metrics'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {definitions.map((d) => {
          const valObj = formValues[d.id] || {};
          return (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-xl bg-zinc-900 border border-white/5">
                    {getIcon(d.key)}
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-white">{d.label}</h4>
                    {d.unit && <span className="text-[10px] text-zinc-500 font-mono">{d.unit}</span>}
                  </div>
                </div>
              </div>

              {/* Dynamic Metric Inputs */}
              <div>
                {d.metric_type === 'numeric' && (
                  <div className="relative">
                    <input
                      type="number"
                      step="any"
                      placeholder="0"
                      value={valObj.numeric_value ?? ''}
                      onChange={(e) => handleNumericChange(d.id, e.target.value)}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-sm font-mono text-zinc-100 focus:outline-none focus:border-blue-500/50"
                    />
                  </div>
                )}

                {d.metric_type === 'boolean' && (
                  <button
                    onClick={() => handleBooleanToggle(d.id)}
                    className={`w-full py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                      valObj.boolean_value
                        ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                        : 'bg-zinc-900 border-white/10 text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    <Check className={`w-4 h-4 ${valObj.boolean_value ? 'opacity-100' : 'opacity-20'}`} />
                    <span>{valObj.boolean_value ? 'Completed / Attended' : 'Not Logged'}</span>
                  </button>
                )}

                {d.metric_type === 'text' && (
                  <textarea
                    rows={2}
                    placeholder="Log trading notes, key highlights, or comments..."
                    value={valObj.string_value ?? ''}
                    onChange={(e) => handleTextChange(d.id, e.target.value)}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 resize-none font-mono"
                  />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Add Custom Metric Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Create Custom Tracking Metric</h3>
            <form onSubmit={handleCreateCustom} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Metric Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Deep Work Hours"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Metric Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="numeric">Numeric Value (Number/Minutes/Hours)</option>
                  <option value="boolean">Yes/No Boolean Checkbox</option>
                  <option value="text">Free Text Notes</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Unit (Optional)</label>
                <input
                  type="text"
                  placeholder="mins, hours, glasses, rating"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
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
                  Create Metric
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

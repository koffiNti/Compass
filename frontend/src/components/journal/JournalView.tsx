import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  Save,
  Smile,
  Zap,
  Award,
  AlertCircle,
  Lightbulb,
  Heart,
  Target,
  Tag,
  Plus,
  X,
  FileText,
  Eye
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useJournalStore } from '../../store/journalStore';

export const JournalView: React.FC = () => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const { currentEntry, fetchEntryByDate, saveEntry, isSaving } = useJournalStore();

  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [content, setContent] = useState('');
  const [wins, setWins] = useState('');
  const [challenges, setChallenges] = useState('');
  const [lessons, setLessons] = useState('');
  const [gratitude, setGratitude] = useState('');
  const [tomorrowGoals, setTomorrowGoals] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [previewMode, setPreviewMode] = useState(false);
  const [saveSuccess, setSaveSavingSuccess] = useState(false);

  useEffect(() => {
    fetchEntryByDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    if (currentEntry) {
      setMood(currentEntry.mood_score || 5);
      setEnergy(currentEntry.energy_score || 5);
      setContent(currentEntry.content_markdown || '');
      setWins(currentEntry.wins || '');
      setChallenges(currentEntry.challenges || '');
      setLessons(currentEntry.lessons || '');
      setGratitude(currentEntry.gratitude || '');
      setTomorrowGoals(currentEntry.tomorrow_goals || '');
      setTags(currentEntry.tags || []);
    } else {
      setMood(5);
      setEnergy(5);
      setContent('');
      setWins('');
      setChallenges('');
      setLessons('');
      setGratitude('');
      setTomorrowGoals('');
      setTags([]);
    }
  }, [currentEntry]);

  const handleSave = async () => {
    await saveEntry({
      date: selectedDate as any,
      mood_score: mood,
      energy_score: energy,
      content_markdown: content,
      wins,
      challenges,
      lessons,
      gratitude,
      tomorrow_goals: tomorrowGoals,
      tags,
    });
    setSaveSavingSuccess(true);
    setTimeout(() => setSaveSavingSuccess(false), 2500);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Date Navigation & Save Toolbar */}
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
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800/60 px-3 py-1.5 rounded-xl border border-white/5 cursor-pointer"
          >
            {previewMode ? <FileText className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? 'Edit Mode' : 'Preview Markdown'}</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Entry'}</span>
          </button>
        </div>
      </div>

      {/* Mood & Energy Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span>Mood Rating</span>
            </span>
            <span className="font-mono text-sm font-bold text-emerald-400">{mood} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
        </div>

        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center space-x-2 text-xs font-semibold text-zinc-300">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Energy Level</span>
            </span>
            <span className="font-mono text-sm font-bold text-amber-400">{energy} / 10</span>
          </div>
          <input
            type="range"
            min="1"
            max="10"
            value={energy}
            onChange={(e) => setEnergy(parseInt(e.target.value))}
            className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>
      </div>

      {/* Main Content Markdown Editor / Preview */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10">
        <h3 className="text-sm font-semibold text-white mb-3">Daily Narrative & Deep Thought</h3>
        {previewMode ? (
          <div className="prose prose-invert max-w-none text-xs leading-relaxed min-h-[160px] p-4 bg-zinc-950/60 rounded-xl border border-white/5">
            <ReactMarkdown>{content || '*No text entered yet.*'}</ReactMarkdown>
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write markdown here... Record your ideas, daily reflections, coding breakthroughs, problems solved..."
            rows={8}
            className="w-full bg-zinc-950/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 resize-y"
          />
        )}
      </div>

      {/* Reflection Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wins */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-amber-400 mb-2">
            <Award className="w-4 h-4" />
            <span>Today's Wins</span>
          </div>
          <textarea
            value={wins}
            onChange={(e) => setWins(e.target.value)}
            placeholder="What went well today?"
            rows={2}
            className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/30 resize-none"
          />
        </div>

        {/* Challenges */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-red-400 mb-2">
            <AlertCircle className="w-4 h-4" />
            <span>Challenges & Friction</span>
          </div>
          <textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="What caused friction or procrastination?"
            rows={2}
            className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-red-500/30 resize-none"
          />
        </div>

        {/* Lessons */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-indigo-400 mb-2">
            <Lightbulb className="w-4 h-4" />
            <span>Lessons Learned</span>
          </div>
          <textarea
            value={lessons}
            onChange={(e) => setLessons(e.target.value)}
            placeholder="Key insights to carry forward..."
            rows={2}
            className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/30 resize-none"
          />
        </div>

        {/* Gratitude */}
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 mb-2">
            <Heart className="w-4 h-4" />
            <span>Gratitude</span>
          </div>
          <textarea
            value={gratitude}
            onChange={(e) => setGratitude(e.target.value)}
            placeholder="What are you grateful for today?"
            rows={2}
            className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500/30 resize-none"
          />
        </div>
      </div>

      {/* Tomorrow's Goals & Tags */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 glass-card p-5 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400 mb-2">
            <Target className="w-4 h-4" />
            <span>Tomorrow's Priority Objectives</span>
          </div>
          <textarea
            value={tomorrowGoals}
            onChange={(e) => setTomorrowGoals(e.target.value)}
            placeholder="Top 3 goals for tomorrow..."
            rows={2}
            className="w-full bg-zinc-950/40 border border-white/5 rounded-xl p-3 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-blue-500/30 resize-none"
          />
        </div>

        {/* Tag Pill Editor */}
        <div className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-400 mb-2">
              <Tag className="w-4 h-4" />
              <span>Entry Tags</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-3">
              {tags.map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center space-x-1 bg-purple-500/15 border border-purple-500/30 text-purple-300 text-[11px] px-2 py-0.5 rounded-lg"
                >
                  <span>#{t}</span>
                  <button onClick={() => removeTag(t)} className="hover:text-white cursor-pointer">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
              placeholder="Add tag..."
              className="w-full bg-zinc-900 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-purple-500/40"
            />
            <button
              onClick={addTag}
              className="p-1.5 bg-purple-600/30 text-purple-300 rounded-xl border border-purple-500/30 hover:bg-purple-600 hover:text-white transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

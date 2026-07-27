import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Sparkles, AlertTriangle, TrendingUp, Lightbulb, CheckCircle, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAIStore } from '../../store/aiStore';

export const CoachView: React.FC = () => {
  const {
    currentReview,
    messages,
    generateReview,
    askCoach,
    isGeneratingReview,
    isAskingCoach
  } = useAIStore();

  const [question, setQuestion] = useState('');
  const [reviewType, setReviewType] = useState('weekly_review');

  const presetQuestions = [
    "Why haven't I been productive?",
    "What should I improve?",
    "When am I most productive?",
    "What are my biggest distractions?",
    "What goals am I neglecting?",
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!question.trim()) return;
    const q = question;
    setQuestion('');
    await askCoach(q);
  };

  const handlePresetClick = (q: string) => {
    setQuestion(q);
    askCoach(q);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Review Generator Toolbar */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-white flex items-center space-x-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <span>AI Personal Operating Coach</span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated review generator & diagnostic coach powered by modular AI providers.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <select
              value={reviewType}
              onChange={(e) => setReviewType(e.target.value)}
              className="bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-purple-500/50"
            >
              <option value="daily_summary">Daily Summary</option>
              <option value="weekly_review">Weekly Review</option>
              <option value="monthly_review">Monthly Executive Review</option>
            </select>

            <button
              onClick={() => generateReview(reviewType)}
              disabled={isGeneratingReview}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-purple-600/25 flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGeneratingReview ? 'Analyzing...' : 'Generate Review'}</span>
            </button>
          </div>
        </div>

        {/* Display Generated Review Card if available */}
        {currentReview && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-4 mt-4"
          >
            <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
              <span className="text-xs font-semibold uppercase font-mono text-purple-300">
                {currentReview.review_type.replace('_', ' ')} ({currentReview.period_start} → {currentReview.period_end})
              </span>
            </div>

            <div className="prose prose-invert max-w-none text-xs leading-relaxed text-zinc-200">
              <ReactMarkdown>{currentReview.summary_markdown}</ReactMarkdown>
            </div>

            {currentReview.action_items && (
              <div className="border-t border-purple-500/20 pt-3">
                <p className="text-xs font-semibold text-purple-300 mb-2">Recommended Operating Action Items:</p>
                <ul className="space-y-1">
                  {currentReview.action_items.map((item, i) => (
                    <li key={i} className="flex items-center space-x-2 text-xs text-zinc-300">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* Preset Diagnostic Questions Quick Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-white/10 space-y-2">
        <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider block">
          Diagnostic Questions
        </span>
        <div className="flex flex-wrap gap-2">
          {presetQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handlePresetClick(q)}
              className="text-xs bg-zinc-900/80 hover:bg-zinc-800 border border-white/10 hover:border-purple-500/40 text-zinc-300 hover:text-white px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <HelpCircle className="w-3 h-3 text-purple-400" />
              <span>{q}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Coach Chat Window */}
      <div className="glass-panel rounded-2xl border border-white/10 flex flex-col h-[400px]">
        {/* Messages Feed */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 text-xs">
              <Bot className="w-8 h-8 text-zinc-600 mb-2" />
              <p>Ask Compass AI Coach diagnostic questions about your habit trends, coding frequency, or distractions.</p>
            </div>
          ) : (
            messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none shadow-md'
                      : 'bg-zinc-900 border border-white/10 text-zinc-200 rounded-bl-none'
                  }`}
                >
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                </div>
              </div>
            ))
          )}
          {isAskingCoach && (
            <div className="flex justify-start">
              <div className="bg-zinc-900 border border-white/10 p-3 rounded-2xl text-xs text-zinc-400 animate-pulse">
                Compass AI Coach is analyzing operating data...
              </div>
            </div>
          )}
        </div>

        {/* Input Controls */}
        <form onSubmit={handleSend} className="p-4 border-t border-white/10 flex items-center space-x-2">
          <input
            type="text"
            placeholder="Ask your AI coach anything about your operating system..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-purple-500/50"
          />
          <button
            type="submit"
            disabled={isAskingCoach}
            className="p-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

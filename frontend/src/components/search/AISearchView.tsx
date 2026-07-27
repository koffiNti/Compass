import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Sparkles, BookOpen, Archive, FolderGit2, Calendar, ArrowRight } from 'lucide-react';
import { useAIStore } from '../../store/aiStore';

export const AISearchView: React.FC = () => {
  const { searchResults, isSearching, universalSearch, clearSearch } = useAIStore();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      universalSearch(query);
    } else {
      clearSearch();
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Journal': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'Knowledge Vault': return <Archive className="w-4 h-4 text-purple-400" />;
      case 'Projects': return <FolderGit2 className="w-4 h-4 text-emerald-400" />;
      default: return <Sparkles className="w-4 h-4 text-zinc-400" />;
    }
  };

  const exampleQueries = [
    "What was I doing in March?",
    "When did I last work on my Python project?",
    "Show every journal entry where I mentioned procrastination.",
    "Lecture attendance",
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Universal Search Header & Input */}
      <div className="glass-panel p-8 rounded-2xl border border-white/10 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            <span>AI Universal Operating Search</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Query across your entire second brain — daily journals, knowledge vault, software projects, and metrics.
          </p>
        </div>

        {/* Search Bar Input */}
        <form onSubmit={handleSearch} className="flex items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-3.5 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Ask a natural language question e.g. 'Show entries mentioning procrastination'..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) clearSearch();
              }}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50 transition-all font-sans"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-blue-600/25 cursor-pointer transition-all"
          >
            {isSearching ? 'Searching OS...' : 'Search Operating System'}
          </button>
        </form>

        {/* Example Queries */}
        <div className="flex flex-wrap gap-2 pt-2">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider block self-center">
            Examples:
          </span>
          {exampleQueries.map((eq) => (
            <button
              key={eq}
              onClick={() => {
                setQuery(eq);
                universalSearch(eq);
              }}
              className="text-xs bg-zinc-900 hover:bg-zinc-800 border border-white/5 text-zinc-400 hover:text-zinc-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
            >
              {eq}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 px-1">
            <span>Found {searchResults.length} matching operating records</span>
          </div>

          <div className="space-y-3">
            {searchResults.map((m, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 rounded-2xl border border-white/10 flex items-start justify-between gap-4"
              >
                <div className="flex items-start space-x-3.5">
                  <div className="p-2.5 rounded-xl bg-zinc-900 border border-white/5 shrink-0 mt-0.5">
                    {getCategoryIcon(m.category)}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                        {m.category}
                      </span>
                      {m.date && <span className="text-[11px] font-mono text-zinc-500">{m.date}</span>}
                    </div>

                    <h4 className="text-sm font-semibold text-white mb-1">{m.title}</h4>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">{m.excerpt}</p>
                  </div>
                </div>

                <div className="shrink-0 self-center">
                  <ArrowRight className="w-4 h-4 text-zinc-600 hover:text-white transition-colors cursor-pointer" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        query.trim() && !isSearching && (
          <div className="glass-panel p-12 text-center text-zinc-500 text-xs rounded-2xl">
            No matching operating records found for "{query}".
          </div>
        )
      )}
    </div>
  );
};

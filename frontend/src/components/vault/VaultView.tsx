import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Archive, Search, Plus, Sparkles, BookOpen, ExternalLink, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useVaultStore } from '../../store/vaultStore';

export const VaultView: React.FC = () => {
  const { items, searchResults, isSearching, fetchItems, createItem, searchVault, clearSearch } = useVaultStore();

  const [query, setQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('article');
  const [content, setContent] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      searchVault(query);
    } else {
      clearSearch();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    const tags = tagInput.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
    await createItem({
      title,
      item_type: type as any,
      content_markdown: content,
      source_url: sourceUrl,
      tags,
    });
    setTitle('');
    setContent('');
    setSourceUrl('');
    setTagInput('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header & Semantic RAG Search Box */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Knowledge Vault & RAG Search</h2>
            <p className="text-xs text-zinc-400">Store articles, ideas, lecture notes, and bookmarks with automatic vector embeddings.</p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-2 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        {/* Semantic Search Input */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Ask or search semantically e.g. 'vector similarity search python'..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!e.target.value.trim()) clearSearch();
              }}
              className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-xl cursor-pointer"
          >
            {isSearching ? 'Searching...' : 'Vector Search'}
          </button>
        </form>
      </div>

      {/* Search Results vs All Vault Items */}
      {searchResults.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-400">
            <Sparkles className="w-4 h-4" />
            <span>RAG Vector Search Matches</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.map((res, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 rounded-2xl border border-blue-500/30 bg-blue-950/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                    {res.item.item_type}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-bold">
                    {(res.similarity_score * 100).toFixed(1)}% match
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white mb-2">{res.item.title}</h3>
                <p className="text-xs text-zinc-300 font-mono bg-zinc-900/80 p-3 rounded-xl border border-white/5 leading-relaxed mb-3">
                  "{res.matched_chunk}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.length === 0 ? (
            <div className="col-span-2 glass-panel p-12 text-center text-zinc-500 text-xs rounded-2xl">
              Knowledge vault is empty. Click "Add Item" to store notes or articles.
            </div>
          ) : (
            items.map((i) => (
              <motion.div
                key={i.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-5 rounded-2xl border border-white/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded">
                      {i.item_type}
                    </span>
                    {i.source_url && (
                      <a
                        href={i.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-white mb-2">{i.title}</h3>
                  {i.content_markdown && (
                    <div className="prose prose-invert text-xs line-clamp-3 text-zinc-400 mb-3">
                      <ReactMarkdown>{i.content_markdown}</ReactMarkdown>
                    </div>
                  )}
                </div>

                {i.tags && i.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 border-t border-white/5 pt-3">
                    {i.tags.map((t) => (
                      <span key={t} className="text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">
                        #{t}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Add Vault Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel p-6 rounded-2xl border border-white/10">
            <h3 className="text-base font-semibold text-white mb-4">Add Knowledge Vault Item</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Attention is All You Need Paper Summary"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                >
                  <option value="article">Article</option>
                  <option value="idea">Idea</option>
                  <option value="lecture_note">Lecture Note</option>
                  <option value="bookmark">Bookmark</option>
                  <option value="document">Document</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Source URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://arxiv.org/abs/..."
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2 px-3 text-xs text-zinc-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Content Markdown</label>
                <textarea
                  rows={4}
                  placeholder="Paste markdown content... Text will be chunked & indexed for semantic search."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2.5 text-xs text-zinc-100 focus:outline-none focus:border-blue-500 resize-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Tags (comma separated)</label>
                <input
                  type="text"
                  placeholder="ai, transformers, paper, lecture"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
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
                  Save & Index Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

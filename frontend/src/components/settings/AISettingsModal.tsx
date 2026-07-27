import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Key, Server, Cpu, CheckCircle2, AlertCircle, X, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

interface AISettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({ isOpen, onClose }) => {
  const { user, updatePreferences, testAIKey } = useAuthStore();

  const [provider, setProvider] = useState('openai');
  const [model, setModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [customBaseUrl, setCustomBaseUrl] = useState('');

  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: string; message: string } | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user?.preferences) {
      setProvider(user.preferences.ai_provider || 'openai');
      setModel(user.preferences.ai_model || 'gpt-4o');
      setApiKey(user.preferences.api_key || '');
      setCustomBaseUrl(user.preferences.custom_base_url || '');
    }
  }, [user]);

  const providerModels: Record<string, string[]> = {
    openai: ['gpt-4o', 'gpt-4o-mini', 'o1-preview', 'o3-mini'],
    anthropic: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    gemini: ['gemini-1.5-pro', 'gemini-1.5-flash', 'gemini-2.0-flash'],
    openrouter: ['deepseek/deepseek-r1', 'meta-llama/llama-3.3-70b-instruct', 'anthropic/claude-3.5-sonnet'],
    local: ['llama3', 'deepseek-r1', 'mistral', 'qwen2.5-coder'],
  };

  const handleProviderChange = (newProv: string) => {
    setProvider(newProv);
    const defaults = providerModels[newProv];
    if (defaults && defaults.length > 0) {
      setModel(defaults[0]);
    }
  };

  const handleTestKey = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testAIKey(provider, model, apiKey, customBaseUrl);
      setTestResult({
        status: 'success',
        message: `Connected successfully to ${provider.toUpperCase()} (${model})! Response: "${res.response_preview}"`,
      });
    } catch (err: any) {
      setTestResult({
        status: 'error',
        message: err.response?.data?.detail || 'Failed to connect. Check API key or URL.',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updatePreferences({
      ai_provider: provider,
      ai_model: model,
      api_key: apiKey,
      custom_base_url: customBaseUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-lg glass-panel p-6 rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">AI Engine & Custom API Keys</h3>
                <p className="text-xs text-zinc-400">Bring your own API key or local LLM endpoint.</p>
              </div>
            </div>
            <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            {/* Provider Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">AI Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'openai', label: 'OpenAI' },
                  { id: 'anthropic', label: 'Anthropic' },
                  { id: 'gemini', label: 'Gemini' },
                  { id: 'openrouter', label: 'OpenRouter' },
                  { id: 'local', label: 'Local / Ollama' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleProviderChange(p.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                      provider === p.id
                        ? 'bg-purple-600/20 border-purple-500/50 text-purple-300 shadow-md'
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model Selector */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">AI Model</label>
              <div className="relative">
                <Cpu className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="e.g. gpt-4o, claude-3-5-sonnet-20241022, deepseek/deepseek-r1"
                  className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500/50"
                />
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {(providerModels[provider] || []).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setModel(m)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800/60 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-white/5 cursor-pointer"
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* API Key Input */}
            {provider !== 'local' && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Personal API Key
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder={
                      provider === 'openai'
                        ? 'sk-...'
                        : provider === 'anthropic'
                        ? 'sk-ant-...'
                        : provider === 'gemini'
                        ? 'AIzaSy...'
                        : 'sk-or-v1-...'
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
                <p className="text-[10px] text-zinc-500 mt-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Keys are stored encrypted per account and used exclusively for your requests.</span>
                </p>
              </div>
            )}

            {/* Custom Base URL (For Local or Custom Endpoints) */}
            {(provider === 'local' || provider === 'openrouter') && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Custom Base Endpoint URL
                </label>
                <div className="relative">
                  <Server className="absolute left-3 top-3 w-4 h-4 text-zinc-500" />
                  <input
                    type="url"
                    value={customBaseUrl}
                    onChange={(e) => setCustomBaseUrl(e.target.value)}
                    placeholder={
                      provider === 'local'
                        ? 'http://localhost:11434'
                        : 'https://openrouter.ai/api/v1'
                    }
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-xs font-mono text-zinc-100 focus:outline-none focus:border-purple-500/50"
                  />
                </div>
              </div>
            )}

            {/* Test Connection Output */}
            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs font-medium border flex items-start space-x-2 ${
                  testResult.status === 'success'
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                {testResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={testing}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium rounded-xl border border-white/10 cursor-pointer disabled:opacity-50"
              >
                {testing ? 'Testing Ping...' : 'Test Key Connection'}
              </button>

              <button
                type="submit"
                className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-xl shadow-lg shadow-purple-600/25 cursor-pointer"
              >
                {savedSuccess ? 'Saved Preferences!' : 'Save AI Configuration'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

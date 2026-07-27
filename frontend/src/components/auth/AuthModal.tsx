import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Compass, KeyRound, Mail, User, ArrowRight, Shield, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export const AuthModal: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [clientError, setClientError] = useState<string | null>(null);

  const { login, register, isLoading, error, clearError } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);
    clearError();

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setClientError('Please enter a valid email address (e.g. user@domain.com).');
      return;
    }

    if (password.length < 6) {
      setClientError('Password must be at least 6 characters long.');
      return;
    }

    if (!isLogin && !fullName.trim()) {
      setClientError('Please enter your full name.');
      return;
    }

    if (isLogin) {
      await login(cleanEmail, password);
    } else {
      await register(cleanEmail, password, fullName.trim());
    }
  };

  const toggleMode = () => {
    setClientError(null);
    clearError();
    setIsLogin(!isLogin);
  };

  const activeError = clientError || error;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md glass-panel rounded-2xl p-8 border border-white/10 shadow-2xl relative overflow-hidden"
      >
        {/* Subtle Ambient Light Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <Compass className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-white font-sans">
            Compass
          </h1>
          <p className="text-xs text-zinc-400 mt-1 font-medium tracking-wide uppercase">
            AI Personal Operating System
          </p>
        </div>

        {activeError && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start space-x-2 font-medium"
          >
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{activeError}</span>
          </motion.div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Steve Jobs"
                  className="w-full bg-zinc-900/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative">
              <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-zinc-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900/80 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-sm py-2.5 px-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50 cursor-pointer"
          >
            <span>{isLoading ? 'Authenticating...' : isLogin ? 'Sign In' : 'Create System Account'}</span>
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="mt-6 text-center border-t border-white/5 pt-4">
          <button
            onClick={toggleMode}
            className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer font-medium"
          >
            {isLogin ? (
              <span>
                Don't have an operating system account?{' '}
                <span className="text-blue-400 underline underline-offset-4">Sign Up</span>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <span className="text-blue-400 underline underline-offset-4">Sign In</span>
              </span>
            )}
          </button>
        </div>

        <div className="mt-4 flex items-center justify-center space-x-1.5 text-[11px] text-zinc-600">
          <Shield className="w-3 h-3 text-zinc-500" />
          <span>Encrypted Local & Cloud Identity</span>
        </div>
      </motion.div>
    </div>
  );
};

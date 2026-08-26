import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLogin: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, isLoading = false, error }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(email, password);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#08090E] via-[#0B0D17] to-[#0c0d1a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-purple-800 via-violet-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-600/30">
              <div className="w-full h-full bg-[#08090E] rounded-[10px] flex items-center justify-center">
                <span className="text-2xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                  F
                </span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-extrabold tracking-widest text-white uppercase font-mono">
                FORBIDEN
              </span>
              <span className="text-xs text-purple-300 font-mono">Admin Portal</span>
            </div>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-[#0B0D17]/80 border border-purple-950/40 rounded-2xl backdrop-blur-xl p-8 shadow-2xl shadow-purple-900/20">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            Welcome Back
          </h1>
          <p className="text-slate-400 text-center mb-8 text-sm">
            Sign in to your admin account
          </p>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
              <div className="w-1 h-1 rounded-full bg-red-400 mt-2 flex-shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="yanfortej@gmail.com"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-slate-950/50 border border-purple-950/30 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-slate-950/50 border border-purple-950/30 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500/60 focus:ring-1 focus:ring-purple-500/30 transition-all"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-4.803m5.596-3.856a3.375 3.375 0 11-4.753 4.753m4.753-4.753L9.172 9.172m5.656 5.656l1.418 1.418m0-7.071L9.172 9.172" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded bg-slate-950 border border-purple-950/30 cursor-pointer accent-purple-600"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-slate-400 cursor-pointer hover:text-slate-300">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="w-full py-3 mt-6 rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 hover:shadow-purple-600/40 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>



          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex gap-4 text-xs text-slate-500 justify-center">
            <button className="hover:text-purple-400 transition-colors">Forgot Password?</button>
            <span>•</span>
            <button className="hover:text-purple-400 transition-colors">Support</button>
          </div>
        </div>

        {/* Back to Store Link */}
        <div className="mt-6 text-center">
          <a href="#home" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-purple-400 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Store
          </a>
        </div>
      </div>
    </div>
  );
};

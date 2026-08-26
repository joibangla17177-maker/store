import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Monitor, ArrowRight, CornerDownLeft } from 'lucide-react';
import { AppItem } from '../types';
import { AppIcon } from './AppIcon';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApp: (app: AppItem) => void;
  apps: AppItem[];
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectApp,
  apps,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredApps = query.trim()
    ? apps.filter((app) => {
        const q = query.toLowerCase();
        return (
          app.name.toLowerCase().includes(q) ||
          app.category.toLowerCase().includes(q) ||
          app.shortDescription.toLowerCase().includes(q) ||
          app.features.some((f) => f.toLowerCase().includes(q))
        );
      })
    : apps.slice(0, 5);

  return (
    <div
      id="search-modal-overlay"
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in"
      onClick={onClose}
    >
      <div
        id="search-modal-content"
        className="w-full max-w-2xl rounded-2xl border border-purple-500/20 bg-[#0E101B] shadow-2xl shadow-purple-950/60 overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center px-4 py-3.5 border-b border-purple-950/40 bg-[#121422]">
          <Search size={20} className="text-purple-400 mr-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications by name, category, or features (e.g. Business Analyzer, Reports)..."
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white mr-2"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-[#090A10] border border-slate-700/50 rounded">
            ESC
          </kbd>
        </div>

        {/* Results section */}
        <div className="max-h-[60vh] overflow-y-auto p-3 space-y-1">
          <div className="px-3 py-1.5 text-[11px] font-semibold tracking-wider text-purple-400 uppercase">
            {query.trim() ? `Found ${filteredApps.length} Results` : 'Suggested Applications'}
          </div>

          {filteredApps.length === 0 ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No applications matching &quot;{query}&quot;
            </div>
          ) : (
            filteredApps.map((app) => (
              <div
                key={app.id}
                onClick={() => {
                  onSelectApp(app);
                  onClose();
                }}
                className="group flex items-center justify-between p-3 rounded-xl hover:bg-[#161828] border border-transparent hover:border-purple-500/20 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <AppIcon type={app.iconType} size="sm" />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                        {app.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-950/60 text-purple-300 border border-purple-800/30">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {app.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 pl-3 flex-shrink-0">
                  <span className="text-xs font-semibold text-white">
                    ${app.price.toFixed(2)}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-[#1b1e32] flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-purple-600 transition-all">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#090A10] border-t border-purple-950/40 flex items-center justify-between text-[11px] text-slate-500">
          <span>Press ↵ to select or ESC to exit</span>
          <span className="text-purple-400">FORBIDEN Software Catalog</span>
        </div>
      </div>
    </div>
  );
};

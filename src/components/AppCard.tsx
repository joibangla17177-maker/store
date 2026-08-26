import React from 'react';
import { Download, Monitor } from 'lucide-react';
import { motion } from 'motion/react';
import { AppItem } from '../types';
import { AppIcon } from './AppIcon';

interface AppCardProps {
  app: AppItem;
  onSelect: (app: AppItem) => void;
  onDownload: (app: AppItem, e: React.MouseEvent) => void;
  compact?: boolean;
  index?: number;
}

export const AppCard: React.FC<AppCardProps> = ({
  app,
  onSelect,
  onDownload,
  compact = false,
  index = 0,
}) => {
  return (
    <motion.div
      id={`app-card-${app.slug}`}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.015 }}
      whileTap={{ scale: 0.98 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.08, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      onClick={() => onSelect(app)}
      className="group relative flex flex-col justify-between rounded-2xl border border-purple-500/15 bg-[#121422]/90 hover:bg-[#16192c] p-6 transition-colors duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-950/50 cursor-pointer backdrop-blur-sm overflow-hidden"
    >
      {/* Background slide ambient glow on hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10">
        {/* Top: Icon & Title Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="transform group-hover:scale-105 transition-transform duration-300">
            <AppIcon type={app.iconType} iconUrl={app.iconUrl} size={compact ? 'md' : 'xl'} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-purple-300 transition-colors truncate">
              {app.name}
            </h3>
            <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
              {app.shortDescription}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom: Price, Platform Badge, and Download Button */}
      <div className="relative z-10 mt-4 pt-4 border-t border-purple-900/30 flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-lg font-extrabold text-white">
            ${app.price.toFixed(2)}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-[#1a1d2e] text-slate-300 border border-slate-700/50">
              <Monitor size={11} className="text-purple-400" />
              {app.platforms[0] || 'Windows'}
            </span>
          </div>
        </div>

        <motion.button
          id={`download-btn-${app.slug}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => onDownload(app, e)}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white bg-[#6D28D9] hover:bg-[#7C3AED] active:bg-[#5B21B6] transition-colors shadow-md shadow-purple-900/40 hover:shadow-purple-700/50 cursor-pointer"
        >
          <Download size={14} />
          <span>Download</span>
        </motion.button>
      </div>
    </motion.div>
  );
};

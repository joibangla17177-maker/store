import React, { useState } from 'react';
import {
  Download,
  Monitor,
  Check,
  HardDrive,
  Cpu,
  Database,
  ShieldCheck,
  FileCode,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Layers,
  Info
} from 'lucide-react';
import { AppItem, PlatformType } from '../types';
import { AppIcon } from './AppIcon';
import { ScreenshotLightbox } from './ScreenshotLightbox';

interface AppDetailsProps {
  app: AppItem;
  onBackToApps: () => void;
  onDownload: (app: AppItem, platform?: PlatformType) => void;
}

export const AppDetails: React.FC<AppDetailsProps> = ({
  app,
  onBackToApps,
  onDownload,
}) => {
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number>(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'security' | 'changelog'>('overview');

  const screenshots = app.screenshots && app.screenshots.length > 0
    ? app.screenshots
    : [
        '/src/assets/images/business_analyzer_ui_1787508248602.jpg',
        '/src/assets/images/business_analyzer_ui2_1787508264073.jpg',
      ];

  return (
    <div id={`app-details-${app.slug}`} className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 space-y-12">
      {/* 1. Breadcrumbs matching Screenshot 3 */}
      <nav id="breadcrumbs" className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
        <button
          onClick={onBackToApps}
          className="hover:text-purple-300 transition-colors"
        >
          Apps
        </button>
        <ChevronRight size={14} className="text-slate-600" />
        <span className="text-white font-medium truncate">{app.name}</span>
      </nav>

      {/* 2. Main 2-Column Hero & Details Section matching Screenshot 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Big Glowing Icon & Vertical Screenshot Thumbnails matching Screenshot 3 */}
        <div className="lg:col-span-5 space-y-6">
          {/* Big App Icon Squircle */}
          <div className="relative rounded-3xl border border-purple-500/20 bg-[#121424]/90 p-4 flex items-center justify-center shadow-2xl shadow-purple-950/40 min-h-[300px]">
            <AppIcon type={app.iconType} iconUrl={app.iconUrl} size="xxl" glow={true} />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-600/10 to-transparent rounded-3xl pointer-events-none" />
          </div>

          {/* Vertical Stack of Screenshot Thumbnails matching Screenshot 3 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
              <span>Application Screenshots ({screenshots.length})</span>
              <span className="text-purple-400 text-[11px]">Click to expand</span>
            </div>

            <div className="space-y-3">
              {screenshots.map((imgSrc, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedScreenshotIndex(index);
                    setIsLightboxOpen(true);
                  }}
                  className={`group relative rounded-2xl overflow-hidden border cursor-pointer transition-all duration-300 shadow-md ${
                    selectedScreenshotIndex === index
                      ? 'border-purple-500 ring-2 ring-purple-500/30'
                      : 'border-purple-900/30 hover:border-purple-500/50'
                  }`}
                >
                  <img
                    src={imgSrc}
                    alt={`${app.name} Screen ${index + 1}`}
                    className="w-full h-28 sm:h-36 object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-xs font-semibold text-white">
                      View Screenshot {index + 1}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Title, Badges, Price, Big Download Button, Features, Requirements matching Screenshot 3 */}
        <div className="lg:col-span-7 space-y-8">
          {/* Header info */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {app.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#1a1d2e] text-slate-200 border border-slate-700/60 shadow-sm">
                <Monitor size={13} className="text-purple-400" />
                {app.platforms[0] || 'Windows'}
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-400">
              Version {app.currentVersion} <span className="mx-2 text-slate-600">|</span> Released: {app.releaseDate}
            </p>
          </div>

          {/* Large Price matching Screenshot 3 */}
          <div>
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              ${app.price.toFixed(2)}
            </span>
          </div>

          {/* Description matching Screenshot 3 */}
          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            {app.fullDescription}
          </p>

          {/* Large Download Button & Google Drive Trust Text matching Screenshot 3 */}
          <div className="space-y-3 pt-2">
            <button
              id={`download-now-btn-${app.slug}`}
              onClick={() => onDownload(app, 'Windows')}
              className="w-full sm:w-auto min-w-[280px] inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-white text-base bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-900/50 hover:shadow-purple-600/50 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Download size={20} strokeWidth={2.5} />
              <span>Download Now</span>
            </button>

            <div className="flex items-center gap-2 text-xs text-slate-400 pt-1">
              <Clock size={14} className="text-purple-400 flex-shrink-0" />
              <span>Secure download from Google Drive</span>
            </div>
          </div>

          {/* Key Features (2-Column Checkmark Grid matching Screenshot 3) */}
          <div className="space-y-4 pt-4 border-t border-purple-950/40">
            <h3 className="text-lg font-bold text-white tracking-tight">
              Key Features
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {app.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-purple-950/80 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                    <Check size={12} strokeWidth={3} />
                  </div>
                  <span className="text-xs sm:text-sm text-slate-200 font-medium">
                    {feat}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* System Requirements (Horizontal Spec Cards matching Screenshot 3) */}
          <div className="space-y-4 pt-4 border-t border-purple-950/40">
            <h3 className="text-lg font-bold text-white tracking-tight">
              System Requirements
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              {/* OS card */}
              <div className="p-3.5 rounded-xl bg-[#121422]/90 border border-purple-900/30 flex items-start gap-3">
                <Monitor size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Platform</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {app.systemRequirements.os}
                  </span>
                </div>
              </div>

              {/* Memory card */}
              <div className="p-3.5 rounded-xl bg-[#121422]/90 border border-purple-900/30 flex items-start gap-3">
                <Cpu size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Memory</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {app.systemRequirements.memory}
                  </span>
                </div>
              </div>

              {/* Storage card */}
              <div className="p-3.5 rounded-xl bg-[#121422]/90 border border-purple-900/30 flex items-start gap-3">
                <HardDrive size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">Storage</span>
                  <span className="text-xs font-bold text-white block mt-0.5">
                    {app.systemRequirements.storage}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Deep Dive Info Tabs: Data Sovereignty, Detailed Capabilities & Verification */}
      <div className="pt-8 border-t border-purple-950/40 space-y-6">
        <div className="flex border-b border-purple-950/40 gap-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Data Sovereignty Guarantee
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'features'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Detailed Architecture
          </button>
          <button
            onClick={() => setActiveTab('changelog')}
            className={`pb-3 text-sm font-semibold transition-colors ${
              activeTab === 'changelog'
                ? 'text-white border-b-2 border-purple-500'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Release Notes
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="rounded-2xl bg-[#121422]/80 border border-purple-900/30 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 text-purple-300 font-semibold text-sm">
              <ShieldCheck size={18} className="text-purple-400" />
              <span>Zero-Cloud Local Operation Contract</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              {app.guaranteeText ||
                'FORBIDEN Guarantee: All applications execute strictly locally on your computer. Your files, sensitive transactions, credentials, and records are never transmitted, analyzed, or stored in remote cloud databases.'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs text-slate-400">
              <div className="p-3.5 rounded-xl bg-[#090a12] border border-purple-950/50">
                <span className="font-semibold text-white block mb-1">Local Storage Only</span>
                Your database is stored in an encrypted SQLite / local file directly on your NVMe/SSD.
              </div>
              <div className="p-3.5 rounded-xl bg-[#090a12] border border-purple-950/50">
                <span className="font-semibold text-white block mb-1">No Periodic Phone-Home</span>
                Operates seamlessly even when totally disconnected from the internet.
              </div>
            </div>
          </div>
        )}

        {activeTab === 'features' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(app.detailedFeatures || []).map((df) => (
              <div
                key={df.id}
                className="p-5 rounded-2xl bg-[#121422]/80 border border-purple-900/30 space-y-2"
              >
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  {df.name}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {df.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'changelog' && (
          <div className="rounded-2xl bg-[#121422]/80 border border-purple-900/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-white">
                Version {app.currentVersion} — Initial Public Release
              </h4>
              <span className="text-xs text-slate-400">{app.releaseDate}</span>
            </div>
            <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
              <li>High-speed optimized desktop runtime for 64-bit Windows architectures.</li>
              <li>Fully self-contained embedded engine with zero external framework dependencies.</li>
              <li>Cryptographic verification and SHA-256 installer package integrity seal.</li>
            </ul>
          </div>
        )}
      </div>

      {/* Lightbox Component */}
      <ScreenshotLightbox
        images={screenshots}
        currentIndex={selectedScreenshotIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onIndexChange={setSelectedScreenshotIndex}
        title={app.name}
      />
    </div>
  );
};

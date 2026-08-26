import React, { useState } from 'react';
import { ArrowRight, ChevronRight, ChevronLeft, ShieldCheck, HardDrive, Cpu, Zap, Star, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppItem, Category } from '../types';
import { DronePortalScrollHero } from './DronePortalScrollHero';
import { AppCard } from './AppCard';
import { AppIcon } from './AppIcon';
import { AnimatedButton } from './AnimatedButton';

interface HomePageProps {
  featuredApps: AppItem[];
  recentApps: AppItem[];
  popularApps: AppItem[];
  categories: Category[];
  onSelectApp: (app: AppItem) => void;
  onDownloadApp: (app: AppItem, e: React.MouseEvent) => void;
  onNavigate: (tab: string, slug?: string) => void;
  onSelectCategory: (categorySlug: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  featuredApps,
  recentApps,
  popularApps,
  categories,
  onSelectApp,
  onDownloadApp,
  onNavigate,
  onSelectCategory,
}) => {
  const [featuredSlideIndex, setFeaturedSlideIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState<'left' | 'right'>('right');

  // Slide items per page: 3
  const itemsPerSlide = 3;
  const totalFeaturedSlides = Math.ceil(featuredApps.length / itemsPerSlide) || 1;

  const handlePrevSlide = () => {
    setSlideDirection('left');
    setFeaturedSlideIndex((prev) => (prev === 0 ? totalFeaturedSlides - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setSlideDirection('right');
    setFeaturedSlideIndex((prev) => (prev === totalFeaturedSlides - 1 ? 0 : prev + 1));
  };

  const currentFeaturedBatch = featuredApps.slice(
    featuredSlideIndex * itemsPerSlide,
    (featuredSlideIndex + 1) * itemsPerSlide
  );

  return (
    <div id="home-page" className="w-full space-y-16 pb-20">
      {/* 1. Cinematic Drone Portal Scroll Experience matching the 4 Frames */}
      <DronePortalScrollHero
        onExploreApps={() => onNavigate('apps')}
        onLearnMore={() => onNavigate('features')}
      />

      <div id="featured-apps-container" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 pt-8">
        {/* 2. Featured Applications Section with Interactive Slide Carousel */}
        <section id="featured-applications" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-2xl font-extrabold text-white tracking-tight">
                  Featured Applications
                </h2>
                {totalFeaturedSlides > 1 && (
                  <div className="flex items-center gap-1.5 bg-[#121422] border border-purple-900/40 rounded-full px-2.5 py-1 text-[11px] font-bold text-purple-400">
                    <span>{featuredSlideIndex + 1}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-slate-400">{totalFeaturedSlides}</span>
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Explore the latest high-performance software from FORBIDEN.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Slide Navigation Controls */}
              {totalFeaturedSlides > 1 && (
                <div className="flex items-center gap-1.5 bg-[#121422]/90 border border-purple-900/30 rounded-xl p-1 shadow-inner">
                  <button
                    id="featured-slide-prev-btn"
                    onClick={handlePrevSlide}
                    aria-label="Previous Featured Apps"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-950/60 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    id="featured-slide-next-btn"
                    onClick={handleNextSlide}
                    aria-label="Next Featured Apps"
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-950/60 transition-colors cursor-pointer"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              <AnimatedButton
                id="featured-explore-all-btn"
                onClick={() => onNavigate('apps')}
                className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/40 hover:border-purple-500/40 [--shine:rgba(192,132,252,0.7)] cursor-pointer"
              >
                <span className="flex items-center gap-1.5">
                  <span>Explore All</span>
                  <ChevronRight size={14} />
                </span>
              </AnimatedButton>
            </div>
          </div>

          {/* 3-column Featured Apps Grid with Smooth Slide Transition */}
          <div className="relative overflow-hidden min-h-[220px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={featuredSlideIndex}
                initial={{
                  opacity: 0,
                  x: slideDirection === 'right' ? 60 : -60,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                exit={{
                  opacity: 0,
                  x: slideDirection === 'right' ? -60 : 60,
                }}
                transition={{
                  duration: 0.35,
                  ease: [0.25, 1, 0.5, 1],
                }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {(currentFeaturedBatch.length > 0 ? currentFeaturedBatch : featuredApps.slice(0, 3)).map((app, idx) => (
                  <AppCard
                    key={app.id}
                    app={app}
                    index={idx}
                    onSelect={onSelectApp}
                    onDownload={onDownloadApp}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slide Indicator Dots */}
          {totalFeaturedSlides > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-2">
              {Array.from({ length: totalFeaturedSlides }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setSlideDirection(i > featuredSlideIndex ? 'right' : 'left');
                    setFeaturedSlideIndex(i);
                  }}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    i === featuredSlideIndex
                      ? 'w-6 bg-purple-500 shadow-sm shadow-purple-500/50'
                      : 'w-2 bg-slate-800 hover:bg-slate-700'
                  }`}
                  aria-label={`Slide to page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* 3. Recently Added Section with Horizontal Scroll & View All */}
        <section id="recently-added" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Recently Added
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Newly released performance utilities and developer kits.
              </p>
            </div>
            <AnimatedButton
              id="recent-view-all-btn"
              onClick={() => onNavigate('apps')}
              className="inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/40 hover:border-purple-500/40 [--shine:rgba(192,132,252,0.7)] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>View All</span>
                <ArrowRight size={13} />
              </span>
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentApps.slice(0, 3).map((app, idx) => (
              <AppCard
                key={app.id}
                app={app}
                index={idx}
                onSelect={onSelectApp}
                onDownload={onDownloadApp}
              />
            ))}
          </div>
        </section>

        {/* 4. Popular Applications */}
        <section id="popular-applications" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                Popular Applications
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Most downloaded tools trusted by businesses and developers worldwide.
              </p>
            </div>
            <AnimatedButton
              id="popular-browse-btn"
              onClick={() => onNavigate('apps')}
              className="hidden sm:inline-flex px-4 py-2 rounded-xl text-xs font-semibold text-purple-300 bg-purple-950/40 hover:bg-purple-900/40 border border-purple-800/40 hover:border-purple-500/40 [--shine:rgba(192,132,252,0.7)] cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <span>Browse Catalog</span>
                <ChevronRight size={14} />
              </span>
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularApps.slice(0, 6).map((app, idx) => (
              <AppCard
                key={app.id}
                app={app}
                index={idx}
                onSelect={onSelectApp}
                onDownload={onDownloadApp}
              />
            ))}
          </div>
        </section>

        {/* 5. Browse by Category */}
        <section id="categories-section" className="space-y-6 pt-4">
          <div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Find software engineered for your specific operational requirements.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.slug);
                  onNavigate('apps');
                }}
                className="group p-5 rounded-2xl bg-[#121422]/80 hover:bg-[#181a2e] border border-purple-900/20 hover:border-purple-500/40 cursor-pointer transition-all duration-300 flex flex-col items-center text-center space-y-3 shadow-md hover:shadow-purple-950/40"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400 group-hover:scale-110 group-hover:text-purple-300 transition-transform">
                  <Zap size={22} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">
                    {cat.name}
                  </h4>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {cat.appCount} Apps
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Explore Full App Catalog Callout */}
        <section className="rounded-3xl border border-purple-500/30 bg-gradient-to-r from-[#171330] via-[#121424] to-[#1a1033] p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl shadow-purple-950/40">
          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Ready to supercharge your workflow?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Browse our complete catalog of enterprise, productivity, and developer utilities with direct installer downloads.
            </p>
          </div>

          <AnimatedButton
            id="cta-explore-catalog-btn"
            onClick={() => onNavigate('apps')}
            className="px-8 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/50 shadow-xl shadow-purple-900/50 hover:shadow-purple-600/60 cursor-pointer [--shine:rgba(255,255,255,0.85)] flex-shrink-0"
          >
            <span className="flex items-center gap-2">
              <Compass size={18} />
              <span>Explore All Apps</span>
            </span>
          </AnimatedButton>
        </section>

        {/* 7. FORBIDEN Architecture Assurance Card */}
        <section className="rounded-3xl border border-purple-500/20 bg-gradient-to-br from-[#121424] via-[#0E101B] to-[#0A0B14] p-8 sm:p-12 relative overflow-hidden shadow-2xl shadow-purple-950/50">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
              <ShieldCheck size={14} className="text-purple-400" />
              <span>The FORBIDEN Security Model</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Software built for performance. <br />
              Guaranteed absolute privacy.
            </h3>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Unlike modern subscription SaaS platforms that harvest and store your confidential sales, inventory, and customer databases in the cloud, FORBIDEN applications run 100% locally on your machine.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
              <div className="p-4 rounded-xl bg-[#090a12]/80 border border-purple-900/30 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <HardDrive size={15} className="text-purple-400" />
                  Offline-First
                </div>
                <p className="text-slate-400">Zero internet required for daily operations.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090a12]/80 border border-purple-900/30 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck size={15} className="text-purple-400" />
                  Zero Telemetry
                </div>
                <p className="text-slate-400">Your commercial business data remains yours.</p>
              </div>

              <div className="p-4 rounded-xl bg-[#090a12]/80 border border-purple-900/30 space-y-1">
                <div className="font-bold text-white flex items-center gap-1.5">
                  <Cpu size={15} className="text-purple-400" />
                  Low Latency
                </div>
                <p className="text-slate-400">Blazing native speed optimized for modern hardware.</p>
              </div>
            </div>
          </div>

          {/* Background subtle glow */}
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        </section>
      </div>
    </div>
  );
};

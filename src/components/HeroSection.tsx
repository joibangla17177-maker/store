import React from 'react';
import { ArrowRight, Sparkles, Shield, Zap } from 'lucide-react';
import { STORE_SETTINGS } from '../data/initialData';
import SplitText from './SplitText';
import { AnimatedButton } from './AnimatedButton';

interface HeroSectionProps {
  onExploreApps: () => void;
  onLearnMore: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreApps,
  onLearnMore,
}) => {
  return (
    <section
      id="hero-section"
      className="relative w-full min-h-[580px] lg:min-h-[660px] flex items-center overflow-hidden border-b border-purple-950/30"
    >
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0">
        <img
          src={STORE_SETTINGS.heroBgImage}
          alt="FORBIDEN Futuristic Ambient Landscape"
          className="w-full h-full object-cover object-center scale-105 transform opacity-90 transition-transform duration-1000 ease-out"
        />
        {/* Cinematic Gradient Overlays to seamlessly blend with dark UI and text */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090E] via-[#08090E]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08090E] via-transparent to-[#08090E]/60" />
        <div className="absolute inset-0 bg-[#08090E]/20" />
      </div>

      {/* Hero Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
        <div className="max-w-2xl space-y-6">
          {/* Main Headline with SplitText */}
          <div className="space-y-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
              <SplitText
                text="Powering Performance."
                tag="div"
                splitType="chars"
                delay={140}
                duration={3.15}
                from={{ opacity: 0, y: 30 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
                className="text-white block"
              />
              <div className="block mt-1">
                <SplitText
                  text="Securing Innovation."
                  tag="div"
                  splitType="chars"
                  delay={155}
                  duration={3.15}
                  from={{ opacity: 0, y: 30 }}
                  to={{ opacity: 1, y: 0 }}
                  textAlign="left"
                  className="block"
                  charClassName="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-400 to-indigo-300 inline-block font-extrabold"
                />
              </div>
            </h1>
          </div>

          {/* Subtitle with SplitText */}
          <div className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-xl">
            <SplitText
              text="Discover powerful software built by FORBIDEN. Engineered for performance. Designed for the future."
              tag="p"
              splitType="words"
              delay={105}
              duration={2.8}
              from={{ opacity: 0, y: 20 }}
              to={{ opacity: 1, y: 0 }}
              textAlign="left"
              className="text-slate-300"
            />
          </div>

          {/* CTAs matching Screenshot 1 */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <AnimatedButton
              id="hero-explore-apps-btn"
              onClick={onExploreApps}
              className="px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/40 shadow-xl shadow-purple-900/40 hover:shadow-purple-600/50 cursor-pointer [--shine:rgba(255,255,255,0.85)]"
            >
              <span>Explore Apps</span>
            </AnimatedButton>

            <AnimatedButton
              id="hero-learn-more-btn"
              onClick={onLearnMore}
              className="px-7 py-3.5 rounded-xl font-semibold text-slate-200 bg-[#121424]/80 hover:bg-[#1a1d33] border border-purple-900/40 hover:border-purple-500/40 backdrop-blur-md cursor-pointer [--shine:rgba(192,132,252,0.7)] shadow-lg shadow-purple-950/20"
            >
              <span>Learn More</span>
            </AnimatedButton>
          </div>

          {/* Core highlights */}
          <div className="pt-6 flex flex-wrap items-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <Zap size={14} className="text-purple-400" />
              <span>Native Windows & Cross-Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={14} className="text-purple-400" />
              <span>100% Local Data Sovereignty</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

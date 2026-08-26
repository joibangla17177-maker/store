import React from 'react';
import { ShieldCheck, HardDrive, Cpu, Terminal, Users, Sparkles } from 'lucide-react';

interface AboutPageProps {
  onExploreApps: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onExploreApps }) => {
  return (
    <div id="about-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-16">
      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <Sparkles size={14} className="text-purple-400" />
          <span>About FORBIDEN</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Crafting tools that honor your <br />
          <span className="bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Time, Privacy & Autonomy.
          </span>
        </h1>

        <p className="text-base text-slate-300 leading-relaxed">
          FORBIDEN was founded on a simple principle: modern software should empower users with lightning speed and absolute data sovereignty—without locking commercial workflows into closed recurring cloud silos.
        </p>
      </div>

      {/* Grid of values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-[#121422]/80 border border-purple-900/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <HardDrive size={22} />
          </div>
          <h3 className="text-xl font-bold text-white">Zero Telemetry</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            We reject the industry trend of tracking every customer click, sale, and transaction. With Business Analyzer and our entire software suite, your data stays on your drive.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121422]/80 border border-purple-900/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu size={22} />
          </div>
          <h3 className="text-xl font-bold text-white">Native Efficiency</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Every application is engineered with high-efficiency compiler backends, maximizing multicore CPU and GPU pipelines while maintaining a microscopic memory footprint.
          </p>
        </div>

        <div className="p-8 rounded-3xl bg-[#121422]/80 border border-purple-900/20 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <ShieldCheck size={22} />
          </div>
          <h3 className="text-xl font-bold text-white">Private Distribution</h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            Installers are housed in secure private Google Drive cloud vaults and delivered with cryptographic SHA-256 validation sums to guarantee untampered binary integrity.
          </p>
        </div>
      </div>

      {/* Leadership & Engineering Principles */}
      <div className="rounded-3xl border border-purple-900/30 bg-[#121424] p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-bold text-white">Our Engineering Commitment</h2>
        <div className="space-y-4 text-sm text-slate-300 leading-relaxed max-w-4xl">
          <p>
            When you purchase a FORBIDEN application such as Business Analyzer ($29.99) or License Generator ($14.99), you receive a complete, standalone software product. There are no surprise monthly billing statements, no sudden API depreciations, and no remote kill switches.
          </p>
          <p>
            Our applications continue to function perfectly decades from now, even without internet access. This is our ironclad promise to developers, entrepreneurs, and creators worldwide.
          </p>
        </div>
      </div>
    </div>
  );
};

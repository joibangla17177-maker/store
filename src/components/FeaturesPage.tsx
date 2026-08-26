import React from 'react';
import {
  Zap,
  ShieldCheck,
  HardDrive,
  Cpu,
  Lock,
  Terminal,
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';

interface FeaturesPageProps {
  onExploreApps: () => void;
}

export const FeaturesPage: React.FC<FeaturesPageProps> = ({ onExploreApps }) => {
  const pillars = [
    {
      icon: Zap,
      title: 'Engineered for Raw Speed',
      description: 'Zero bloated electron runtimes or heavy cloud network latencies. FORBIDEN applications compile directly into native instruction pipelines with instant sub-second boot times.',
    },
    {
      icon: ShieldCheck,
      title: 'Guaranteed Data Sovereignty',
      description: 'Your business revenue, sales ledger, stock balance, and customer lists belong solely to you. We do not store, synchronize, or train models on your enterprise data.',
    },
    {
      icon: HardDrive,
      title: 'True Offline Independence',
      description: 'Run continuously during power fluctuations, remote work travels, or secure air-gapped corporate intranet facilities without requiring a remote server connection.',
    },
    {
      icon: Lock,
      title: 'Cryptographic Security & Verification',
      description: 'Every setup executable and portable archive is digitally signed with unique SHA-256 verification hashes and distributed through private cloud vaults.',
    },
    {
      icon: Layers,
      title: 'Perpetual Software Ownership',
      description: 'Say goodbye to recurring subscription fatigue. Own your tools permanently with lifetime offline verification and perpetual operational stability.',
    },
    {
      icon: Cpu,
      title: 'Minimal Hardware Footprint',
      description: 'Optimized for lightweight RAM allocation and low CPU idle states, leaving full hardware resources available for your critical workloads.',
    },
  ];

  return (
    <div id="features-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <Activity size={14} className="text-purple-400" />
          <span>Core Engineering Standards</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Powering Performance. <br />
          <span className="bg-gradient-to-r from-purple-400 to-indigo-300 bg-clip-text text-transparent">
            Securing Innovation.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          How FORBIDEN builds the next generation of business management and developer software tools with uncompromising performance and local privacy.
        </p>
      </div>

      {/* Feature Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-[#121422]/90 border border-purple-900/20 hover:border-purple-500/40 transition-all duration-300 space-y-4 shadow-lg hover:shadow-purple-950/30"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-900/80 to-indigo-950/80 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          );
        })}
      </div>

      {/* Call to action */}
      <div className="rounded-3xl border border-purple-500/20 bg-[#121424] p-8 sm:p-12 text-center space-y-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          Ready to experience the FORBIDEN difference?
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          Explore our suite of applications including Business Analyzer, License Generator, and Dev Toolkit.
        </p>
        <button
          onClick={onExploreApps}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-900/40 hover:shadow-purple-600/50 transition-all"
        >
          <span>Explore All Applications</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

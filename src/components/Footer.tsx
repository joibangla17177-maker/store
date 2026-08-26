import React from 'react';
import { ShieldCheck, HardDrive, Cpu, Terminal, ArrowUpRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      id="main-footer"
      className="w-full border-t border-purple-950/40 bg-[#06070B] text-slate-400 py-16"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 lg:gap-12 mb-12">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-700 to-fuchsia-500 p-0.5 shadow-md shadow-purple-600/30">
                <div className="w-full h-full bg-[#08090E] rounded-[6px] flex items-center justify-center">
                  <span className="text-sm font-black text-purple-400 font-mono">F</span>
                </div>
              </div>
              <span className="text-xl font-bold tracking-widest text-white uppercase font-mono">
                FORBIDEN
              </span>
            </div>

            <p className="text-sm text-slate-300 font-medium leading-relaxed max-w-md">
              Powering Performance. Securing Innovation.
            </p>
            <p className="text-xs text-slate-500 leading-relaxed max-w-md">
              Engineering high-performance, offline-first business management and developer utilities with absolute user data sovereignty and zero telemetry.
            </p>

            {/* Offline sovereignty pill */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/40 border border-purple-800/30 text-xs text-purple-300">
                <ShieldCheck size={14} className="text-purple-400" />
                <span>Zero Cloud Customer Data Tracking Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">
              Ecosystem
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('apps')}
                  className="hover:text-purple-300 transition-colors"
                >
                  All Applications
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('features')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Performance Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-purple-300 transition-colors"
                >
                  About FORBIDEN
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('support')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Support & Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-purple-300 transition-colors"
                >
                  Contact & Discord
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin')}
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors flex items-center gap-1.5"
                >
                  <span>Admin Panel</span>
                  <ArrowUpRight size={14} />
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Guarantees */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 font-mono">
              Integrity
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <HardDrive size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Private Google Drive verified distribution binaries</span>
              </li>
              <li className="flex items-start gap-2">
                <ShieldCheck size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <span>SHA-256 cryptographic installer checksums</span>
              </li>
              <li className="flex items-start gap-2">
                <Cpu size={14} className="text-purple-400 mt-0.5 flex-shrink-0" />
                <span>Zero background resource consumption</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-purple-950/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 FORBIDEN Software Corporation. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Security Whitepaper</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

import React, { useState, useEffect } from 'react';
import {
  Mail,
  MessageSquare,
  Send,
  CheckCircle2,
  Loader2,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Users,
  MessageCircle,
  Copy,
  Check
} from 'lucide-react';
import { SupportTicketRequest } from '../types';

export const DiscordIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-6 h-6',
  size,
}) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
  </svg>
);

export const ContactPage: React.FC = () => {
  const [copiedDiscord, setCopiedDiscord] = useState(false);
  const [formData, setFormData] = useState<SupportTicketRequest>({
    name: '',
    email: '',
    subject: 'Direct Contact & Licensing',
    appSlug: 'business-analyzer',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ id: string; message: string } | null>(null);
  const [discordInviteUrl, setDiscordInviteUrl] = useState('https://discord.gg/forbiden');

  // Fetch Discord invite link from settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings?.discordInviteLink) {
            setDiscordInviteUrl(data.settings.discordInviteLink);
          }
        }
      } catch (err) {
        console.warn('Could not fetch settings, using default Discord link');
      }
    };
    fetchSettings();
  }, []);

  const discordTag = 'FORBIDEN Community';

  const handleCopyDiscord = () => {
    navigator.clipboard.writeText(discordInviteUrl);
    setCopiedDiscord(true);
    setTimeout(() => setCopiedDiscord(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setTicketResult({
          id: data.ticketId,
          message: data.message,
        });
        setFormData({
          name: '',
          email: '',
          subject: 'Direct Contact & Licensing',
          appSlug: 'business-analyzer',
          message: '',
        });
      }
    } catch (err) {
      console.error('Contact error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="contact-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-12 animate-in fade-in duration-300">
      {/* 1. Discord Hero Banner Centered in Red-Lined Area */}
      <div className="relative overflow-hidden rounded-3xl border border-[#5865F2]/40 bg-gradient-to-b from-[#15172C] via-[#0E1020] to-[#0A0B14] p-8 sm:p-12 shadow-2xl shadow-[#5865F2]/20">
        {/* Glow ambient background lights */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#5865F2]/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
          {/* Left: Discord Branding & Logo */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* The Logo Box Matching Image 1 */}
            <div className="relative flex-shrink-0 w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#5865F2] flex items-center justify-center text-white shadow-xl shadow-[#5865F2]/40 ring-4 ring-[#5865F2]/30 hover:scale-105 transition-transform duration-300">
              <DiscordIcon size={56} className="text-white drop-shadow-md" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0E1020] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              </div>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#5865F2]/20 border border-[#5865F2]/40 text-xs font-semibold text-[#8a98ff]">
                <Users size={13} />
                <span>Official Discord Server</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight">
                Connect on Discord
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Join the official FORBIDEN community. Chat directly with the developers, get live technical support for Business Analyzer, share feature requests, and stay updated on new releases.
              </p>
            </div>
          </div>

          {/* Right: Discord Action Triggers */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-3 w-full sm:w-auto flex-shrink-0">
            <a
              id="join-discord-btn"
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-white text-sm bg-[#5865F2] hover:bg-[#4752C4] shadow-lg shadow-[#5865F2]/40 hover:shadow-[#5865F2]/60 active:scale-95 transition-all cursor-pointer"
            >
              <DiscordIcon size={20} />
              <span>Join Discord Server</span>
              <ExternalLink size={15} className="opacity-80" />
            </a>

            <button
              onClick={handleCopyDiscord}
              className="w-full sm:w-auto min-w-[220px] inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-[#1a1c30] hover:bg-[#222540] border border-[#5865F2]/30 transition-all cursor-pointer"
            >
              {copiedDiscord ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-300">Invite Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} className="text-slate-400" />
                  <span>Copy Invite Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 2. Direct Support Channels & Ticket Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Support Channels */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-3xl bg-[#121422]/90 border border-purple-900/30 space-y-4 shadow-lg">
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-purple-400" />
              <span>Direct Communication</span>
            </h3>

            <div className="space-y-3 text-xs">
              {/* Discord Option */}
              <div className="p-4 rounded-2xl bg-[#16182c] border border-[#5865F2]/30 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#5865F2] flex items-center justify-center text-white flex-shrink-0">
                    <DiscordIcon size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-white block">Discord Community</span>
                    <span className="text-slate-400">{discordInviteUrl.replace('https://', '').replace('/', '')}</span>
                  </div>
                </div>
                <a
                  href={discordInviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#5865F2]/20 hover:bg-[#5865F2] text-white text-[11px] font-semibold border border-[#5865F2]/40 transition-all"
                >
                  Join
                </a>
              </div>

              {/* Email Option */}
              <div className="p-4 rounded-2xl bg-[#090a12] border border-purple-950/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Direct Email</span>
                  <span className="text-slate-400">support@forbiden.com</span>
                </div>
              </div>

              {/* Response Time Guarantee */}
              <div className="p-4 rounded-2xl bg-[#090a12] border border-purple-950/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="font-bold text-white block">Guaranteed Response</span>
                  <span className="text-slate-400">24-hour turnaround for all commercial tickets</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Direct Message Form */}
        <div className="lg:col-span-7 rounded-3xl bg-[#121424] border border-purple-900/30 p-6 sm:p-8 space-y-6 shadow-xl shadow-purple-950/40">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-white">Send Direct Message</h3>
            <p className="text-xs text-slate-400">
              Submit your inquiry directly to our lead software architects.
            </p>
          </div>

          {ticketResult ? (
            <div className="p-8 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-base font-bold text-white">Message Transmitted</h4>
              <p className="text-xs text-purple-200">{ticketResult.message}</p>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-400 block">
                  Ticket Reference: <strong className="text-purple-300">#{ticketResult.id}</strong>
                </span>
              </div>
              <button
                onClick={() => setTicketResult(null)}
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Elena Vance"
                    className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white placeholder-slate-600 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-medium">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="elena@enterprise.com"
                    className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white placeholder-slate-600 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Application or Topic</label>
                <select
                  value={formData.appSlug}
                  onChange={(e) => setFormData({ ...formData, appSlug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white text-xs focus:outline-none"
                >
                  <option value="business-analyzer">Business Analyzer ($29.99)</option>
                  <option value="license-generator">License Generator ($14.99)</option>
                  <option value="data-manager">Data Manager ($19.99)</option>
                  <option value="backup-pro">Backup Pro ($9.99)</option>
                  <option value="enterprise-licensing">Enterprise / Volume Licensing</option>
                  <option value="general-inquiry">General Engineering Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, volume deployment questions, or custom tooling requirements..."
                  className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white placeholder-slate-600 text-xs focus:outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-900/40 text-xs flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting Message...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

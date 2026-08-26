import React, { useState } from 'react';
import {
  HelpCircle,
  Mail,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  FileQuestion,
  ShieldAlert
} from 'lucide-react';
import { SupportTicketRequest } from '../types';

export const SupportPage: React.FC = () => {
  const [formData, setFormData] = useState<SupportTicketRequest>({
    name: '',
    email: '',
    subject: '',
    appSlug: 'business-analyzer',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ id: string; message: string } | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Do FORBIDEN applications require an active internet connection to work?',
      a: 'No. All FORBIDEN applications, including Business Analyzer, are designed as 100% offline-first desktop programs. Internet is only required once during the initial download from our secure vault.',
    },
    {
      q: 'Is my business, sales, or inventory data uploaded to any server?',
      a: 'Never. FORBIDEN does not operate telemetry servers for customer commercial databases. All database records (sales, revenue, inventory, shareholders) are stored exclusively in your local computer file system.',
    },
    {
      q: 'What operating systems are supported?',
      a: 'Our core desktop products (Business Analyzer, License Generator, Data Manager, Backup Pro, System Optimizer) are natively compiled for 64-bit Windows 10 and Windows 11. Cross-platform utilities also provide macOS and Linux builds where noted.',
    },
    {
      q: 'How do I verify the integrity of my downloaded installer?',
      a: 'Every application download window presents an authoritative SHA-256 cryptographic checksum generated directly by the FORBIDEN build cluster. You can verify this against your downloaded file using PowerShell (`Get-FileHash setup.exe`) or any standard checksum utility.',
    },
    {
      q: 'Can I use Business Analyzer on multiple PCs in my office?',
      a: 'Yes. FORBIDEN applications operate with flexible workstation licensing. You can install and manage multiple separate local company databases without recurring per-seat fees.',
    },
  ];

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
          subject: '',
          appSlug: 'business-analyzer',
          message: '',
        });
      }
    } catch (err) {
      console.error('Support ticket error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="support-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/80 border border-purple-500/30 text-xs font-semibold text-purple-300">
          <HelpCircle size={14} className="text-purple-400" />
          <span>Support & Help Center</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          How can we help you?
        </h1>

        <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
          Find instant answers to common questions about installation, licensing, and offline operations, or reach our engineering support team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: FAQs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2.5 text-lg font-bold text-white">
            <FileQuestion size={20} className="text-purple-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-[#121422]/90 border border-purple-900/20 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-slate-200 hover:text-white"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp size={18} className="text-purple-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-500 flex-shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-400 leading-relaxed border-t border-purple-950/30 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Contact Form */}
        <div className="lg:col-span-5 rounded-3xl bg-[#121424] border border-purple-900/30 p-6 sm:p-8 space-y-6 shadow-xl shadow-purple-950/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Mail size={18} className="text-purple-400" />
              <span>Contact Engineering Support</span>
            </div>
            <p className="text-xs text-slate-400">
              Submit an inquiry and our team will respond to your email.
            </p>
          </div>

          {ticketResult ? (
            <div className="p-6 rounded-2xl bg-purple-950/40 border border-purple-500/40 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-purple-900/60 border border-purple-400/40 flex items-center justify-center text-purple-300 mx-auto">
                <CheckCircle2 size={24} />
              </div>
              <h4 className="text-base font-bold text-white">Inquiry Received</h4>
              <p className="text-xs text-purple-200">{ticketResult.message}</p>
              <div className="pt-2">
                <span className="text-xs font-mono text-slate-400 block">
                  Reference: <strong className="text-purple-300">{ticketResult.id}</strong>
                </span>
              </div>
              <button
                onClick={() => setTicketResult(null)}
                className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Your Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Alexander Vance"
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
                  placeholder="alex@enterprise.com"
                  className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white placeholder-slate-600 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Application</label>
                <select
                  value={formData.appSlug}
                  onChange={(e) => setFormData({ ...formData, appSlug: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#090a12] border border-purple-950/60 focus:border-purple-500/60 text-white text-xs focus:outline-none"
                >
                  <option value="business-analyzer">Business Analyzer</option>
                  <option value="license-generator">License Generator</option>
                  <option value="data-manager">Data Manager</option>
                  <option value="backup-pro">Backup Pro</option>
                  <option value="system-optimizer">System Optimizer</option>
                  <option value="dev-toolkit">Dev Toolkit</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-300 font-medium">Message Details *</label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your inquiry, feature request, or installation questions..."
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
                    <span>Submitting Ticket...</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit Inquiry</span>
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

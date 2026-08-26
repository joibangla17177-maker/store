import React, { useState } from 'react';
import { Save, Check } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [siteName, setSiteName] = useState('FORBIDEN');
  const [tagline, setTagline] = useState('Powering Performance. Securing Innovation.');
  const [supportEmail, setSupportEmail] = useState('support@forbiden.com');
  const [currency, setCurrency] = useState('USD ($)');
  const [enableTelemetry, setEnableTelemetry] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div id="admin-settings-view" className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Store Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure branding, global currency preferences, and security policies
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-white">General Branding</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Store / Brand Name</label>
              <input
                type="text"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-slate-300">Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Slogan / Headline</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Default Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
            >
              <option value="USD ($)">USD ($) - US Dollar</option>
              <option value="EUR (€)">EUR (€) - Euro</option>
              <option value="GBP (£)">GBP (£) - British Pound</option>
            </select>
          </div>
        </div>

        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-4">
          <h2 className="text-base font-semibold text-white">Privacy & Telemetry</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-slate-200">Zero Telemetry Policy</p>
              <p className="text-xs text-slate-500">Prevent third-party tracking scripts from running on user clients</p>
            </div>
            <button
              type="button"
              onClick={() => setEnableTelemetry(!enableTelemetry)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors ${
                !enableTelemetry ? 'bg-[#7c3aed]' : 'bg-slate-800'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white transition ${
                  !enableTelemetry ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] shadow-lg shadow-purple-900/30 transition-all"
          >
            {saved ? <Check size={16} /> : <Save size={16} />}
            <span>{saved ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

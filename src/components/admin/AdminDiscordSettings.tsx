import React, { useState, useEffect } from 'react';
import { Save, Check, AlertCircle, Copy, ExternalLink as ExternalLinkIcon } from 'lucide-react';

export const AdminDiscordSettings: React.FC = () => {
  const [discordInviteLink, setDiscordInviteLink] = useState('https://discord.gg/forbiden');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  // Load settings from backend on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.settings?.discordInviteLink) {
            setDiscordInviteLink(data.settings.discordInviteLink);
          }
        }
      } catch (err) {
        console.warn('Could not load settings from backend');
      }
    };

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate Discord invite link
    if (!discordInviteLink.trim()) {
      setError('Discord invite link cannot be empty');
      setLoading(false);
      return;
    }

    // Simple validation - should start with https://discord.gg/ or https://discord.com/invite/
    if (!discordInviteLink.startsWith('https://discord.gg/') && !discordInviteLink.startsWith('https://discord.com/invite/')) {
      setError('Invalid Discord invite link. Must start with https://discord.gg/ or https://discord.com/invite/');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/admin/settings/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discordInviteLink: discordInviteLink.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to save settings');
      }

      const data = await response.json();
      if (data.success) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      } else {
        throw new Error(data.message || 'Failed to save settings');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while saving');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(discordInviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenDiscord = () => {
    window.open(discordInviteLink, '_blank');
  };

  return (
    <div id="admin-discord-settings-view" className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Discord Server
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage the Discord server invite link displayed throughout the application
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Main Settings Card */}
        <div className="p-7 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm space-y-5">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="text-lg">💬</span>
            Discord Invite Link
          </h2>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Invite URL
            </label>
            <div className="relative">
              <input
                type="url"
                value={discordInviteLink}
                onChange={(e) => {
                  setDiscordInviteLink(e.target.value);
                  setError(''); // Clear error when user starts typing
                }}
                placeholder="https://discord.gg/yourcode"
                className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none focus:border-purple-500/50 transition-colors pr-12"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-200 transition-colors"
                title="Copy link"
              >
                {copied ? (
                  <Check size={18} className="text-emerald-400" />
                ) : (
                  <Copy size={18} />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Make sure to use your Discord server's invite link. Format: https://discord.gg/CODE
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 flex items-start gap-3">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-300">{error}</p>
            </div>
          )}

          {/* Preview Card */}
          <div className="p-4 rounded-lg bg-slate-900/50 border border-slate-800 space-y-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Preview</h3>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[#090b14] border border-slate-700/60">
              <span className="w-8 h-8 rounded-full bg-[#5865F2] flex items-center justify-center text-white font-bold text-sm">
                D
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-200">Join Our Discord</p>
                <p className="text-xs text-slate-500">Community & Support</p>
              </div>
              <a
                href={discordInviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#5865F2] hover:bg-[#4752C4] text-white text-xs font-semibold transition-colors"
              >
                Join
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-2 border-t border-slate-800/60 flex items-center gap-2">
            <button
              type="button"
              onClick={handleOpenDiscord}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] transition-all"
            >
              <ExternalLinkIcon size={14} />
              Open Discord Server
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="p-5 rounded-2xl bg-blue-950/30 border border-blue-500/30 space-y-3">
          <h3 className="text-sm font-semibold text-blue-300 flex items-center gap-2">
            <span>ℹ️</span>
            How Discord Links Work
          </h3>
          <ul className="text-xs text-blue-200/80 space-y-2">
            <li>• Your Discord invite link is displayed on all pages where users can join your community</li>
            <li>• Use the "Never Expire" option when creating your invite to prevent link expiration</li>
            <li>• Test your link before saving to ensure it's working correctly</li>
            <li>• Changes take effect immediately across the application</li>
          </ul>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] disabled:bg-slate-700 disabled:cursor-not-allowed shadow-lg shadow-purple-900/30 transition-all"
          >
            {saved ? (
              <>
                <Check size={16} />
                <span>Saved!</span>
              </>
            ) : loading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save Discord Link</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

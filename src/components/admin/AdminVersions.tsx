import React, { useState } from 'react';
import { Plus, Layers, CheckCircle2, Edit2, Trash2 } from 'lucide-react';
import { VersionRecord } from '../../types/admin';

interface AdminVersionsProps {
  versions: VersionRecord[];
  onAddVersion: (v: Omit<VersionRecord, 'id'>) => void;
  onDeleteVersion: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const AdminVersions: React.FC<AdminVersionsProps> = ({
  versions,
  onAddVersion,
  onDeleteVersion,
  onToggleStatus,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appName, setAppName] = useState('Business Analyzer');
  const [versionNumber, setVersionNumber] = useState('1.2.0');
  const [platform, setPlatform] = useState('Windows (64-bit)');
  const [fileSize, setFileSize] = useState('85.0 MB');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onAddVersion({
      appId: appName.toLowerCase().replace(/\s+/g, '-'),
      appName,
      versionNumber,
      releaseDate: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      platform,
      fileSize,
      downloadsCount: 0,
      status,
      googleDriveFileId: `DRIVE-${versionNumber}`,
    });
    setIsModalOpen(false);
  };

  return (
    <div id="admin-versions-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Versions
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus size={16} />
          <span>Add New Version</span>
        </button>
      </div>

      <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">APPLICATION</th>
                <th className="py-4 px-6">VERSION</th>
                <th className="py-4 px-6">RELEASE DATE</th>
                <th className="py-4 px-6">PLATFORM</th>
                <th className="py-4 px-6">FILE SIZE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {versions.map((ver) => (
                <tr key={ver.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                        <Layers size={16} />
                      </div>
                      <span>{ver.appName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-purple-300 font-mono text-xs font-semibold">
                    v{ver.versionNumber}
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs">
                    {ver.releaseDate}
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-xs">
                    {ver.platform}
                  </td>
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {ver.fileSize}
                  </td>
                  <td className="py-4 px-6">
                    {ver.status === 'Published' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        onClick={() => onToggleStatus(ver.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                        title="Toggle status"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        onClick={() => onDeleteVersion(ver.id)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30"
                        title="Delete version"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0e111d] border border-slate-700 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Create New Release Version</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Target Application</label>
                <select
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                >
                  <option value="Business Analyzer">Business Analyzer</option>
                  <option value="License Generator">License Generator</option>
                  <option value="Data Manager">Data Manager</option>
                  <option value="Backup Pro">Backup Pro</option>
                  <option value="System Optimizer">System Optimizer</option>
                  <option value="Dev Toolkit">Dev Toolkit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Version Number</label>
                  <input
                    type="text"
                    required
                    value={versionNumber}
                    onChange={(e) => setVersionNumber(e.target.value)}
                    placeholder="1.2.0"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">File Size</label>
                  <input
                    type="text"
                    required
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="85.0 MB"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Platform</label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                  >
                    <option value="Windows (64-bit)">Windows (64-bit)</option>
                    <option value="macOS (Universal)">macOS (Universal)</option>
                    <option value="Linux (AppImage)">Linux (AppImage)</option>
                    <option value="Android (APK)">Android (APK)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-300 bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9]"
                >
                  Create Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

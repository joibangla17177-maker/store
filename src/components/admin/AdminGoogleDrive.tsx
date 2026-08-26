import React, { useState } from 'react';
import { Cloud, CheckCircle, RefreshCw, HardDrive, Key, Folder, File } from 'lucide-react';

export const AdminGoogleDrive: React.FC = () => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState('Just now');

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync('Just now');
    }, 1200);
  };

  const driveFiles = [
    { name: 'BusinessAnalyzer_v1.0.0_Setup.exe', size: '84.2 MB', path: '/FORBIDEN/Production/Windows', updated: 'May 20, 2025' },
    { name: 'LicenseGen_v1.0.0_Setup.exe', size: '36.8 MB', path: '/FORBIDEN/Production/Windows', updated: 'June 14, 2025' },
    { name: 'DataManager_v1.1.0_Setup.exe', size: '52.4 MB', path: '/FORBIDEN/Production/Windows', updated: 'July 02, 2025' },
    { name: 'BackupPro_v1.0.0_Setup.exe', size: '28.1 MB', path: '/FORBIDEN/Staging/Windows', updated: 'Aug 10, 2025' },
    { name: 'SystemOptimizer_v1.0.0_Setup.exe', size: '21.5 MB', path: '/FORBIDEN/Production/Windows', updated: 'Aug 18, 2025' },
    { name: 'DevToolkit_v1.0.0_Setup.exe', size: '64.0 MB', path: '/FORBIDEN/Staging/Multiplatform', updated: 'Aug 22, 2025' },
  ];

  return (
    <div id="admin-google-drive-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Google Drive Storage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Secure cloud asset distribution and high-speed signed installer mirrors
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] transition-all shadow-lg shadow-purple-900/30"
        >
          <RefreshCw size={16} className={isSyncing ? 'animate-spin' : ''} />
          <span>{isSyncing ? 'Syncing Files...' : 'Sync Now'}</span>
        </button>
      </div>

      {/* Connection Status Card */}
      <div className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
            <Cloud size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base font-semibold text-white">Google Drive Service Account</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                <CheckCircle size={11} /> Connected
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              forbiden-store-sa@forbiden-cloud-vault.iam.gserviceaccount.com
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 text-right">
          <div>Quota: <span className="text-slate-200 font-semibold">287.4 GB / 2 TB</span></div>
          <div className="text-slate-500 mt-0.5">Last verified: {lastSync}</div>
        </div>
      </div>

      {/* Files Table */}
      <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="p-4 px-6 border-b border-slate-800/80 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            SYNCHRONIZED PACKAGES
          </span>
          <span className="text-xs text-purple-300 font-medium">
            6 installer binaries indexed
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">FILE NAME</th>
                <th className="py-4 px-6">DRIVE DIRECTORY</th>
                <th className="py-4 px-6">SIZE</th>
                <th className="py-4 px-6 text-right">MODIFIED</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {driveFiles.map((file, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-200">
                    <div className="flex items-center gap-3">
                      <File size={16} className="text-purple-400" />
                      <span className="font-mono text-xs">{file.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-xs font-mono">
                    {file.path}
                  </td>
                  <td className="py-4 px-6 text-slate-300 text-xs font-mono">
                    {file.size}
                  </td>
                  <td className="py-4 px-6 text-slate-500 text-xs text-right">
                    {file.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

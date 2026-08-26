import React from 'react';
import { Download, HardDrive, CheckCircle2 } from 'lucide-react';

export const AdminDownloads: React.FC = () => {
  const downloadLogs: any[] = [];

  return (
    <div id="admin-downloads-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Downloads Log
        </h1>
        <span className="text-xs px-3 py-1.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-800/40 font-mono">
          Total Bandwidth: 0 GB (This Month)
        </span>
      </div>

      {downloadLogs.length === 0 ? (
        <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden p-8">
          <div className="text-center text-slate-400">
            <Download size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No downloads yet</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-4 px-6">APPLICATION</th>
                  <th className="py-4 px-6">VERSION</th>
                  <th className="py-4 px-6">PLATFORM</th>
                  <th className="py-4 px-6">FILE SIZE</th>
                  <th className="py-4 px-6">TIMESTAMP</th>
                  <th className="py-4 px-6 text-right">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-sm">
                {downloadLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 px-6 font-medium text-slate-200">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                          <Download size={16} />
                        </div>
                        <span>{log.app}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      v{log.version}
                    </td>
                    <td className="py-4 px-6 text-slate-300 text-xs">
                      {log.platform}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                      {log.size}
                    </td>
                    <td className="py-4 px-6 text-slate-500 text-xs">
                      {log.time}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 size={12} />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};


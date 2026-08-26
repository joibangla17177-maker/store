import React from 'react';
import { FileText, ShieldAlert, CheckCircle, Upload, PlusCircle, RefreshCw } from 'lucide-react';

export const AdminActivityLogs: React.FC = () => {
  const logs: any[] = [];

  return (
    <div id="admin-activity-logs-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Activity Logs
        </h1>
        <span className="text-xs text-slate-400 font-mono">
          Audit Trail: Immutable Local Log
        </span>
      </div>

      {logs.length === 0 ? (
        <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden p-8">
          <div className="text-center text-slate-400">
            <FileText size={48} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">No activity logs yet</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-800/40">
            {logs.map((log) => {
              const Icon = log.icon;
              return (
                <div key={log.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-900/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                      <Icon size={16} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white">{log.action}</div>
                      <div className="text-xs text-slate-400">by {log.user}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-slate-400">{log.time}</div>
                    <span className="text-[10px] text-emerald-400 font-semibold uppercase">{log.status}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};


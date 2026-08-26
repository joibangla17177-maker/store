import React from 'react';
import { Users, ShieldCheck, UserCheck } from 'lucide-react';

export const AdminUsers: React.FC = () => {
  const users = [
    { name: 'Admin Root', email: 'admin@forbiden.com', role: 'Super Admin', status: 'Active', lastActive: '5 mins ago' },
    { name: 'Release Engineer', email: 'deploy@forbiden.com', role: 'Maintainer', status: 'Active', lastActive: '2 hours ago' },
    { name: 'Security Auditor', email: 'secops@forbiden.com', role: 'Auditor', status: 'Active', lastActive: '1 day ago' },
  ];

  return (
    <div id="admin-users-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Team & Administrators
        </h1>
      </div>

      <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="py-4 px-6">USER</th>
              <th className="py-4 px-6">ROLE</th>
              <th className="py-4 px-6">STATUS</th>
              <th className="py-4 px-6 text-right">LAST ACTIVE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40 text-sm">
            {users.map((u, i) => (
              <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                <td className="py-4 px-6 font-medium text-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-950/80 border border-purple-800/40 flex items-center justify-center text-purple-400 font-bold text-xs">
                      {u.name[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{u.name}</div>
                      <div className="text-xs text-slate-400">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-950/60 text-purple-300 border border-purple-800/40">
                    <ShieldCheck size={12} /> {u.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                    <UserCheck size={12} /> {u.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-xs text-slate-400 text-right font-mono">
                  {u.lastActive}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

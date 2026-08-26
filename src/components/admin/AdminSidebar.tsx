import React from 'react';
import {
  LayoutDashboard,
  Smartphone,
  Layers,
  Sparkles,
  Folder,
  Download,
  Settings,
  Users,
  FileText,
  LogOut,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export type AdminMenuTab =
  | 'dashboard'
  | 'apps'
  | 'versions'
  | 'features'
  | 'categories'
  | 'downloads'
  | 'settings'
  | 'users'
  | 'activity-logs'
  | 'discord';

interface AdminSidebarProps {
  activeTab: AdminMenuTab;
  onSelectTab: (tab: AdminMenuTab) => void;
  onLogout: () => void;
  onViewStore: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  onLogout,
  onViewStore,
}) => {
  const menuItems: { id: AdminMenuTab; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'apps', label: 'Apps', icon: Smartphone },
    { id: 'versions', label: 'Versions', icon: Layers },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'categories', label: 'Categories', icon: Folder },
    { id: 'downloads', label: 'Downloads', icon: Download },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'discord', label: 'Discord Server', icon: MessageSquare },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'activity-logs', label: 'Activity Logs', icon: FileText },
  ];

  return (
    <aside
      id="admin-sidebar"
      className="w-64 flex-shrink-0 bg-[#0B0D17] border-r border-slate-800/60 flex flex-col min-h-screen select-none"
    >
      {/* Brand Header */}
      <div className="p-6 pb-5 flex items-center gap-3.5 border-b border-slate-800/40">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-purple-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-600/30">
          <div className="w-full h-full bg-[#0B0D17] rounded-[10px] flex items-center justify-center">
            <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              F
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-black tracking-wider text-white font-mono leading-none">
            FORBIDEN
          </span>
          <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase mt-1">
            ADMIN PANEL
          </span>
        </div>
      </div>

      {/* Main Navigation Menu */}
      <div className="flex-1 px-4 py-5 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`admin-nav-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-purple-950/70 text-purple-200 border border-purple-500/30 shadow-inner font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon
                size={18}
                className={isActive ? 'text-purple-400' : 'text-slate-400'}
              />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Bottom Menu / Logout */}
      <div className="p-4 border-t border-slate-800/40 space-y-1.5">
        <button
          onClick={onViewStore}
          className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-all"
        >
          <span className="flex items-center gap-2.5">
            <ExternalLink size={15} className="text-slate-500" />
            View Public Store
          </span>
        </button>

        <button
          id="admin-logout-btn"
          onClick={onLogout}
          className="w-full flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-950/20 transition-all"
        >
          <LogOut size={18} className="text-slate-400 group-hover:text-red-400" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

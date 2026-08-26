import React, { useState } from 'react';
import { Plus, Edit2, Eye, MoreVertical, Trash2, CheckCircle2 } from 'lucide-react';
import { AppIcon } from '../AppIcon';

export interface AdminAppItem {
  id: string;
  name: string;
  slug: string;
  version: string;
  price: number;
  status: 'Published' | 'Draft';
  downloads: number;
  category: string;
  shortDescription: string;
  fullDescription: string;
  platforms: string[];
  googleDriveFile?: string;
  googleDriveFolder?: string;
  showOnStore?: boolean;
  iconColor?: string;
  iconType?: 'chart' | 'shield' | 'database' | 'cloud' | 'speedometer' | 'code' | 'lock' | 'cpu';
  iconSourceType?: 'upload' | 'google_drive';
  iconFileId?: string;
  iconFileName?: string;
  iconMimeType?: string;
  iconSize?: string;
  iconUrl?: string;
  // ZIP file upload
  uploadedFileData?: string; // Base64 encoded file
  uploadedFileName?: string; // Original filename
  uploadedFileSize?: string; // File size display
}

interface AdminAppsProps {
  apps: AdminAppItem[];
  onAddNewApp: () => void;
  onEditApp: (app: AdminAppItem) => void;
  onViewApp: (app: AdminAppItem) => void;
  onDeleteApp: (appId: string) => void;
  onToggleStatus: (appId: string) => void;
}

export const AdminApps: React.FC<AdminAppsProps> = ({
  apps,
  onAddNewApp,
  onEditApp,
  onViewApp,
  onDeleteApp,
  onToggleStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const totalPages = Math.ceil(apps.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentApps = apps.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div id="admin-applications-view" className="space-y-6">
      {/* Header Row: Title on Left, Add New App button on Right (Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Applications
        </h1>
        <button
          id="admin-add-new-app-btn"
          onClick={onAddNewApp}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus size={16} />
          <span>Add New App</span>
        </button>
      </div>

      {/* Main Table Card (Image 2) */}
      <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">APP NAME</th>
                <th className="py-4 px-6">VERSION</th>
                <th className="py-4 px-6">PRICE</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6">DOWNLOADS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {currentApps.map((app) => (
                <tr
                  key={app.id}
                  className="hover:bg-slate-900/40 transition-colors group"
                >
                  {/* APP NAME with Icon badge */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-950/70 border border-purple-800/40 flex items-center justify-center text-purple-300 flex-shrink-0 shadow-inner overflow-hidden">
                        <AppIcon type={app.iconType || 'chart'} iconUrl={app.iconUrl} size="sm" />
                      </div>
                      <span className="font-medium text-slate-200 group-hover:text-white transition-colors">
                        {app.name}
                      </span>
                    </div>
                  </td>

                  {/* VERSION */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {app.version}
                  </td>

                  {/* PRICE */}
                  <td className="py-4 px-6 text-slate-300 font-medium">
                    ${app.price.toFixed(2)}
                  </td>

                  {/* STATUS Badge */}
                  <td className="py-4 px-6">
                    {app.status === 'Published' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-sm">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 shadow-sm">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* DOWNLOADS */}
                  <td className="py-4 px-6 text-slate-300 font-mono">
                    {app.downloads.toLocaleString()}
                  </td>

                  {/* ACTIONS */}
                  <td className="py-4 px-6 text-right">
                    <div className="relative inline-flex items-center justify-end gap-1 text-slate-400">
                      {/* Edit Button */}
                      <button
                        title="Edit app"
                        onClick={() => onEditApp(app)}
                        className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* View Button */}
                      <button
                        title="View details / store page"
                        onClick={() => onViewApp(app)}
                        className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <Eye size={16} />
                      </button>

                      {/* More Menu */}
                      <button
                        title="More options"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === app.id ? null : app.id)
                        }
                        className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Popup */}
                      {activeMenuId === app.id && (
                        <div
                          className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-[#0e111d] border border-slate-700/80 shadow-2xl py-1 text-left"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              onToggleStatus(app.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} className="text-purple-400" />
                            <span>
                              {app.status === 'Published'
                                ? 'Set to Draft'
                                : 'Publish App'}
                            </span>
                          </button>
                          <button
                            onClick={() => {
                              onDeleteApp(app.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs text-red-400 hover:bg-red-950/30 flex items-center gap-2"
                          >
                            <Trash2 size={14} />
                            <span>Delete App</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Pagination (Exact match to Image 2) */}
        <div className="py-4 px-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, apps.length)} of {apps.length} apps
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                currentPage === 1
                  ? 'border-slate-800/40 text-slate-600 cursor-not-allowed'
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              &lt;
            </button>

            {/* Page 1 */}
            <button
              onClick={() => setCurrentPage(1)}
              className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-all ${
                currentPage === 1
                  ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-slate-800/60'
              }`}
            >
              1
            </button>

            {/* Page 2 */}
            {totalPages >= 2 && (
              <button
                onClick={() => setCurrentPage(2)}
                className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-all ${
                  currentPage === 2
                    ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-slate-800/60'
                }`}
              >
                2
              </button>
            )}

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                currentPage === totalPages
                  ? 'border-slate-800/40 text-slate-600 cursor-not-allowed'
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

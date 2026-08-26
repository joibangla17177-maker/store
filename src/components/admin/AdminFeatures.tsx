import React, { useState } from 'react';
import { Plus, Edit2, Trash2, MoreVertical, CheckCircle2 } from 'lucide-react';
import { FeatureRecord } from '../../types/admin';

interface AdminFeaturesProps {
  features: FeatureRecord[];
  onAddFeature: (feat: Omit<FeatureRecord, 'id'>) => void;
  onEditFeature: (feat: FeatureRecord) => void;
  onDeleteFeature: (id: string) => void;
  onToggleStatus: (id: string) => void;
}

export const AdminFeatures: React.FC<AdminFeaturesProps> = ({
  features,
  onAddFeature,
  onEditFeature,
  onDeleteFeature,
  onToggleStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Add/Edit Feature Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<FeatureRecord | null>(null);
  const [featureName, setFeatureName] = useState('');
  const [appName, setAppName] = useState('Business Analyzer');
  const [version, setVersion] = useState('1.0.0');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  const totalPages = Math.ceil(features.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentFeatures = features.slice(startIndex, startIndex + itemsPerPage);

  const handleOpenAdd = () => {
    setEditingFeature(null);
    setFeatureName('');
    setAppName('Business Analyzer');
    setVersion('1.0.0');
    setStatus('Published');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (feat: FeatureRecord) => {
    setEditingFeature(feat);
    setFeatureName(feat.name);
    setAppName(feat.appName);
    setVersion(feat.version);
    setStatus(feat.status);
    setIsModalOpen(true);
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureName.trim()) return;

    if (editingFeature) {
      onEditFeature({
        ...editingFeature,
        name: featureName,
        appName,
        version,
        status,
      });
    } else {
      onAddFeature({
        name: featureName,
        appId: appName.toLowerCase().replace(/\s+/g, '-'),
        appName,
        version,
        status,
      });
    }
    setIsModalOpen(false);
  };

  return (
    <div id="admin-features-view" className="space-y-6">
      {/* Header Row: Features on Left, + Add New Feature button on Right (Image 5) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Features
        </h1>
        <button
          id="admin-add-feature-btn"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus size={16} />
          <span>Add New Feature</span>
        </button>
      </div>

      {/* Main Table Card (Image 5) */}
      <div className="rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6">FEATURE NAME</th>
                <th className="py-4 px-6">APP</th>
                <th className="py-4 px-6">VERSION</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-sm">
              {currentFeatures.map((feat) => (
                <tr
                  key={feat.id}
                  className="hover:bg-slate-900/40 transition-colors group"
                >
                  {/* FEATURE NAME */}
                  <td className="py-4 px-6 font-medium text-slate-200 group-hover:text-white transition-colors">
                    {feat.name}
                  </td>

                  {/* APP */}
                  <td className="py-4 px-6 text-slate-300">
                    {feat.appName}
                  </td>

                  {/* VERSION */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-xs">
                    {feat.version}
                  </td>

                  {/* STATUS Badge */}
                  <td className="py-4 px-6">
                    {feat.status === 'Published' ? (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 shadow-sm">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-950/60 text-indigo-300 border border-indigo-500/30 shadow-sm">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* ACTIONS: ✏️ Edit, 🗑️ Delete (Red), ⋮ More (Image 5) */}
                  <td className="py-4 px-6 text-right">
                    <div className="relative inline-flex items-center justify-end gap-1 text-slate-400">
                      {/* Edit */}
                      <button
                        title="Edit feature"
                        onClick={() => handleOpenEdit(feat)}
                        className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>

                      {/* Delete (Red trash icon matching Image 5) */}
                      <button
                        title="Delete feature"
                        onClick={() => onDeleteFeature(feat.id)}
                        className="p-1.5 rounded-lg text-rose-400/80 hover:text-rose-300 hover:bg-rose-950/30 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>

                      {/* More menu */}
                      <button
                        title="More options"
                        onClick={() =>
                          setActiveMenuId(activeMenuId === feat.id ? null : feat.id)
                        }
                        className="p-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-all"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {/* Dropdown Popup */}
                      {activeMenuId === feat.id && (
                        <div
                          className="absolute right-0 top-8 z-30 w-44 rounded-xl bg-[#0e111d] border border-slate-700/80 shadow-2xl py-1 text-left"
                          onMouseLeave={() => setActiveMenuId(null)}
                        >
                          <button
                            onClick={() => {
                              onToggleStatus(feat.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/70 flex items-center gap-2"
                          >
                            <CheckCircle2 size={14} className="text-purple-400" />
                            <span>
                              {feat.status === 'Published'
                                ? 'Set to Draft'
                                : 'Publish Feature'}
                            </span>
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

        {/* Footer Pagination (Exact match to Image 5: Showing 1 to 5 of 15 features, < 1 2 3 >) */}
        <div className="py-4 px-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, features.length)} of {features.length} features
          </div>

          <div className="flex items-center gap-1.5">
            {/* Prev Arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className={`w-8 h-8 rounded-lg flex items-center justify-center border transition-all ${
                currentPage === 1
                  ? 'border-slate-800/40 text-slate-600 cursor-not-allowed'
                  : 'border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
              }`}
            >
              &lt;
            </button>

            {/* Pages (1, 2, 3) */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg font-semibold flex items-center justify-center transition-all ${
                  currentPage === pageNum
                    ? 'bg-[#7c3aed] text-white shadow-md shadow-purple-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40 border border-slate-800/60'
                }`}
              >
                {pageNum}
              </button>
            ))}

            {/* Next Arrow */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
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

      {/* Add / Edit Feature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-2xl bg-[#0e111d] border border-slate-700/80 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h3 className="text-lg font-bold text-white">
                {editingFeature ? 'Edit Feature' : 'Add New Feature'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Feature Name *
                </label>
                <input
                  type="text"
                  required
                  value={featureName}
                  onChange={(e) => setFeatureName(e.target.value)}
                  placeholder="e.g. Sales & Expense Management"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Target Application *
                </label>
                <select
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none"
                >
                  <option value="Business Analyzer">Business Analyzer</option>
                  <option value="License Generator">License Generator</option>
                  <option value="Data Manager">Data Manager</option>
                  <option value="Backup Pro">Backup Pro</option>
                  <option value="System Optimizer">System Optimizer</option>
                  <option value="Dev Toolkit">Dev Toolkit</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Version *
                  </label>
                  <input
                    type="text"
                    required
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="1.0.0"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-300">
                    Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as 'Published' | 'Draft')}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 focus:border-purple-500 text-sm text-slate-100 outline-none"
                  >
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-slate-300 hover:text-white bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9]"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

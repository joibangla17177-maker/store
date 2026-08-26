import React, { useState } from 'react';
import { Folder, Plus, Edit2, Trash2 } from 'lucide-react';
import { Category } from '../../types';

interface AdminCategoriesProps {
  categories: Category[];
  onAddCategory: (cat: Partial<Category>) => void;
  onDeleteCategory: (id: string) => void;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  categories,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAddCategory({
      id: 'cat-' + name.toLowerCase().replace(/\s+/g, '-'),
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      description,
      icon: 'Folder',
      appCount: 0,
      displayOrder: categories.length + 1,
    });
    setName('');
    setDescription('');
    setIsModalOpen(false);
  };

  return (
    <div id="admin-categories-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
          Categories
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#7c3aed] hover:bg-[#6d28d9] active:scale-95 transition-all shadow-lg shadow-purple-900/30"
        >
          <Plus size={16} />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="p-6 rounded-2xl bg-[#111422] border border-slate-800/80 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-900/40 transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-purple-950/60 border border-purple-800/40 flex items-center justify-center text-purple-400">
                <Folder size={20} />
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-900 text-slate-400 font-medium">
                {cat.appCount || 0} Apps
              </span>
            </div>

            <div>
              <h3 className="text-base font-semibold text-white">{cat.name}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                {cat.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
              <span>Slug: <span className="font-mono text-purple-300">/{cat.slug}</span></span>
              <button
                onClick={() => onDeleteCategory(cat.id)}
                className="text-rose-400 hover:text-rose-300 p-1 rounded hover:bg-rose-950/30"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0e111d] border border-slate-700 p-6 shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-white">Add New Category</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. AI & Machine Learning"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Short summary of this category"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#090b14] border border-slate-800 text-sm text-slate-100 outline-none resize-none"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

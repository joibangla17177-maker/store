import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronLeft, ChevronRight, Filter, X } from 'lucide-react';
import { AppItem, Category, PlatformType } from '../types';
import { AppCard } from './AppCard';

interface AppsPageProps {
  apps: AppItem[];
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onSelectApp: (app: AppItem) => void;
  onDownloadApp: (app: AppItem, e: React.MouseEvent) => void;
}

export const AppsPage: React.FC<AppsPageProps> = ({
  apps,
  categories,
  selectedCategory,
  onSelectCategory,
  onSelectApp,
  onDownloadApp,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [selectedSort, setSelectedSort] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Filter & Sort
  const filteredApps = useMemo(() => {
    return apps.filter((app) => {
      // Category filter
      if (selectedCategory !== 'all') {
        const catMatch =
          app.categorySlug.toLowerCase() === selectedCategory.toLowerCase() ||
          app.category.toLowerCase() === selectedCategory.toLowerCase();
        if (!catMatch) return false;
      }

      // Platform filter
      if (selectedPlatform !== 'all') {
        const platMatch = app.platforms.some(
          (p) => p.toLowerCase() === selectedPlatform.toLowerCase()
        );
        if (!platMatch) return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = app.name.toLowerCase().includes(q);
        const matchesDesc =
          app.shortDescription.toLowerCase().includes(q) ||
          app.fullDescription.toLowerCase().includes(q);
        const matchesFeatures = app.features.some((f) => f.toLowerCase().includes(q));
        if (!matchesName && !matchesDesc && !matchesFeatures) return false;
      }

      return true;
    }).sort((a, b) => {
      switch (selectedSort) {
        case 'popular':
          return b.downloadsCount - a.downloadsCount;
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return a.sortOrder - b.sortOrder;
      }
    });
  }, [apps, selectedCategory, selectedPlatform, searchQuery, selectedSort]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredApps.slice(start, start + itemsPerPage);
  }, [filteredApps, currentPage]);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSelectCategory(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div id="all-apps-page" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24 space-y-8">
      {/* Header section matching Screenshot 2 */}
      <div className="space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          All Applications
        </h1>
        <p className="text-sm text-slate-400">
          Explore all software applications created by FORBIDEN.
        </p>
      </div>

      {/* Filter and Search Bar matching Screenshot 2 */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        {/* Search input with search icon */}
        <div className="relative flex-1 w-full">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            id="apps-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search applications..."
            className="w-full pl-11 pr-10 py-3.5 rounded-2xl bg-[#121422]/90 border border-purple-900/30 hover:border-purple-500/30 focus:border-purple-500/60 text-white placeholder-slate-500 text-sm focus:outline-none transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Category Dropdown matching Screenshot 2 */}
        <div className="relative w-full md:w-64">
          <select
            id="category-filter-select"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full appearance-none pl-4 pr-10 py-3.5 rounded-2xl bg-[#121422]/90 border border-purple-900/30 hover:border-purple-500/30 focus:border-purple-500/60 text-slate-200 text-sm focus:outline-none cursor-pointer transition-all"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Results Count & Optional Quick Reset */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          Showing <strong className="text-white">{filteredApps.length}</strong> applications
          {selectedCategory !== 'all' && ` in category '${selectedCategory}'`}
        </span>

        {(selectedCategory !== 'all' || searchQuery || selectedPlatform !== 'all') && (
          <button
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
              setSelectedPlatform('all');
              setCurrentPage(1);
            }}
            className="text-purple-400 hover:text-purple-300 font-medium"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* 6-Card Grid matching Screenshot 2 */}
      {paginatedApps.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#121422]/50 border border-purple-900/20 space-y-3">
          <p className="text-base font-semibold text-white">No applications found</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords or switching category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedApps.map((app, idx) => (
            <AppCard
              key={app.id}
              app={app}
              index={idx}
              onSelect={onSelectApp}
              onDownload={onDownloadApp}
            />
          ))}
        </div>
      )}

      {/* Pagination Controls matching Screenshot 2: < 1 2 3 > */}
      {totalPages > 1 && (
        <div id="apps-pagination" className="flex items-center justify-center gap-2 pt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              currentPage === 1
                ? 'border-purple-950/30 text-slate-600 cursor-not-allowed bg-[#0d0e17]'
                : 'border-purple-900/30 text-slate-300 hover:text-white hover:bg-purple-900/30 bg-[#121422]'
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const pageNum = i + 1;
            const isActive = pageNum === currentPage;
            return (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#6D28D9] text-white border border-purple-400 shadow-md shadow-purple-900/40'
                    : 'bg-[#121422] text-slate-400 hover:text-white border border-purple-900/30 hover:bg-[#181a2e]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
              currentPage === totalPages
                ? 'border-purple-950/30 text-slate-600 cursor-not-allowed bg-[#0d0e17]'
                : 'border-purple-900/30 text-slate-300 hover:text-white hover:bg-purple-900/30 bg-[#121422]'
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { SpotlightNavbar } from './SpotlightNavbar';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, slug?: string) => void;
  onOpenSearch: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onNavigate,
  onOpenSearch,
  isDark,
  onToggleTheme,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'apps', label: 'Apps' },
    { id: 'features', label: 'Features' },
    { id: 'about', label: 'About' },
    { id: 'support', label: 'Support' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (tabId: string) => {
    onNavigate(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full border-b border-purple-950/40 bg-[#08090E]/90 backdrop-blur-xl transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div
          id="brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-800 via-violet-600 to-fuchsia-500 p-0.5 shadow-lg shadow-purple-600/30 group-hover:shadow-purple-500/50 transition-all">
            <div className="w-full h-full bg-[#08090E] rounded-[10px] flex items-center justify-center">
              <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
                F
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-widest text-white uppercase font-mono">
              FORBIDEN
            </span>
          </div>
        </div>

        {/* Center: Desktop Spotlight Navigation */}
        <div className="hidden md:flex items-center justify-center">
          <SpotlightNavbar
            items={navItems}
            activeId={currentTab}
            onItemClick={(item) => handleNavClick(item.id)}
          />
        </div>

        {/* Right: Actions (Search, Theme, Explore Apps) */}
        <div className="hidden md:flex items-center gap-4">
          <button
            id="global-search-btn"
            onClick={onOpenSearch}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#161828] border border-transparent hover:border-purple-900/30 transition-all cursor-pointer"
            title="Search applications (Ctrl+K)"
          >
            <Search size={18} />
          </button>

          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-[#161828] border border-transparent hover:border-purple-900/30 transition-all cursor-pointer"
            title="Toggle theme"
          >
            {isDark ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            id="explore-apps-nav-btn"
            onClick={() => handleNavClick('apps')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-900/40 hover:shadow-purple-600/40 active:scale-95 transition-all cursor-pointer"
          >
            <span>Explore Apps</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="p-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <Search size={20} />
          </button>
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-400 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-purple-900/30 bg-[#0c0d16] px-4 pt-2 pb-6 space-y-3">
          <div className="grid grid-cols-1 gap-2 pt-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-left text-base font-medium transition-colors ${
                  currentTab === item.id
                    ? 'bg-purple-900/40 text-purple-200 border border-purple-500/30'
                    : 'text-slate-300 hover:bg-[#161828]'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-purple-900/30 flex items-center justify-between">
            <button
              onClick={onToggleTheme}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white bg-[#141624] cursor-pointer"
            >
              {isDark ? <Moon size={16} /> : <Sun size={16} />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>

            <button
              onClick={() => handleNavClick('apps')}
              className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-500 shadow-md cursor-pointer"
            >
              Explore Apps
            </button>
          </div>
        </div>
      )}
    </header>
  );
};


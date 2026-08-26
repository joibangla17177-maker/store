import React, { useState, useEffect } from 'react';
import { AppItem, Category, PlatformType } from './types';
import { INITIAL_APPS, INITIAL_CATEGORIES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/HomePage';
import { AppsPage } from './components/AppsPage';
import { AppDetails } from './components/AppDetails';
import { FeaturesPage } from './components/FeaturesPage';
import { AboutPage } from './components/AboutPage';
import { SupportPage } from './components/SupportPage';
import { ContactPage } from './components/ContactPage';
import { DownloadModal } from './components/DownloadModal';
import { SearchModal } from './components/SearchModal';
import { AdminPanel } from './components/admin/AdminPanel';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('home');
  const [selectedAppSlug, setSelectedAppSlug] = useState<string | null>(null);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  
  // App Store Data
  const [apps, setApps] = useState<AppItem[]>(INITIAL_APPS);
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  
  // Download Modal state
  const [downloadModalApp, setDownloadModalApp] = useState<AppItem | null>(null);
  const [downloadPlatform, setDownloadPlatform] = useState<PlatformType>('Windows');
  const [isDownloadOpen, setIsDownloadOpen] = useState<boolean>(false);

  // Theme state
  const [isDark, setIsDark] = useState<boolean>(true);

  // Sync data from backend API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appsRes, catsRes] = await Promise.all([
          fetch('/api/apps?limit=50'),
          fetch('/api/categories'),
        ]);

        if (appsRes.ok) {
          const appsData = await appsRes.json();
          // Always update apps array, even if empty
          if (appsData.apps !== undefined) {
            setApps(appsData.apps);
          }
        }

        if (catsRes.ok) {
          const catsData = await catsRes.json();
          if (catsData.categories && catsData.categories.length > 0) {
            setCategories(catsData.categories);
          }
        }
      } catch (err) {
        console.warn('Using local fallback catalog data:', err);
      }
    };

    fetchData();
    
    // Refresh apps every 10 seconds to catch admin changes
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  // Handle URL hash or back/forward navigation - ALWAYS start on HomeScreen first
  useEffect(() => {
    // Ensure the user starts at the top of the HomeScreen on every refresh/reopen
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Always reset to home screen on initial mount / reload
    setCurrentTab('home');
    setSelectedAppSlug(null);
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash.startsWith('app/')) {
        const slug = hash.replace('app/', '');
        setSelectedAppSlug(slug);
        setCurrentTab('app-details');
      } else if (hash === 'apps') {
        setCurrentTab('apps');
        setSelectedAppSlug(null);
      } else if (hash === 'features') {
        setCurrentTab('features');
        setSelectedAppSlug(null);
      } else if (hash === 'about') {
        setCurrentTab('about');
        setSelectedAppSlug(null);
      } else if (hash === 'support') {
        setCurrentTab('support');
        setSelectedAppSlug(null);
      } else if (hash === 'contact') {
        setCurrentTab('contact');
        setSelectedAppSlug(null);
      } else if (hash === 'admin') {
        setCurrentTab('admin');
        setSelectedAppSlug(null);
      } else if (hash === '' || hash === 'home') {
        setCurrentTab('home');
        setSelectedAppSlug(null);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (tab: string, slug?: string) => {
    if (tab === 'app-details' && slug) {
      setSelectedAppSlug(slug);
      setCurrentTab('app-details');
      window.location.hash = `app/${slug}`;
    } else {
      setSelectedAppSlug(null);
      setCurrentTab(tab);
      window.location.hash = tab === 'home' ? '' : tab;
      
      // Refresh apps list when navigating to apps or home (in case admin made changes)
      if (tab === 'apps' || tab === 'home') {
        fetch('/api/apps?limit=50')
          .then((res) => res.json())
          .then((data) => {
            if (data.apps && data.apps.length > 0) {
              setApps(data.apps);
            }
          })
          .catch((err) => console.warn('Could not refresh apps:', err));
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectApp = (app: AppItem) => {
    navigateTo('app-details', app.slug);
  };

  const handleTriggerDownload = async (app: AppItem, platform: PlatformType = 'Windows', e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    // Call backend to record download count, then open Google Drive link
    try {
      const res = await fetch(`/api/download/${app.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });
      const data = await res.json();

      if (data.success && data.app?.downloadUrl) {
        // Open the Google Drive link in a new tab — exactly like a Discord invite button
        window.open(data.app.downloadUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert(data.message || 'Download link not available. Please contact support.');
      }
    } catch {
      alert('Could not reach the server. Please try again.');
    }
  };

  const currentApp = selectedAppSlug
    ? apps.find((a) => a.slug === selectedAppSlug) || apps[0]
    : null;

  const featuredApps = apps.filter((a) => a.isFeatured);
  const recentApps = apps.filter((a) => a.isRecentlyAdded);
  const popularApps = [...apps].sort((a, b) => b.downloadsCount - a.downloadsCount);

  if (currentTab === 'admin') {
    return (
      <AdminPanel onBackToStore={() => navigateTo('home')} />
    );
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#08090E] text-slate-100' : 'bg-slate-900 text-slate-100'}`}>
      {/* 1. Global Navigation matching screenshots */}
      <Navbar
        currentTab={currentTab}
        onNavigate={navigateTo}
        onOpenSearch={() => setIsSearchOpen(true)}
        isDark={isDark}
        onToggleTheme={() => setIsDark(!isDark)}
      />

      {/* 2. Main Body Content Switcher */}
      <main className="flex-1 w-full">
        {currentTab === 'home' && (
          <HomePage
            featuredApps={featuredApps}
            recentApps={recentApps}
            popularApps={popularApps}
            categories={categories}
            onSelectApp={handleSelectApp}
            onDownloadApp={(app, e) => handleTriggerDownload(app, 'Windows', e)}
            onNavigate={navigateTo}
            onSelectCategory={(catSlug) => {
              setSelectedCategorySlug(catSlug);
              navigateTo('apps');
            }}
          />
        )}

        {currentTab === 'apps' && (
          <AppsPage
            apps={apps}
            categories={categories}
            selectedCategory={selectedCategorySlug}
            onSelectCategory={setSelectedCategorySlug}
            onSelectApp={handleSelectApp}
            onDownloadApp={(app, e) => handleTriggerDownload(app, 'Windows', e)}
          />
        )}

        {currentTab === 'app-details' && currentApp && (
          <AppDetails
            app={currentApp}
            onBackToApps={() => navigateTo('apps')}
            onDownload={(app, plat) => handleTriggerDownload(app, plat || 'Windows')}
          />
        )}

        {currentTab === 'features' && (
          <FeaturesPage onExploreApps={() => navigateTo('apps')} />
        )}

        {currentTab === 'about' && (
          <AboutPage onExploreApps={() => navigateTo('apps')} />
        )}

        {currentTab === 'support' && <SupportPage />}

        {currentTab === 'contact' && <ContactPage />}
      </main>

      {/* 3. Global Footer */}
      <Footer onNavigate={navigateTo} />

      {/* 4. Global Search Modal (Ctrl+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectApp={handleSelectApp}
        apps={apps}
      />

      {/* 5. Download Progress & Google Drive Resolution Modal */}
      <DownloadModal
        app={downloadModalApp}
        platform={downloadPlatform}
        isOpen={isDownloadOpen}
        onClose={() => setIsDownloadOpen(false)}
      />
    </div>
  );
}

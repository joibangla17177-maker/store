import React, { useState, useEffect } from 'react';
import { AdminSidebar, AdminMenuTab } from './AdminSidebar';
import { AdminDashboard } from './AdminDashboard';
import { AdminApps, AdminAppItem } from './AdminApps';
import { AdminAddApp } from './AdminAddApp';
import { AdminFeatures } from './AdminFeatures';
import { AdminVersions } from './AdminVersions';
import { AdminCategories } from './AdminCategories';
import { AdminDownloads } from './AdminDownloads';
import { AdminSettings } from './AdminSettings';
import { AdminDiscordSettings } from './AdminDiscordSettings';
import { AdminUsers } from './AdminUsers';
import { AdminActivityLogs } from './AdminActivityLogs';
import { AdminLogin } from './AdminLogin';
import {
  INITIAL_ADMIN_APPS,
  INITIAL_ADMIN_FEATURES,
  INITIAL_ADMIN_VERSIONS,
  INITIAL_RECENT_ACTIVITIES,
} from '../../data/adminData';
import { INITIAL_CATEGORIES } from '../../data/initialData';
import { FeatureRecord, VersionRecord } from '../../types/admin';
import { Category } from '../../types';
import { Menu, X } from 'lucide-react';

// Remove AdminGoogleDrive import since we're removing Google Drive tab

interface AdminPanelProps {
  onBackToStore: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToStore }) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  // Admin panel state - must be declared before any conditional returns
  const [activeTab, setActiveTab] = useState<AdminMenuTab>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // App state
  const [appsList, setAppsList] = useState<AdminAppItem[]>(INITIAL_ADMIN_APPS);
  const [isAddingApp, setIsAddingApp] = useState(false);
  const [editingApp, setEditingApp] = useState<AdminAppItem | null>(null);

  // Features state
  const [featuresList, setFeaturesList] = useState<FeatureRecord[]>(INITIAL_ADMIN_FEATURES);

  // Versions state
  const [versionsList, setVersionsList] = useState<VersionRecord[]>(INITIAL_ADMIN_VERSIONS);

  // Categories state
  const [categoriesList, setCategoriesList] = useState<Category[]>(INITIAL_CATEGORIES);

  // Recent activity logs state
  const [recentActivities, setRecentActivities] = useState(INITIAL_RECENT_ACTIVITIES);

  // Load apps from backend on mount
  useEffect(() => {
    const loadAppsFromBackend = async () => {
      try {
        const response = await fetch('/api/admin/apps');
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.apps) {
            setAppsList(data.apps);
          }
        }
      } catch (err) {
        console.warn('Could not load apps from backend, using local data:', err);
      }
    };

    if (isAuthenticated) {
      loadAppsFromBackend();
    }
  }, [isAuthenticated]);

  // Check for existing session on mount
  useEffect(() => {
    const session = localStorage.getItem('forbiden_admin_session');
    if (session) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (email: string, password: string) => {
    setIsLoginLoading(true);
    setLoginError('');

    // Simulate authentication delay
    setTimeout(() => {
      // Simple demo authentication
      if (email === 'yanfortej@gmail.com' && password === 'ARIQrahman_17-11_2010') {
        // Store session in localStorage
        const sessionToken = btoa(`${email}:${Date.now()}`);
        localStorage.setItem('forbiden_admin_session', sessionToken);
        localStorage.setItem('forbiden_admin_email', email);
        
        setIsAuthenticated(true);
        setIsLoginLoading(false);
      } else {
        setLoginError('Invalid email or password.');
        setIsLoginLoading(false);
      }
    }, 800);
  };

  const handleLogout = () => {
    localStorage.removeItem('forbiden_admin_session');
    localStorage.removeItem('forbiden_admin_email');
    setIsAuthenticated(false);
    onBackToStore();
  };

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} isLoading={isLoginLoading} error={loginError} />;
  }

  // Dynamic calculated stats
  const totalApps = appsList.length;
  const publishedApps = appsList.filter((a) => a.status === 'Published').length;
  const draftApps = appsList.filter((a) => a.status === 'Draft').length;
  const totalDownloads = appsList.reduce((sum, a) => sum + a.downloads, 0);

  // App handlers
  const handleStartAddApp = () => {
    setEditingApp(null);
    setIsAddingApp(true);
  };

  const handleStartEditApp = (app: AdminAppItem) => {
    setEditingApp(app);
    setIsAddingApp(true);
  };

  const handleSaveApp = (appData: Partial<AdminAppItem>) => {
    if (editingApp) {
      // Update existing app
      const updateData = {
        id: editingApp.id,
        ...appData,
      };
      
      fetch('/api/admin/apps/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setAppsList((prev) =>
              prev.map((a) => (a.id === editingApp.id ? { ...a, ...appData } : a))
            );
            setRecentActivities((prev) => [
              {
                id: 'act-' + Date.now(),
                title: `${appData.name || editingApp.name} updated`,
                type: 'update',
                time: 'Just now',
                iconColor: '#22c55e',
              },
              ...prev.slice(0, 4),
            ]);
            setIsAddingApp(false);
            setEditingApp(null);
          } else {
            alert('Failed to update app: ' + (data.message || 'Unknown error'));
          }
        })
        .catch((err) => {
          console.error('Update error:', err);
          alert('Error updating app: ' + err.message);
        });
    } else {
      // Create new app
      const newAppData = {
        id: 'app-' + Math.random().toString(36).substring(2, 9),
        name: appData.name || 'Untitled App',
        slug: appData.slug || 'untitled-app',
        ...appData,
      };

      fetch('/api/admin/apps/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAppData),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          return res.json();
        })
        .then((data) => {
          if (data.success) {
            // Add to local state with the data we sent
            setAppsList((prev) => [
              {
                id: newAppData.id,
                name: newAppData.name,
                slug: newAppData.slug,
                version: newAppData.version || '1.0.0',
                price: newAppData.price || 0,
                status: newAppData.status || 'Draft',
                downloads: 0,
                category: newAppData.category || 'Business',
                shortDescription: newAppData.shortDescription || '',
                fullDescription: newAppData.fullDescription || '',
                platforms: newAppData.platforms || ['Windows'],
                iconColor: newAppData.iconColor,
                iconType: newAppData.iconType || 'chart',
                iconSourceType: newAppData.iconSourceType,
                iconFileId: newAppData.iconFileId,
                iconFileName: newAppData.iconFileName,
                iconMimeType: newAppData.iconMimeType,
                iconSize: newAppData.iconSize,
                iconUrl: newAppData.iconUrl,
                googleDriveFile: newAppData.googleDriveFile,
                googleDriveFolder: newAppData.googleDriveFolder,
              },
              ...prev,
            ]);
            setRecentActivities((prev) => [
              {
                id: 'act-' + Date.now(),
                title: `New app "${newAppData.name}" added`,
                type: 'add',
                time: 'Just now',
                iconColor: '#22c55e',
              },
              ...prev.slice(0, 4),
            ]);
            setIsAddingApp(false);
            setEditingApp(null);
          } else {
            alert('Failed to create app: ' + (data.message || 'Unknown error'));
          }
        })
        .catch((err) => {
          console.error('Create error:', err);
          alert('Error creating app: ' + err.message);
        });
    }
  };

  const handleDeleteApp = (appId: string) => {
    // Optimistically remove from UI first
    const appToDelete = appsList.find(a => a.id === appId);
    if (!appToDelete) {
      alert('Could not find app to delete');
      return;
    }
    
    setAppsList((prev) => prev.filter((a) => a.id !== appId));
    
    // Then call API to persist deletion
    // URL encode the appId in case it contains special characters
    const encodedAppId = encodeURIComponent(appId);
    
    fetch(`/api/admin/apps/${encodedAppId}/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || `HTTP ${res.status}`);
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log('Delete response:', data);
        if (data.success) {
          setRecentActivities((prev) => [
            {
              id: 'act-' + Date.now(),
              title: `"${appToDelete.name}" deleted permanently`,
              type: 'delete',
              time: 'Just now',
              iconColor: '#ef4444',
            },
            ...prev.slice(0, 4),
          ]);
        } else {
          // Revert the optimistic delete if API fails
          setAppsList((prev) => [...prev, appToDelete]);
          console.error('Delete failed:', data.message);
          alert('Failed to delete app: ' + (data.message || 'Unknown error'));
        }
      })
      .catch((err) => {
        // Revert the optimistic delete if request fails
        setAppsList((prev) => [...prev, appToDelete]);
        console.error('Delete error:', err);
        alert('Error deleting app: ' + err.message);
      });
  };

  const handleToggleAppStatus = (appId: string) => {
    // Call API to toggle status in backend
    fetch(`/api/admin/apps/${appId}/toggle-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.app) {
          // Update local state with the response
          setAppsList((prev) =>
            prev.map((a) => (a.id === appId ? { ...a, status: data.app.status } : a))
          );
        }
      })
      .catch((err) => console.error('Failed to toggle status:', err));
  };

  // Feature handlers
  const handleAddFeature = (featData: Omit<FeatureRecord, 'id'>) => {
    const newFeat: FeatureRecord = {
      id: 'feat-' + Math.random().toString(36).substring(2, 9),
      ...featData,
    };
    setFeaturesList((prev) => [newFeat, ...prev]);
  };

  const handleEditFeature = (feat: FeatureRecord) => {
    setFeaturesList((prev) =>
      prev.map((f) => (f.id === feat.id ? feat : f))
    );
  };

  const handleDeleteFeature = (id: string) => {
    setFeaturesList((prev) => prev.filter((f) => f.id !== id));
  };

  const handleToggleFeatureStatus = (id: string) => {
    setFeaturesList((prev) =>
      prev.map((f) => {
        if (f.id === id) {
          return {
            ...f,
            status: f.status === 'Published' ? 'Draft' : 'Published',
          };
        }
        return f;
      })
    );
  };

  // Versions handlers
  const handleAddVersion = (vData: Omit<VersionRecord, 'id'>) => {
    const newVer: VersionRecord = {
      id: 'ver-' + Math.random().toString(36).substring(2, 9),
      ...vData,
    };
    setVersionsList((prev) => [newVer, ...prev]);
  };

  const handleDeleteVersion = (id: string) => {
    setVersionsList((prev) => prev.filter((v) => v.id !== id));
  };

  const handleToggleVersionStatus = (id: string) => {
    setVersionsList((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          return {
            ...v,
            status: v.status === 'Published' ? 'Draft' : 'Published',
          };
        }
        return v;
      })
    );
  };

  // Category handlers
  const handleAddCategory = (catData: Partial<Category>) => {
    const newCat: Category = {
      id: catData.id || 'cat-' + Math.random().toString(36).substring(2, 9),
      name: catData.name || 'New Category',
      slug: catData.slug || 'new-cat',
      description: catData.description || '',
      icon: catData.icon || 'Folder',
      appCount: 0,
      displayOrder: categoriesList.length + 1,
    };
    setCategoriesList((prev) => [...prev, newCat]);
  };

  const handleDeleteCategory = (id: string) => {
    setCategoriesList((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div id="forbiden-admin-panel" className="min-h-screen bg-[#08090E] text-slate-100 flex flex-col md:flex-row antialiased">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0B0D17] border-b border-slate-800/60 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-800 to-fuchsia-500 p-0.5">
            <div className="w-full h-full bg-[#0B0D17] rounded-[6px] flex items-center justify-center font-black text-purple-400">
              F
            </div>
          </div>
          <span className="font-bold text-white tracking-wider font-mono">FORBIDEN ADMIN</span>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800/60"
        >
          {isMobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Desktop Sidebar & Mobile Drawer */}
      <div className={`${isMobileSidebarOpen ? 'block fixed inset-0 z-50' : 'hidden'} md:block md:static`}>
        {isMobileSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 md:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}
        <div className="relative z-10">
          <AdminSidebar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              setIsAddingApp(false);
              setIsMobileSidebarOpen(false);
            }}
            onLogout={handleLogout}
            onViewStore={onBackToStore}
          />
        </div>
      </div>

      {/* Main Admin Viewport */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Dashboard Tab (Image 1) */}
          {activeTab === 'dashboard' && (
            <AdminDashboard
              stats={{
                totalApps,
                publishedApps,
                draftApps,
                totalDownloads,
              }}
              recentActivities={recentActivities}
              onNavigateToApps={() => setActiveTab('apps')}
            />
          )}

          {/* Applications Tab (Images 2, 3, 4) */}
          {activeTab === 'apps' && (
            <>
              {isAddingApp ? (
                <AdminAddApp
                  initialApp={editingApp}
                  onBack={() => {
                    setIsAddingApp(false);
                    setEditingApp(null);
                  }}
                  onSave={handleSaveApp}
                />
              ) : (
                <AdminApps
                  apps={appsList}
                  onAddNewApp={handleStartAddApp}
                  onEditApp={handleStartEditApp}
                  onViewApp={(app) => {
                    // Navigate to public app details
                    window.location.hash = `app/${app.slug}`;
                    onBackToStore();
                  }}
                  onDeleteApp={handleDeleteApp}
                  onToggleStatus={handleToggleAppStatus}
                />
              )}
            </>
          )}

          {/* Features Tab (Image 5) */}
          {activeTab === 'features' && (
            <AdminFeatures
              features={featuresList}
              onAddFeature={handleAddFeature}
              onEditFeature={handleEditFeature}
              onDeleteFeature={handleDeleteFeature}
              onToggleStatus={handleToggleFeatureStatus}
            />
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <AdminVersions
              versions={versionsList}
              onAddVersion={handleAddVersion}
              onDeleteVersion={handleDeleteVersion}
              onToggleStatus={handleToggleVersionStatus}
            />
          )}

          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <AdminCategories
              categories={categoriesList}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && <AdminDownloads />}

          {/* Settings Tab */}
          {activeTab === 'settings' && <AdminSettings />}

          {/* Discord Settings Tab */}
          {activeTab === 'discord' && <AdminDiscordSettings />}

          {/* Users Tab */}
          {activeTab === 'users' && <AdminUsers />}

          {/* Activity Logs Tab */}
          {activeTab === 'activity-logs' && <AdminActivityLogs />}
        </div>
      </main>
    </div>
  );
};

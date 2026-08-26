import fs from 'fs';
import path from 'path';
import { AppItem, Category, SupportTicketRequest, SupportTicketResponse } from '../src/types';
import { INITIAL_APPS, INITIAL_CATEGORIES, STORE_SETTINGS } from '../src/data/initialData';

export interface DownloadLog {
  id: string;
  appId: string;
  appSlug: string;
  version: string;
  platform: string;
  timestamp: string;
  ipHash: string;
  userAgent: string;
}

export interface SupportTicketRecord extends SupportTicketRequest {
  id: string;
  createdAt: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

class StoreDatabase {
  private apps: AppItem[] = [];
  private categories: Category[] = [];
  private downloadLogs: DownloadLog[] = [];
  private supportTickets: SupportTicketRecord[] = [];
  private dataFilePath: string;
  private discordInviteLink: string = 'https://discord.gg/forbiden';

  constructor() {
    this.dataFilePath = path.join(process.cwd(), 'store_data.json');
    this.init();
  }

  private init() {
    try {
      if (fs.existsSync(this.dataFilePath)) {
        const raw = fs.readFileSync(this.dataFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        this.apps = parsed.apps || INITIAL_APPS;
        this.categories = parsed.categories || INITIAL_CATEGORIES;
        this.downloadLogs = parsed.downloadLogs || [];
        this.supportTickets = parsed.supportTickets || [];
        this.discordInviteLink = parsed.discordInviteLink || 'https://discord.gg/forbiden';
      } else {
        this.apps = JSON.parse(JSON.stringify(INITIAL_APPS));
        this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
        this.save();
      }
    } catch (err) {
      console.warn('Could not read store_data.json, using defaults:', err);
      this.apps = JSON.parse(JSON.stringify(INITIAL_APPS));
      this.categories = JSON.parse(JSON.stringify(INITIAL_CATEGORIES));
    }
  }

  private save() {
    try {
      fs.writeFileSync(
        this.dataFilePath,
        JSON.stringify(
          {
            apps: this.apps,
            categories: this.categories,
            downloadLogs: this.downloadLogs,
            supportTickets: this.supportTickets,
            discordInviteLink: this.discordInviteLink,
            updatedAt: new Date().toISOString(),
          },
          null,
          2
        )
      );
    } catch (err) {
      console.error('Failed to persist store_data.json:', err);
    }
  }

  public getApps(filters?: {
    category?: string;
    platform?: string;
    search?: string;
    sort?: string;
    limit?: number;
    offset?: number;
    featuredOnly?: boolean;
    popularOnly?: boolean;
  }) {
    let list = [...this.apps].filter((app) => app.status === 'Published');

    if (filters?.category && filters.category !== 'all') {
      const catLower = filters.category.toLowerCase();
      list = list.filter(
        (a) =>
          a.categorySlug.toLowerCase() === catLower ||
          a.category.toLowerCase() === catLower
      );
    }

    if (filters?.platform && filters.platform !== 'all') {
      const platLower = filters.platform.toLowerCase();
      list = list.filter((a) =>
        a.platforms.some((p) => p.toLowerCase() === platLower)
      );
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.shortDescription.toLowerCase().includes(q) ||
          a.fullDescription.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          a.features.some((f) => f.toLowerCase().includes(q))
      );
    }

    if (filters?.featuredOnly) {
      list = list.filter((a) => a.isFeatured);
    }

    if (filters?.popularOnly) {
      list = list.filter((a) => a.isPopular);
    }

    // Sorting
    switch (filters?.sort) {
      case 'popular':
        list.sort((a, b) => b.downloadsCount - a.downloadsCount);
        break;
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        list.sort((a, b) => a.sortOrder - b.sortOrder);
        break;
    }

    const total = list.length;
    const offset = filters?.offset || 0;
    const limit = filters?.limit || 50;
    const items = list.slice(offset, offset + limit);

    return { items, total };
  }

  public getAppBySlug(slug: string): AppItem | null {
    const app = this.apps.find(
      (a) => a.slug.toLowerCase() === slug.toLowerCase() && a.status === 'Published'
    );
    return app || null;
  }

  public getCategories(): Category[] {
    return this.categories;
  }

  public recordDownload(
    appSlug: string,
    meta?: { platform?: string; userAgent?: string; ip?: string }
  ) {
    const app = this.apps.find((a) => a.slug.toLowerCase() === appSlug.toLowerCase());
    if (app) {
      app.downloadsCount += 1;
      const log: DownloadLog = {
        id: 'dl-' + Math.random().toString(36).substring(2, 9),
        appId: app.id,
        appSlug: app.slug,
        version: app.currentVersion,
        platform: meta?.platform || app.platforms[0] || 'Windows',
        timestamp: new Date().toISOString(),
        ipHash: meta?.ip ? 'ip-' + Buffer.from(meta.ip).toString('base64').substring(0, 8) : 'anon',
        userAgent: (meta?.userAgent || '').substring(0, 100),
      };
      this.downloadLogs.push(log);
      this.save();
      return { app, log };
    }
    return null;
  }

  public createSupportTicket(data: SupportTicketRequest): SupportTicketResponse {
    const ticketId = 'TKT-' + Math.floor(100000 + Math.random() * 900000);
    const record: SupportTicketRecord = {
      id: ticketId,
      ...data,
      createdAt: new Date().toISOString(),
      status: 'Open',
    };
    this.supportTickets.push(record);
    this.save();
    return {
      success: true,
      ticketId,
      message: `Support ticket #${ticketId} created successfully. Our engineering team will review it shortly.`,
    };
  }

  public getSettings() {
    // Return stored settings with Discord link if available
    return {
      ...STORE_SETTINGS,
      discordInviteLink: this.discordInviteLink,
    };
  }

  public updateSettings(updates: { discordInviteLink?: string }) {
    if (updates.discordInviteLink) {
      this.discordInviteLink = updates.discordInviteLink;
      this.save();
    }
    
    return {
      success: true,
      message: 'Settings updated',
      settings: this.getSettings(),
    };
  }

  public deleteApp(appId: string) {
    const index = this.apps.findIndex((a) => a.id === appId);
    if (index === -1) {
      return { success: false, message: 'App not found' };
    }
    this.apps.splice(index, 1);
    this.save();
    return { success: true, message: 'App deleted' };
  }

  public toggleAppStatus(appId: string) {
    const app = this.apps.find((a) => a.id === appId);
    if (!app) {
      return { success: false, message: 'App not found' };
    }
    // Toggle between Published and Draft
    app.status = (app.status === 'Published' || app.status === 'Hidden' || app.status === 'Archived') 
      ? 'Draft' 
      : 'Published';
    this.save();
    return { success: true, message: 'Status updated', app };
  }

  public getAdminApps() {
    // Return all apps (including drafts) for admin panel
    return this.apps;
  }

  public getStats() {
    const totalApps = this.apps.filter((a) => a.status === 'Published').length;
    const totalDownloads = this.apps.reduce((acc, a) => acc + a.downloadsCount, 0);
    const totalCategories = this.categories.length;
    return { totalApps, totalDownloads, totalCategories, lastUpdated: new Date().toISOString() };
  }

  public saveApp(appData: any) {
    // Check if app exists (update) or create new
    const existingIndex = this.apps.findIndex((a) => a.id === appData.id);
    
    // Extract file ID from Google Drive URL if it's a full URL
    let googleDriveFileId = appData.googleDriveFile || '';
    if (googleDriveFileId && googleDriveFileId.includes('drive.google.com')) {
      // Extract file ID from URL
      const fileIdMatch = googleDriveFileId.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        googleDriveFileId = fileIdMatch[1];
      }
    }
    
    if (existingIndex !== -1) {
      // Update existing app
      const updatedApp = { 
        ...this.apps[existingIndex], 
        ...appData,
        googleDriveFileId: googleDriveFileId, // Override with extracted ID
        uploadedFileData: appData.uploadedFileData, // Store uploaded file as base64
        uploadedFileName: appData.uploadedFileName,
        uploadedFileSize: appData.uploadedFileSize,
      };
      this.apps[existingIndex] = updatedApp;
      this.save();
      return { success: true, message: 'App updated', app: this.apps[existingIndex] };
    } else {
      // Create new app with required fields
      const newApp: AppItem = {
        id: appData.id || 'app-' + Math.random().toString(36).substring(2, 9),
        slug: appData.slug || appData.name?.toLowerCase().replace(/\s+/g, '-'),
        name: appData.name || 'Untitled App',
        category: appData.category || 'Utilities',
        categorySlug: (appData.category || 'Utilities').toLowerCase(),
        shortDescription: appData.shortDescription || '',
        fullDescription: appData.fullDescription || '',
        price: parseFloat(appData.price) || 0,
        currency: appData.currency || 'USD',
        currentVersion: appData.version || '1.0.0',
        releaseDate: new Date().toISOString(),
        developer: appData.developer || 'FORBIDEN',
        publisher: appData.publisher || 'FORBIDEN',
        iconType: appData.iconType || 'chart',
        iconColor: appData.iconColor,
        iconUrl: appData.iconUrl,
        iconSourceType: appData.iconSourceType,
        iconFileId: appData.iconFileId,
        iconFileName: appData.iconFileName,
        iconMimeType: appData.iconMimeType,
        iconSize: appData.iconSize,
        platforms: appData.platforms || ['Windows'],
        status: (appData.status as any) || 'Draft',
        downloadsCount: 0,
        isFeatured: appData.isFeatured || false,
        isPopular: appData.isPopular || false,
        isRecentlyAdded: true,
        sortOrder: this.apps.length + 1,
        systemRequirements: appData.systemRequirements || {
          os: 'Windows 10 or later',
          memory: '4 GB RAM',
          storage: '500 MB',
        },
        features: appData.features || [],
        screenshots: appData.screenshots || [],
        downloadFileName: appData.downloadFileName || `${appData.name}-Setup.exe`,
        downloadFileSize: appData.downloadFileSize || '50 MB',
        googleDriveFileId: googleDriveFileId, // Use extracted ID
        guaranteeText: appData.guaranteeText || '30-day money-back guarantee',
        // Store uploaded file data
        uploadedFileData: appData.uploadedFileData,
        uploadedFileName: appData.uploadedFileName,
        uploadedFileSize: appData.uploadedFileSize,
      };
      this.apps.push(newApp);
      this.save();
      return { success: true, message: 'App created', app: newApp };
    }
  }
}

export const storeDb = new StoreDatabase();

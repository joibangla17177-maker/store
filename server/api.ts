import { Router, Request, Response } from 'express';
import { storeDb } from './db';
import { GoogleDriveService } from './googleDrive';
import { PlatformType } from '../src/types';

export const apiRouter = Router();

// Health check
apiRouter.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'FORBIDEN Store Engine', timestamp: new Date().toISOString() });
});

// Store Settings
apiRouter.get('/settings', (req: Request, res: Response) => {
  const settings = storeDb.getSettings();
  res.json({ success: true, settings });
});

// Admin: Update store settings
apiRouter.post('/admin/settings/update', (req: Request, res: Response) => {
  const { discordInviteLink } = req.body;
  
  if (!discordInviteLink) {
    return res.status(400).json({ success: false, message: 'Discord invite link is required' });
  }
  
  // Update settings in the database
  const result = storeDb.updateSettings({ discordInviteLink });
  
  if (!result.success) {
    return res.status(400).json(result);
  }
  
  res.json({ success: true, message: 'Settings updated successfully', settings: result.settings });
});

// Stats overview
apiRouter.get('/stats', (req: Request, res: Response) => {
  const stats = storeDb.getStats();
  res.json({ success: true, stats });
});

// Categories
apiRouter.get('/categories', (req: Request, res: Response) => {
  const categories = storeDb.getCategories();
  res.json({ success: true, categories });
});

// Featured apps for home page
apiRouter.get('/featured', (req: Request, res: Response) => {
  const { items } = storeDb.getApps({ featuredOnly: true, limit: 10 });
  res.json({ success: true, apps: items });
});

// Popular apps
apiRouter.get('/popular', (req: Request, res: Response) => {
  const { items } = storeDb.getApps({ popularOnly: true, sort: 'popular', limit: 6 });
  res.json({ success: true, apps: items });
});

// Recently added apps
apiRouter.get('/recent', (req: Request, res: Response) => {
  const { items } = storeDb.getApps({ sort: 'newest', limit: 8 });
  res.json({ success: true, apps: items });
});

// List applications with full filtering & search
apiRouter.get('/apps', (req: Request, res: Response) => {
  const category = (req.query.category as string) || 'all';
  const platform = (req.query.platform as string) || 'all';
  const search = (req.query.search as string) || '';
  const sort = (req.query.sort as string) || 'newest';
  const page = parseInt((req.query.page as string) || '1', 10);
  const limit = parseInt((req.query.limit as string) || '12', 10);
  const offset = (page - 1) * limit;

  const result = storeDb.getApps({
    category,
    platform,
    search,
    sort,
    limit,
    offset,
  });

  const totalPages = Math.ceil(result.total / limit) || 1;

  res.json({
    success: true,
    apps: result.items,
    pagination: {
      currentPage: page,
      totalPages,
      totalCount: result.total,
      limit,
    },
  });
});

// Single application details by slug
apiRouter.get('/apps/:slug', (req: Request, res: Response) => {
  const slug = req.params.slug;
  const app = storeDb.getAppBySlug(slug);

  if (!app) {
    return res.status(404).json({ success: false, message: `Application '${slug}' not found.` });
  }

  res.json({ success: true, app });
});

// Initiate secure download & log event
apiRouter.post('/download/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const platform = (req.body.platform as PlatformType) || 'Windows';
  const app = storeDb.getAppBySlug(slug);

  if (!app) {
    return res.status(404).json({ success: false, message: `Application '${slug}' not found.` });
  }

  // Record download count and anonymous log
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'Unknown Browser';

  storeDb.recordDownload(slug, {
    platform,
    ip: clientIp,
    userAgent,
  });

  // Check if uploaded file exists (priority 1)
  if ((app as any).uploadedFileData && typeof (app as any).uploadedFileData === 'string') {
    const fileName = app.downloadFileName || `${app.name}-Setup.exe`;
    console.log(`[DOWNLOAD] User initiated download for app: ${slug} (from uploaded file)`);
    return res.json({
      success: true,
      app: {
        id: app.id,
        name: app.name,
        slug: app.slug,
        version: app.currentVersion,
        platform: platform,
        fileName: fileName,
        fileSize: (app as any).uploadedFileSize || app.downloadFileSize,
        downloadUrl: `/api/download/file/${slug}?type=uploaded`,
        checksumSha256: undefined,
      },
      trackingId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
      message: 'Download initiated from uploaded file',
    });
  }

  // Check if Google Drive file ID is provided (priority 2)
  if (!app.googleDriveFileId || app.googleDriveFileId.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'No download file provided. Please upload a file or provide a Google Drive link.',
    });
  }

  const fileName = app.downloadFileName || `${app.name}-Setup.exe`;
  console.log(`[DOWNLOAD] User initiated download for app: ${slug} (from Google Drive)`);

  // Use the FULL Google Drive share link as-is (don't extract ID)
  let downloadUrl = app.googleDriveFileId.trim();
  
  // If it's already a full link, use it directly
  if (downloadUrl.includes('drive.google.com') || downloadUrl.includes('docs.google.com')) {
    // It's a full link - use as-is for redirect
    // Nothing to do, already correct
  } else {
    // It's just a file ID, construct the URL
    downloadUrl = `https://drive.google.com/file/d/${downloadUrl}/view?usp=sharing`;
  }

  res.json({
    success: true,
    app: {
      id: app.id,
      name: app.name,
      slug: app.slug,
      version: app.currentVersion,
      platform: platform,
      fileName: fileName,
      fileSize: app.downloadFileSize || 'Unknown',
      downloadUrl: downloadUrl,
      checksumSha256: undefined,
    },
    trackingId: `${Date.now()}-${Math.random().toString(36).substring(7)}`,
    message: 'Redirecting to Google Drive download',
  });
});

// Stream or provide direct installer file download
apiRouter.get('/download/file/:slug', async (req: Request, res: Response) => {
  const slug = req.params.slug;
  const app = storeDb.getAppBySlug(slug);

  if (!app) {
    return res.status(404).json({ success: false, message: 'Application not found' });
  }

  const fileName = app.downloadFileName || `${app.name}-Setup.exe`;

  console.log(`[DOWNLOAD] Starting download: ${fileName}`);

  try {
    // Check if there's an uploaded file (stored in database)
    if ((app as any).uploadedFileData && typeof (app as any).uploadedFileData === 'string') {
      console.log(`[DOWNLOAD] Serving uploaded file from database`);
      
      // The file is stored as base64 data URL
      const dataUrl = (app as any).uploadedFileData;
      const base64Data = dataUrl.split(',')[1] || dataUrl;
      
      try {
        const buffer = Buffer.from(base64Data, 'base64');
        
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        res.setHeader('Content-Length', buffer.length);
        
        console.log(`[DOWNLOAD] Streaming ${(buffer.length / 1024 / 1024).toFixed(2)} MB from database`);
        
        res.send(buffer);
        return;
      } catch (err) {
        console.error(`[DOWNLOAD] Error processing uploaded file: ${err}`);
        // Fall through to Google Drive if uploaded file fails
      }
    }

    // Fall back to Google Drive if no uploaded file
    if (!app.googleDriveFileId || app.googleDriveFileId.trim() === '') {
      return res.status(400).json({ 
        success: false, 
        message: 'No download link provided by admin.' 
      });
    }

    const fileId = app.googleDriveFileId.trim();

    console.log(`[DOWNLOAD] No uploaded file, using Google Drive: ${fileId}`);

    // Multiple URLs to try - each with different approaches
    const downloadUrls = [
      // Direct usercontent download - best for large files, bypasses virus scan
      `https://drive.usercontent.google.com/download?id=${fileId}&export=download&confirm=yes&uuid=${Date.now()}`,
      `https://drive.google.com/uc?id=${fileId}&export=download&confirm=t`,
      `https://docs.google.com/uc?id=${fileId}&export=download&confirm=t`,
    ];

    let lastError = null;

    for (const url of downloadUrls) {
      try {
        console.log(`[DOWNLOAD] Attempting: ${url.split('?')[0]}...`);

        // Increased timeout to 10 minutes for large files
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 600000);

        const response = await fetch(url, {
          method: 'GET',
          signal: controller.signal,
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
            'Accept': '*/*',
            'Accept-Language': 'en-US,en;q=0.9',
            'Referer': 'https://drive.google.com/',
            'Accept-Encoding': 'identity',
          },
          redirect: 'follow',
        });

        clearTimeout(timeoutId);

        const contentType = response.headers.get('content-type') || '';
        const contentLength = response.headers.get('content-length');

        console.log(`[DOWNLOAD] Response: ${response.status}, Type: ${contentType.substring(0, 50)}, Length: ${contentLength}`);

        // Reject HTML responses (virus scan warnings)
        if (contentType.includes('text/html') || !response.ok || !response.body) {
          console.log(`[DOWNLOAD] Skipping - invalid response`);
          continue;
        }

        // SUCCESS - Stream the file
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
        
        if (contentLength) {
          res.setHeader('Content-Length', contentLength);
          console.log(`[DOWNLOAD] Streaming ${(parseInt(contentLength) / 1024 / 1024).toFixed(2)} MB`);
        }

        // Pipe the response body directly to the client
        const { Readable } = require('stream');
        const readable = Readable.fromWeb(response.body as any);

        readable.on('error', (err: any) => {
          console.error(`[DOWNLOAD] Stream error: ${err.message}`);
          if (!res.writableEnded) {
            res.writeHead(500);
            res.end();
          }
        });

        res.on('error', (err: any) => {
          console.error(`[DOWNLOAD] Response error: ${err.message}`);
          readable.destroy();
        });

        readable.pipe(res);
        return; // SUCCESS
      } catch (err: any) {
        lastError = err;
        console.error(`[DOWNLOAD] URL failed: ${err.message}`);
        continue;
      }
    }

    // All URLs exhausted
    console.error(`[DOWNLOAD] All URLs failed. Last error: ${lastError?.message}`);
    if (!res.headersSent) {
      res.status(502).json({
        success: false,
        message: 'Could not download from Google Drive. Make sure the file is publicly shared.',
      });
    }
  } catch (error: any) {
    console.error('[DOWNLOAD] Fatal error:', error?.message || error);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: 'Download error. Please try again.',
      });
    }
  }
});

// Support ticket submission
apiRouter.post('/support', (req: Request, res: Response) => {
  const { name, email, subject, appSlug, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your name, email, and inquiry details.',
    });
  }

  const response = storeDb.createSupportTicket({
    name,
    email,
    subject: subject || 'General Inquiry',
    appSlug,
    message,
  });

  res.json(response);
});

// Admin: Validate Google Drive icon URL or File ID
apiRouter.post('/admin/validate-drive-icon', async (req: Request, res: Response) => {
  const { urlOrId } = req.body;

  if (!urlOrId || typeof urlOrId !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Invalid Google Drive link.',
    });
  }

  const result = await GoogleDriveService.validateDriveIcon(urlOrId);

  if (!result.success) {
    return res.status(400).json(result);
  }

  res.json(result);
});

// Serve / proxy Google Drive icon safely without exposing credentials
apiRouter.get('/drive/icon/:fileId', async (req: Request, res: Response) => {
  const fileId = req.params.fileId;
  if (!fileId) {
    return res.status(400).send('File ID required');
  }

  try {
    const { buffer, mimeType } = await GoogleDriveService.getDriveIconBuffer(fileId);
    
    // Set CORS and cache headers for proper Vercel deployment
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Cache-Control', 'public, max-age=86400, immutable');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Content-Length', buffer.length);
    
    res.send(buffer);
  } catch (err) {
    res.status(500).setHeader('Content-Type', 'text/plain').send('Icon processing failed');
  }
});

// Admin: Get all apps (including drafts) for admin panel
// NOTE: must be defined BEFORE /:appId routes to prevent 'save' being matched as an appId
apiRouter.get('/admin/apps', (req: Request, res: Response) => {
  const apps = storeDb.getAdminApps();
  const adminApps = apps.map((app) => ({
    id: app.id,
    name: app.name,
    slug: app.slug,
    version: app.currentVersion,
    price: app.price,
    status: app.status === 'Hidden' || app.status === 'Archived' ? 'Draft' : app.status,
    downloads: app.downloadsCount,
    category: app.category,
    shortDescription: app.shortDescription,
    fullDescription: app.fullDescription,
    platforms: app.platforms,
    googleDriveFile: app.googleDriveFileId,
    googleDriveFolder: '',
    showOnStore: true,
    iconColor: app.iconColor,
    iconType: app.iconType,
    iconSourceType: app.iconSourceType,
    iconFileId: app.iconFileId,
    iconFileName: app.iconFileName,
    iconMimeType: app.iconMimeType,
    iconSize: app.iconSize,
    iconUrl: app.iconUrl,
  }));
  res.json({ success: true, apps: adminApps });
});

// Admin: Save/Create/Update app
apiRouter.post('/admin/apps/save', (req: Request, res: Response) => {
  try {
    const appData = req.body;
    
    if (!appData.name || !appData.slug) {
      return res.status(400).json({ 
        success: false, 
        message: 'App name and slug are required' 
      });
    }

    const result = storeDb.saveApp(appData);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    // Ensure we return a clean JSON-serializable response
    res.json({
      success: true,
      message: result.message,
      app: {
        id: result.app.id,
        name: result.app.name,
        slug: result.app.slug,
        status: result.app.status,
      }
    });
  } catch (err) {
    console.error('Error saving app:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error: ' + (err instanceof Error ? err.message : 'Unknown error')
    });
  }
});


// Admin: Delete an app
// NOTE: defined AFTER /admin/apps/save to prevent 'save' being captured as :appId
apiRouter.post('/admin/apps/:appId/delete', (req: Request, res: Response) => {
  let appId = req.params.appId;
  try {
    appId = decodeURIComponent(appId);
  } catch (err) {
    // use as-is if decode fails
  }

  if (!appId) {
    return res.status(400).json({ success: false, message: 'App ID is required' });
  }

  console.log(`[DELETE] Attempting to delete app with ID: ${appId}`);
  const result = storeDb.deleteApp(appId);

  if (!result.success) {
    console.log(`[DELETE] Failed: ${result.message} for ID: ${appId}`);
    return res.status(404).json({ success: false, message: result.message });
  }

  console.log(`[DELETE] Successfully deleted app: ${appId}`);
  res.json({ success: true, message: 'App deleted successfully' });
});

// Admin: Toggle app status (Published/Draft)
// NOTE: defined AFTER /admin/apps/save to prevent 'save' being captured as :appId
apiRouter.post('/admin/apps/:appId/toggle-status', (req: Request, res: Response) => {
  const appId = req.params.appId;
  const result = storeDb.toggleAppStatus(appId);

  if (!result.success) {
    return res.status(404).json({ success: false, message: result.message });
  }

  res.json({ success: true, message: 'App status updated', app: result.app });
});

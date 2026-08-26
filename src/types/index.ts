export type PlatformType = 'Windows' | 'macOS' | 'Linux' | 'Android';

export type AppStatus = 'Published' | 'Draft' | 'Hidden' | 'Archived';

export interface SystemRequirements {
  os: string;
  processor?: string;
  memory: string;
  storage: string;
  graphics?: string;
  architecture?: string;
}

export interface AppVersion {
  id: string;
  appId: string;
  versionNumber: string;
  releaseDate: string;
  releaseNotes: string[];
  platform: PlatformType;
  fileName: string;
  fileSize: string;
  googleDriveFileId: string;
  isLatest: boolean;
  status: AppStatus;
}

export interface AppFeature {
  id: string;
  appId: string;
  name: string;
  description: string;
  icon?: string;
}

export interface AppScreenshot {
  id: string;
  appId: string;
  title: string;
  description?: string;
  imageUrl: string;
  sortOrder: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  appCount: number;
  displayOrder: number;
}

export interface AppItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  currency: string;
  currentVersion: string;
  releaseDate: string;
  developer: string;
  publisher: string;
  iconType: 'chart' | 'shield' | 'database' | 'cloud' | 'speedometer' | 'code' | 'lock' | 'cpu';
  iconColor?: string;
  iconUrl?: string;
  iconSourceType?: 'upload' | 'google_drive';
  iconFileId?: string;
  iconFileName?: string;
  iconMimeType?: string;
  iconSize?: string;
  platforms: PlatformType[];
  status: AppStatus;
  downloadsCount: number;
  isFeatured: boolean;
  isPopular: boolean;
  isRecentlyAdded: boolean;
  sortOrder: number;
  systemRequirements: SystemRequirements;
  features: string[];
  detailedFeatures?: AppFeature[];
  screenshots: string[];
  downloadFileName: string;
  downloadFileSize: string;
  googleDriveFileId: string;
  guaranteeText?: string;
  // ZIP file upload support
  uploadedFileData?: string; // Base64 encoded file
  uploadedFileName?: string; // Original filename
  uploadedFileSize?: string; // File size display
}

export interface DownloadResponse {
  success: boolean;
  app: {
    id: string;
    name: string;
    slug: string;
    version: string;
    platform: PlatformType;
    fileName: string;
    fileSize: string;
    downloadUrl: string;
    checksumSha256?: string;
  };
  trackingId: string;
  message: string;
}

export interface SupportTicketRequest {
  name: string;
  email: string;
  subject: string;
  appSlug?: string;
  message: string;
}

export interface SupportTicketResponse {
  success: boolean;
  ticketId: string;
  message: string;
}

export interface AdminStat {
  totalApps: number;
  publishedApps: number;
  draftApps: number;
  totalDownloads: number;
}

export interface ActivityItem {
  id: string;
  title: string;
  type: 'update' | 'add' | 'publish' | 'version' | 'backup';
  time: string;
  iconColor: string;
}

export interface FeatureRecord {
  id: string;
  name: string;
  appId: string;
  appName: string;
  version: string;
  status: 'Published' | 'Draft';
}

export interface VersionRecord {
  id: string;
  appId: string;
  appName: string;
  versionNumber: string;
  releaseDate: string;
  platform: string;
  fileSize: string;
  downloadsCount: number;
  status: 'Published' | 'Draft';
  googleDriveFileId?: string;
}

export interface DownloadActivityRecord {
  id: string;
  appName: string;
  version: string;
  platform: string;
  ip: string;
  timestamp: string;
  status: 'Completed' | 'In Progress';
}

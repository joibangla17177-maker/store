import { ActivityItem, FeatureRecord, VersionRecord } from '../types/admin';

export const INITIAL_ADMIN_STATS = {
  totalApps: 0,
  publishedApps: 0,
  draftApps: 0,
  totalDownloads: 0,
};

export const INITIAL_RECENT_ACTIVITIES: ActivityItem[] = [];

export const CHART_MONTH_DATA = [
  { day: 'Mon', value: 0, label: '0' },
  { day: 'Tue', value: 0, label: '0' },
  { day: 'Wed', value: 0, label: '0' },
  { day: 'Thu', value: 0, label: '0' },
  { day: 'Fri', value: 0, label: '0' },
  { day: 'Sat', value: 0, label: '0' },
  { day: 'Sun', value: 0, label: '0' },
];

// Empty demo apps array - no demo data
export const INITIAL_ADMIN_APPS = [];

// Empty features array - no demo data
export const INITIAL_ADMIN_FEATURES: FeatureRecord[] = [];

// Empty versions array - no demo data
export const INITIAL_ADMIN_VERSIONS: VersionRecord[] = [];

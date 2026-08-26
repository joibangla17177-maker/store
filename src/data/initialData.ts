import { AppItem, Category } from '../types';

// Asset paths
const HERO_BG = '/src/assets/images/forbiden_hero_bg_1787508231109.jpg';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'cat-business',
    name: 'Business',
    slug: 'business',
    description: 'Enterprise resource management, financial accounting, and revenue tracking software.',
    icon: 'Briefcase',
    appCount: 0,
    displayOrder: 1,
  },
  {
    id: 'cat-utilities',
    name: 'Utilities',
    slug: 'utilities',
    description: 'High-performance system tuning, automated backups, and file management tools.',
    icon: 'Wrench',
    appCount: 0,
    displayOrder: 2,
  },
  {
    id: 'cat-development',
    name: 'Development',
    slug: 'development',
    description: 'Developer productivity tools, compilers, API testing utilities, and workflow enhancers.',
    icon: 'Code',
    appCount: 0,
    displayOrder: 3,
  },
  {
    id: 'cat-security',
    name: 'Security',
    slug: 'security',
    description: 'License generation, cryptographic keys, and local zero-telemetry encryption suites.',
    icon: 'Shield',
    appCount: 0,
    displayOrder: 4,
  },
  {
    id: 'cat-productivity',
    name: 'Productivity',
    slug: 'productivity',
    description: 'Streamline day-to-day operations with lightweight, lightning-fast desktop applications.',
    icon: 'Zap',
    appCount: 0,
    displayOrder: 5,
  },
  {
    id: 'cat-creative',
    name: 'Creative Tools',
    slug: 'creative-tools',
    description: 'GPU-accelerated asset pipeline, rendering utilities, and multimedia editors.',
    icon: 'Palette',
    appCount: 0,
    displayOrder: 6,
  },
];

// Empty apps array - no demo data
export const INITIAL_APPS: AppItem[] = [];

export const STORE_SETTINGS = {
  storeName: 'FORBIDEN App Store',
  storeTagline: 'Powering Performance. Securing Innovation.',
  supportEmail: 'support@forbiden.com',
  currency: 'USD',
  discordInviteLink: 'https://discord.gg/forbiden',
};

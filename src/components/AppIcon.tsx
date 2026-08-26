import React from 'react';
import {
  TrendingUp,
  Shield,
  Database,
  Cloud,
  Gauge,
  Code2,
  Lock,
  Cpu,
  Layers,
  LucideIcon
} from 'lucide-react';

interface AppIconProps {
  type?: 'chart' | 'shield' | 'database' | 'cloud' | 'speedometer' | 'code' | 'lock' | 'cpu' | string;
  iconUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  className?: string;
  glow?: boolean;
}

export const AppIcon: React.FC<AppIconProps> = ({
  type = 'chart',
  iconUrl,
  size = 'md',
  className = '',
  glow = true,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const getIcon = (): LucideIcon => {
    switch (type) {
      case 'chart':
        return TrendingUp;
      case 'shield':
        return Shield;
      case 'database':
        return Database;
      case 'cloud':
        return Cloud;
      case 'speedometer':
        return Gauge;
      case 'code':
        return Code2;
      case 'lock':
        return Lock;
      case 'cpu':
        return Cpu;
      default:
        return Layers;
    }
  };

  const IconComponent = getIcon();

  const sizeClasses = {
    sm: 'w-8 h-8 rounded-lg p-1.5',
    md: 'w-12 h-12 rounded-xl p-2.5',
    lg: 'w-16 h-16 rounded-2xl p-3.5',
    xl: 'w-32 h-32 md:w-36 md:h-36 rounded-3xl p-6',
    xxl: 'w-48 h-48 md:w-56 md:h-56 rounded-3xl p-8',
  };

  const iconSizes = {
    sm: 18,
    md: 24,
    lg: 32,
    xl: 64,
    xxl: 96,
  };

  // Specific custom gradients & styling to match the visual screenshots
  const getGradient = () => {
    switch (type) {
      case 'chart':
        return 'from-purple-900/60 via-violet-950/80 to-purple-900/40 text-purple-400 border-purple-500/30';
      case 'shield':
        return 'from-slate-900/80 via-indigo-950/80 to-sky-950/50 text-slate-200 border-slate-500/30';
      case 'database':
        return 'from-purple-900/70 via-fuchsia-950/80 to-indigo-950/60 text-purple-300 border-purple-500/30';
      case 'cloud':
        return 'from-purple-900/70 via-indigo-950/80 to-purple-900/50 text-purple-400 border-purple-500/30';
      case 'speedometer':
        return 'from-purple-900/70 via-violet-950/80 to-purple-950/50 text-purple-400 border-purple-500/30';
      case 'code':
        return 'from-purple-900/70 via-fuchsia-950/80 to-purple-900/50 text-purple-300 border-purple-500/30';
      default:
        return 'from-purple-900/60 via-indigo-950/80 to-purple-900/40 text-purple-400 border-purple-500/30';
    }
  };

  const hasCustomImage = Boolean(iconUrl && !imageError);

  return (
    <div
      id={`app-icon-${type}`}
      className={`relative flex items-center justify-center bg-gradient-to-br ${getGradient()} border ${
        glow ? 'shadow-lg shadow-purple-900/20' : ''
      } ${sizeClasses[size]} ${className}`}
    >
      {hasCustomImage ? (
        <img
          src={iconUrl}
          alt="App icon"
          referrerPolicy="no-referrer"
          onError={() => setImageError(true)}
          className="w-full h-full object-contain rounded-3xl transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <IconComponent
          size={iconSizes[size]}
          strokeWidth={2.2}
          className="transition-transform duration-300 group-hover:scale-105"
        />
      )}
      {glow && (
        <div
          className="absolute inset-0 rounded-inherit bg-purple-500/10 blur-md -z-10 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

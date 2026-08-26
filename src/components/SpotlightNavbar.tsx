import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'motion';
import { cn } from '../lib/utils';

export interface NavItem {
  id: string;
  label: string;
  href?: string;
}

export interface SpotlightNavbarProps {
  items: NavItem[];
  activeId?: string;
  className?: string;
  onItemClick?: (item: NavItem, index: number) => void;
  defaultActiveIndex?: number;
}

export const SpotlightNavbar: React.FC<SpotlightNavbarProps> = ({
  items,
  activeId,
  className,
  onItemClick,
  defaultActiveIndex = 0,
}) => {
  const navRef = useRef<HTMLElement>(null);
  
  // Resolve active index from activeId or defaultActiveIndex
  const activeIdxFromProp = items.findIndex((item) => item.id === activeId);
  const resolvedActiveIndex = activeIdxFromProp >= 0 ? activeIdxFromProp : defaultActiveIndex;
  
  const [activeIndex, setActiveIndex] = useState(resolvedActiveIndex);
  const [hoverX, setHoverX] = useState<number | null>(null);

  // Sync state if activeId prop changes externally
  useEffect(() => {
    if (activeIdxFromProp >= 0) {
      setActiveIndex(activeIdxFromProp);
    }
  }, [activeIdxFromProp]);

  // Refs for the "light" positions so we can animate them imperatively
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);
  const spotlightAnimRef = useRef<{ stop: () => void } | null>(null);
  const ambienceAnimRef = useRef<{ stop: () => void } | null>(null);

  // Initial calculation and active ambience placement
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      ambienceAnimRef.current?.stop();
      ambienceAnimRef.current = animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 220,
        damping: 22,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty('--ambience-x', `${v}px`);
        },
      });

      // Also position initial spotlight if not hovered
      if (hoverX === null) {
        spotlightX.current = targetX;
        nav.style.setProperty('--spotlight-x', `${targetX}px`);
      }
    }
  }, [activeIndex, items]);

  // Mouse move and leave spotlight tracker
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);

      spotlightAnimRef.current?.stop();
      spotlightX.current = x;
      nav.style.setProperty('--spotlight-x', `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      // When mouse leaves, spring the spotlight back to the active item
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        spotlightAnimRef.current?.stop();
        spotlightAnimRef.current = animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 220,
          damping: 22,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty('--spotlight-x', `${v}px`);
          },
        });
      }
    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
      spotlightAnimRef.current?.stop();
      ambienceAnimRef.current?.stop();
    };
  }, [activeIndex]);

  const handleItemClick = (item: NavItem, index: number) => {
    setActiveIndex(index);
    onItemClick?.(item, index);
  };

  return (
    <div className={cn('relative flex justify-center items-center', className)}>
      <nav
        ref={navRef}
        className={cn(
          'spotlight-nav relative h-11 rounded-full transition-all duration-300 overflow-hidden',
          'bg-[#121422]/90 border border-purple-500/25 shadow-lg shadow-purple-950/40 backdrop-blur-xl',
          'hover:border-purple-500/40'
        )}
        style={{
          ['--spotlight-color' as any]: 'rgba(192, 132, 252, 0.28)',
          ['--ambience-color' as any]: 'rgba(216, 180, 254, 0.95)',
        }}
      >
        {/* Content Navigation Items */}
        <ul className="relative flex items-center h-full px-1.5 gap-1 z-[10]">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            return (
              <li key={item.id || idx} className="relative h-full flex items-center justify-center">
                <button
                  type="button"
                  data-index={idx}
                  id={`spotlight-nav-${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleItemClick(item, idx);
                  }}
                  className={cn(
                    'px-4 py-1.5 text-sm font-medium transition-colors duration-200 rounded-full select-none cursor-pointer',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400/50',
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  )}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        {/* LIGHTING LAYERS: CSS variables --spotlight-x and --ambience-x updated by JS */}

        {/* 1. The Moving Spotlight (Follows Mouse or springs to active item) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0.45,
            background: `
              radial-gradient(
                130px circle at var(--spotlight-x, 50%) 100%, 
                var(--spotlight-color, rgba(192, 132, 252, 0.28)) 0%, 
                transparent 70%
              )
            `,
          }}
        />

        {/* 2. The Active State Ambience Bar (Stays smoothly on Active item) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
          style={{
            background: `
              radial-gradient(
                70px circle at var(--ambience-x, 50%) 0%, 
                var(--ambience-color, rgba(216, 180, 254, 0.95)) 0%, 
                transparent 100%
              )
            `,
          }}
        />
      </nav>
    </div>
  );
};

export default SpotlightNavbar;

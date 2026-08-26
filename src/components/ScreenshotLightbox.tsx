import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ScreenshotLightboxProps {
  images: string[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  title?: string;
}

export const ScreenshotLightbox: React.FC<ScreenshotLightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onIndexChange,
  title = 'Application Screenshot',
}) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') {
        onIndexChange((currentIndex - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowRight') {
        onIndexChange((currentIndex + 1) % images.length);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentIndex, images.length, onClose, onIndexChange]);

  if (!isOpen || images.length === 0) return null;

  return (
    <div
      id="screenshot-lightbox-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-lg animate-in fade-in"
      onClick={onClose}
    >
      {/* Top bar controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-20 text-white">
        <span className="text-sm font-medium bg-black/50 px-3 py-1.5 rounded-lg border border-purple-900/40">
          {title} • {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-black/60 hover:bg-purple-900/50 border border-purple-900/40 text-slate-300 hover:text-white transition-all"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Image */}
      <div
        className="relative max-w-6xl max-h-[85vh] p-4 flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`${title} Preview ${currentIndex + 1}`}
          className="max-h-[80vh] w-auto object-contain rounded-xl border border-purple-500/20 shadow-2xl shadow-purple-950/80"
        />

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => onIndexChange((currentIndex - 1 + images.length) % images.length)}
              className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-purple-900/60 border border-purple-500/30 text-white shadow-xl hover:scale-105 transition-all"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => onIndexChange((currentIndex + 1) % images.length)}
              className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/70 hover:bg-purple-900/60 border border-purple-500/30 text-white shadow-xl hover:scale-105 transition-all"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </>
        )}
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-xl bg-black/70 border border-purple-900/40 z-20"
          onClick={(e) => e.stopPropagation()}
        >
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => onIndexChange(idx)}
              className={`w-14 h-9 rounded-md overflow-hidden border transition-all ${
                currentIndex === idx
                  ? 'border-purple-400 ring-2 ring-purple-500/50 scale-105'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt="thumb" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

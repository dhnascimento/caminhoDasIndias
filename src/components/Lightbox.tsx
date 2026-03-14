import { useState, useEffect, useCallback } from 'react';
import type { LocalizedString } from '../types/slides';
import { resolvePhotoPath } from '../utils/yamlLoader';
import { useLanguage } from '../context/LanguageContext';

export interface LightboxImage {
  src: string;
  caption?: LocalizedString;
}

interface LightboxProps {
  images: LightboxImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export function Lightbox({ images, initialIndex = 0, isOpen, onClose }: LightboxProps) {
  const { t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const hasMultiple = images.length > 1;

  // Reset index when lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' && hasMultiple) {
        nextPhoto();
      } else if (e.key === 'ArrowLeft' && hasMultiple) {
        prevPhoto();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, hasMultiple, nextPhoto, prevPhoto, onClose]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {hasMultiple && (
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 btn-control"
          onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <img
        src={resolvePhotoPath(current.src)}
        alt={t(current.caption)}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />

      {hasMultiple && (
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 btn-control"
          onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <button
        className="absolute top-4 right-4 btn-control"
        onClick={onClose}
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {current.caption && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-lg">
          <p className="text-white text-center">{t(current.caption)}</p>
        </div>
      )}
    </div>
  );
}

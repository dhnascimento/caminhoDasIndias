import { useState } from 'react';
import type { ComparisonSlide as ComparisonSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface ComparisonSlideProps {
  slide: ComparisonSlideType;
}

export function ComparisonSlide({ slide }: ComparisonSlideProps) {
  const { t } = useLanguage();
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages(prev => new Set([...prev, index]));
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Title */}
      {slide.title && (
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-8 text-center animate-fade-in">
          {t(slide.title)}
        </h2>
      )}

      {/* Comparison container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 max-w-5xl w-full animate-scale-in">
        {slide.photos.map((photo, index) => (
          <div key={index} className="flex-1 w-full md:w-auto">
            {/* Label */}
            {photo.label && (
              <p className="text-center text-[var(--color-primary)] font-medium mb-3 text-lg">
                {t(photo.label)}
              </p>
            )}

            {/* Photo */}
            <div className="photo-frame aspect-[3/4] md:aspect-[4/5]">
              {!loadedImages.has(index) && (
                <div className="absolute inset-0 photo-loading rounded" />
              )}
              <img
                src={resolvePhotoPath(photo.src)}
                alt={t(photo.label) || `Comparison ${index + 1}`}
                className={`w-full h-full object-cover rounded transition-opacity duration-500 ${
                  loadedImages.has(index) ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Arrow between photos (desktop only) */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-[var(--color-surface-elevated)] border border-[var(--color-border)] flex items-center justify-center shadow-lg">
          <svg className="w-6 h-6 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>

      {/* Caption */}
      {slide.caption && (
        <p className="mt-6 text-lg text-[var(--color-text-muted)] text-center max-w-2xl">
          {t(slide.caption)}
        </p>
      )}

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

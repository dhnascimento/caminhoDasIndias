import { useState } from 'react';
import type { GallerySlide as GallerySlideType, GalleryPhoto } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface GallerySlideProps {
  slide: GallerySlideType;
}

function GalleryImage({ photo, onClick }: { photo: GalleryPhoto; onClick: () => void }) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative aspect-square overflow-hidden rounded cursor-pointer group"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 photo-loading" />
      )}
      <img
        src={resolvePhotoPath(photo.src)}
        alt={t(photo.caption)}
        className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setIsLoaded(true)}
      />
      {/* Per-photo caption overlay */}
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <p className="text-white text-sm">{t(photo.caption)}</p>
        </div>
      )}
    </div>
  );
}

export function GallerySlide({ slide }: GallerySlideProps) {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const photoCount = slide.photos.length;

  // Determine grid layout based on photo count
  const getGridClass = () => {
    switch (photoCount) {
      case 1:
        return 'grid-cols-1';
      case 2:
        return 'grid-cols-2';
      case 3:
        return 'grid-cols-3';
      case 4:
        return 'grid-cols-2 md:grid-cols-4';
      case 5:
      case 6:
        return 'grid-cols-2 md:grid-cols-3';
      default:
        return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
    }
  };

  const closeLightbox = () => setLightboxIndex(null);
  const nextPhoto = () => setLightboxIndex(prev =>
    prev !== null ? (prev + 1) % photoCount : null
  );
  const prevPhoto = () => setLightboxIndex(prev =>
    prev !== null ? (prev - 1 + photoCount) % photoCount : null
  );

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Title */}
      {slide.title && (
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-6 text-center animate-fade-in">
          {t(slide.title)}
        </h2>
      )}

      {/* Photo grid */}
      <div className={`grid ${getGridClass()} gap-3 md:gap-4 max-w-5xl w-full animate-scale-in`}>
        {slide.photos.map((photo, index) => (
          <GalleryImage
            key={index}
            photo={photo}
            onClick={() => setLightboxIndex(index)}
          />
        ))}
      </div>

      {/* Overall caption */}
      {slide.caption && (
        <p className="mt-6 text-lg text-[var(--color-text-muted)] text-center max-w-2xl">
          {t(slide.caption)}
        </p>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 btn-control"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <img
            src={resolvePhotoPath(slide.photos[lightboxIndex].src)}
            alt={t(slide.photos[lightboxIndex].caption)}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 btn-control"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <button
            className="absolute top-4 right-4 btn-control"
            onClick={closeLightbox}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Photo caption in lightbox */}
          {slide.photos[lightboxIndex].caption && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 glass px-6 py-3 rounded-lg">
              <p className="text-white text-center">{t(slide.photos[lightboxIndex].caption)}</p>
            </div>
          )}
        </div>
      )}

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

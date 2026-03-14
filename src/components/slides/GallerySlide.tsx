import { useState } from 'react';
import type { GallerySlide as GallerySlideType, GalleryPhoto } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../Lightbox';

interface GallerySlideProps {
  slide: GallerySlideType;
}

function GalleryImage({ photo, onClick }: { photo: GalleryPhoto; onClick: () => void }) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div
      className="relative overflow-hidden rounded cursor-pointer group"
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 photo-loading" />
      )}
      <img
        src={resolvePhotoPath(photo.src)}
        alt={t(photo.caption)}
        className={`w-full h-full object-contain transition-all duration-500 group-hover:scale-105 ${
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
      <Lightbox
        images={slide.photos.map(p => ({ src: p.src, caption: p.caption }))}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
      />

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

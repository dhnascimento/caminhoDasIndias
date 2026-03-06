import { useState } from 'react';
import type { PhotoSlide as PhotoSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface PhotoSlideProps {
  slide: PhotoSlideType;
}

export function PhotoSlide({ slide }: PhotoSlideProps) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const photoUrl = resolvePhotoPath(slide.photo);

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Photo container */}
      <div className="relative max-w-full max-h-full flex flex-col items-center animate-scale-in">
        {/* Photo frame */}
        <div className="photo-frame max-h-[70vh] md:max-h-[75vh]">
          {/* Loading placeholder */}
          {!isLoaded && (
            <div className="absolute inset-0 photo-loading rounded" />
          )}

          <img
            src={photoUrl}
            alt={t(slide.caption)}
            className={`max-h-[70vh] md:max-h-[75vh] w-auto object-contain rounded transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setIsLoaded(true)}
          />
        </div>

        {/* Caption */}
        {(slide.caption || slide.subcaption) && (
          <div className="mt-6 text-center max-w-2xl">
            {slide.caption && (
              <p className="text-xl md:text-2xl text-[var(--color-text)] font-display">
                {t(slide.caption)}
              </p>
            )}
            {slide.subcaption && (
              <p className="mt-2 text-base text-[var(--color-text-muted)]">
                {t(slide.subcaption)}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

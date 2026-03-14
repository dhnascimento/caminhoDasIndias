import { useState, useCallback } from 'react';
import type { GallerySlide as GallerySlideType, GalleryPhoto } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';
import { Lightbox } from '../Lightbox';

interface GallerySlideProps {
  slide: GallerySlideType;
}

type Orientation = 'portrait' | 'landscape';

export function GallerySlide({ slide }: GallerySlideProps) {
  const { t } = useLanguage();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [orientations, setOrientations] = useState<Record<number, Orientation>>({});
  const photoCount = slide.photos.length;

  const handleImageLoad = useCallback((index: number, e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const orientation: Orientation = img.naturalHeight > img.naturalWidth ? 'portrait' : 'landscape';
    setOrientations(prev => ({ ...prev, [index]: orientation }));
  }, []);

  // Determine dominant orientation once all images have loaded
  const loadedCount = Object.keys(orientations).length;
  let dominantOrientation: Orientation | null = null;
  const outlierSet = new Set<number>();

  if (loadedCount === photoCount && photoCount > 1) {
    const portraitCount = Object.values(orientations).filter(o => o === 'portrait').length;
    const landscapeCount = photoCount - portraitCount;

    if (portraitCount !== landscapeCount) {
      dominantOrientation = portraitCount > landscapeCount ? 'portrait' : 'landscape';
      for (const [idx, orientation] of Object.entries(orientations)) {
        if (orientation !== dominantOrientation) {
          outlierSet.add(Number(idx));
        }
      }
    }
  }

  // Row height based on photo count and orientation mix
  const getRowHeight = () => {
    if (photoCount <= 2) return 'h-[50vh]';
    if (photoCount <= 4) return 'h-[45vh]';
    return 'h-[35vh]';
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Title */}
      {slide.title && (
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-6 text-center animate-fade-in">
          {t(slide.title)}
        </h2>
      )}

      {/* Photo row — all images same height */}
      <div className={`flex gap-3 md:gap-4 ${getRowHeight()} max-w-6xl w-full justify-center animate-scale-in`}>
        {slide.photos.map((photo, index) => (
          <GalleryImage
            key={index}
            index={index}
            photo={photo}
            onClick={() => setLightboxIndex(index)}
            isOutlier={outlierSet.has(index)}
            dominantOrientation={dominantOrientation}
            onLoad={handleImageLoad}
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

function GalleryImage({
  index,
  photo,
  onClick,
  isOutlier,
  dominantOrientation,
  onLoad,
}: {
  index: number;
  photo: GalleryPhoto;
  onClick: () => void;
  isOutlier: boolean;
  dominantOrientation: Orientation | null;
  onLoad: (index: number, e: React.SyntheticEvent<HTMLImageElement>) => void;
}) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  // Outliers get a forced aspect ratio to match the dominant orientation
  const aspectClass = isOutlier && dominantOrientation
    ? (dominantOrientation === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]')
    : '';

  return (
    <div
      className={`relative overflow-hidden rounded cursor-pointer group h-full flex-shrink ${aspectClass}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="h-full aspect-square photo-loading rounded" />
      )}
      <img
        src={resolvePhotoPath(photo.src)}
        alt={t(photo.caption)}
        className={`h-full w-auto object-cover rounded transition-all duration-500 group-hover:scale-105 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={(e) => {
          setIsLoaded(true);
          onLoad(index, e);
        }}
      />
      {photo.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b">
          <p className="text-white text-sm">{t(photo.caption)}</p>
        </div>
      )}
    </div>
  );
}

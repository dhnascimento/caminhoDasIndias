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
type EffectiveMobileLayout = 'row' | 'scroll' | 'column' | 'grid-2';

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

  // Row height based on photo count and orientation mix (desktop only)
  const getRowHeight = () => {
    if (photoCount <= 2) return 'md:h-[50vh]';
    if (photoCount <= 4) return 'md:h-[45vh]';
    return 'md:h-[35vh]';
  };

  // Resolve effective mobile layout
  const mobileLayout = slide.mobile_layout ?? 'auto';
  const effectiveMobileLayout: EffectiveMobileLayout =
    mobileLayout === 'auto'
      ? (photoCount > 3 ? 'column' : 'row')
      : mobileLayout;

  // Mobile layout classes (below md breakpoint)
  const getMobileClasses = (): string => {
    switch (effectiveMobileLayout) {
      case 'column':
        return 'flex-col overflow-y-auto max-h-[65vh]';
      case 'scroll':
        return 'flex-row overflow-x-auto h-[35vh]';
      case 'grid-2':
        return 'flex-wrap overflow-y-auto max-h-[65vh]';
      case 'row':
      default:
        // Keep original row height for small photo counts
        return `flex-row ${photoCount <= 2 ? 'h-[50vh]' : photoCount <= 4 ? 'h-[45vh]' : 'h-[35vh]'}`;
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 pb-16 md:p-8 md:pb-8 lg:p-12 overflow-hidden">
      {/* Title */}
      {slide.title && (
        <h2 className="font-display text-3xl md:text-4xl text-[var(--color-text)] mb-6 text-center animate-fade-in">
          {t(slide.title)}
        </h2>
      )}

      {/* Photo grid — responsive layout */}
      <div className={`flex gap-3 md:gap-4 ${getMobileClasses()} md:flex-row md:overflow-visible md:max-h-none ${getRowHeight()} max-w-6xl w-full justify-center animate-scale-in`}>
        {slide.photos.map((photo, index) => (
          <GalleryImage
            key={index}
            index={index}
            photo={photo}
            onClick={() => setLightboxIndex(index)}
            isOutlier={outlierSet.has(index)}
            dominantOrientation={dominantOrientation}
            onLoad={handleImageLoad}
            mobileMode={effectiveMobileLayout}
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
  mobileMode,
}: {
  index: number;
  photo: GalleryPhoto;
  onClick: () => void;
  isOutlier: boolean;
  dominantOrientation: Orientation | null;
  onLoad: (index: number, e: React.SyntheticEvent<HTMLImageElement>) => void;
  mobileMode: EffectiveMobileLayout;
}) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);

  // Outliers get a forced aspect ratio to match the dominant orientation (desktop)
  const aspectClass = isOutlier && dominantOrientation
    ? (dominantOrientation === 'portrait' ? 'md:aspect-[3/4]' : 'md:aspect-[4/3]')
    : '';

  // Mobile-specific sizing
  const mobileClasses =
    mobileMode === 'column'
      ? 'w-full h-auto flex-shrink-0'
      : mobileMode === 'grid-2'
        ? 'w-[calc(50%-0.375rem)] h-auto flex-shrink-0'
        : 'h-full flex-shrink';

  return (
    <div
      className={`relative overflow-hidden rounded cursor-pointer group ${mobileClasses} md:h-full md:flex-shrink md:w-auto ${aspectClass}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className={`${mobileMode === 'column' || mobileMode === 'grid-2' ? 'w-full aspect-video' : 'h-full aspect-square'} photo-loading rounded`} />
      )}
      <img
        src={resolvePhotoPath(photo.src)}
        alt={t(photo.caption)}
        className={`${mobileMode === 'column' || mobileMode === 'grid-2' ? 'w-full h-auto' : 'h-full w-auto'} md:h-full md:w-auto object-cover rounded transition-all duration-500 group-hover:scale-105 ${
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

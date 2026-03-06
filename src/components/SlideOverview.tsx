import type { Slide } from '../types/slides';
import { resolvePhotoPath } from '../utils/yamlLoader';
import { useLanguage } from '../context/LanguageContext';
import type { LocalizedString } from '../types/slides';

interface SlideOverviewProps {
  slides: Slide[];
  currentSlide: number;
  onSlideSelect: (index: number) => void;
  onClose: () => void;
}

function getSlidePreviewInfo(
  slide: Slide,
  t: (field: LocalizedString | undefined) => string
): { title: string; thumbnail?: string } {
  switch (slide.type) {
    case 'title':
      return { title: t(slide.title), thumbnail: slide.photo };
    case 'divider':
      return { title: t(slide.title), thumbnail: slide.photo };
    case 'photo':
      return { title: t(slide.caption) || 'Photo', thumbnail: slide.photo };
    case 'gallery':
      return {
        title: t(slide.title) || 'Gallery',
        thumbnail: slide.photos[0]?.src,
      };
    case 'story':
      return { title: t(slide.title) || 'Story', thumbnail: slide.photo };
    case 'video':
      return { title: t(slide.caption) || 'Video', thumbnail: slide.poster };
    case 'closing':
      return { title: t(slide.title), thumbnail: slide.photo };
    case 'comparison':
      return {
        title: t(slide.title) || 'Comparison',
        thumbnail: slide.photos[0]?.src,
      };
    default:
      return { title: 'Slide' };
  }
}

export function SlideOverview({
  slides,
  currentSlide,
  onSlideSelect,
  onClose,
}: SlideOverviewProps) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-50 bg-[var(--color-background)]/95 backdrop-blur-sm overflow-auto custom-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[var(--color-background)]/80 backdrop-blur-md border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl text-[var(--color-text)]">
            Slide Overview
          </h2>
          <button
            onClick={onClose}
            className="btn-control"
            aria-label="Close overview"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {slides.map((slide, index) => {
            const { title, thumbnail } = getSlidePreviewInfo(slide, t);
            const isActive = index === currentSlide;

            return (
              <button
                key={index}
                onClick={() => {
                  onSlideSelect(index);
                  onClose();
                }}
                className={`group relative aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                  isActive
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                {/* Thumbnail */}
                {thumbnail ? (
                  <img
                    src={resolvePhotoPath(thumbnail)}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-[var(--color-surface)] flex items-center justify-center">
                    <span className="text-3xl opacity-50">
                      {slide.type === 'title' && '🎬'}
                      {slide.type === 'divider' && '📅'}
                      {slide.type === 'photo' && '📷'}
                      {slide.type === 'gallery' && '🖼️'}
                      {slide.type === 'story' && '📖'}
                      {slide.type === 'video' && '🎥'}
                      {slide.type === 'closing' && '🎊'}
                      {slide.type === 'comparison' && '↔️'}
                    </span>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  <p className="text-xs text-white/60 mb-0.5">
                    {index + 1}
                  </p>
                  <p className="text-sm text-white truncate">
                    {title}
                  </p>
                </div>

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute top-2 right-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 glass px-4 py-2 rounded-full text-sm text-[var(--color-text-muted)]">
        Press <kbd className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-[var(--color-text)]">Esc</kbd> or <kbd className="px-2 py-0.5 bg-[var(--color-surface)] rounded text-[var(--color-text)]">G</kbd> to close
      </div>
    </div>
  );
}

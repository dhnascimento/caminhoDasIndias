import { useState } from 'react';
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

function SlideTypeIcon({ type }: { type: string }) {
  const cls = 'w-8 h-8 text-[var(--color-primary)]';
  switch (type) {
    case 'title':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
      );
    case 'divider':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
        </svg>
      );
    case 'photo':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      );
    case 'gallery':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5z" />
        </svg>
      );
    case 'story':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      );
    case 'video':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
      );
    case 'closing':
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
        </svg>
      );
    default:
      return (
        <svg className={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
        </svg>
      );
  }
}

function ThumbnailPlaceholder({ type }: { type: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-background)] flex flex-col">
      {/* Icon centered in the upper portion, clear of the bottom info overlay */}
      <div className="flex-1 flex items-center justify-center">
        <div className="p-3 rounded-full bg-[var(--color-primary)]/10">
          <SlideTypeIcon type={type} />
        </div>
      </div>
      {/* Spacer matching the height of the absolute info section below */}
      <div className="h-14 shrink-0" />
    </div>
  );
}

function ThumbnailImage({ src, alt, type }: { src?: string; alt: string; type: string }) {
  const [error, setError] = useState(false);
  if (!src || error) return <ThumbnailPlaceholder type={type} />;
  return (
    <img
      src={resolvePhotoPath(src)}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  );
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
                <ThumbnailImage src={thumbnail} alt={title} type={slide.type} />

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

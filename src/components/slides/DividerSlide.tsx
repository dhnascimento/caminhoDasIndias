import type { DividerSlide as DividerSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';

interface DividerSlideProps {
  slide: DividerSlideType;
}

export function DividerSlide({ slide }: DividerSlideProps) {
  const backgroundImage = slide.photo ? resolvePhotoPath(slide.photo) : null;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0">
          <img
            src={backgroundImage}
            alt=""
            className="w-full h-full object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/70 to-[var(--color-background)]/40" />
        </div>
      )}

      {/* Decorative border */}
      <div className="decorative-border" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-3xl animate-fade-in">
        {/* Day number badge */}
        {slide.day !== undefined && (
          <div className="inline-flex items-center justify-center mb-6">
            <span className="px-6 py-2 rounded-full bg-[var(--gradient-subtle)] border border-[var(--color-border)] text-[var(--color-primary)] font-medium tracking-widest uppercase text-sm">
              Day {slide.day}
            </span>
          </div>
        )}

        {/* Date */}
        {slide.date && (
          <p className="text-[var(--color-text-muted)] text-lg mb-4 tracking-wide">
            {slide.date}
          </p>
        )}

        {/* Title */}
        <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-medium mb-4 text-[var(--color-text)]">
          {slide.title}
        </h2>

        {/* Subtitle */}
        {slide.subtitle && (
          <p className="text-xl md:text-2xl text-[var(--color-text-muted)] italic font-light">
            {slide.subtitle}
          </p>
        )}
      </div>

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

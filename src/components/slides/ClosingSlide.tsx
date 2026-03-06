import type { ClosingSlide as ClosingSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface ClosingSlideProps {
  slide: ClosingSlideType;
}

export function ClosingSlide({ slide }: ClosingSlideProps) {
  const { t } = useLanguage();
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

      {/* Decorative corners */}
      <div className="decorative-corner top-left" />
      <div className="decorative-corner top-right" />
      <div className="decorative-corner bottom-left" />
      <div className="decorative-corner bottom-right" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-3xl animate-fade-in">
        <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-semibold mb-8 text-gradient">
          {t(slide.title)}
        </h2>
        {slide.text && (
          <p className="text-xl md:text-2xl text-[var(--color-text-muted)] font-light leading-relaxed">
            {t(slide.text)}
          </p>
        )}

        {/* Decorative element */}
        <div className="mt-12 flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
          <span className="text-2xl">✦</span>
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
        </div>
      </div>

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

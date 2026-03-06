import type { TitleSlide as TitleSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface TitleSlideProps {
  slide: TitleSlideType;
}

export function TitleSlide({ slide }: TitleSlideProps) {
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
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] via-[var(--color-background)]/60 to-[var(--color-background)]/30" />
        </div>
      )}

      {/* Decorative corners */}
      <div className="decorative-corner top-left" />
      <div className="decorative-corner top-right" />
      <div className="decorative-corner bottom-left" />
      <div className="decorative-corner bottom-right" />

      {/* Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl animate-fade-in">
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-semibold mb-6 text-gradient leading-tight">
          {t(slide.title)}
        </h1>
        {slide.subtitle && (
          <p className="text-xl md:text-2xl lg:text-3xl text-[var(--color-text-muted)] font-light tracking-wide">
            {t(slide.subtitle)}
          </p>
        )}
      </div>

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

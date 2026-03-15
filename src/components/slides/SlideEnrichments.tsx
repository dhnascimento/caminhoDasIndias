import type { SlideEnrichments as EnrichmentsType } from '../../types/slides';
import { useLanguage } from '../../context/LanguageContext';

interface SlideEnrichmentsProps {
  slide: EnrichmentsType;
}

export function SlideEnrichments({ slide }: SlideEnrichmentsProps) {
  const { t } = useLanguage();
  const hasEnrichments = slide.location || slide.fun_fact || slide.map_embed;

  if (!hasEnrichments) return null;

  return (
    <>
      {/* Location tag */}
      {slide.location && (
        <div className="absolute bottom-16 left-4 md:bottom-6 md:left-6 flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[var(--color-text-muted)]">{slide.location}</span>
        </div>
      )}

      {/* Fun fact callout */}
      {slide.fun_fact && (
        <div className="absolute top-24 right-6 max-w-xs glass px-4 py-3 rounded-lg">
          <div className="flex items-start gap-2">
            <span className="text-lg">💡</span>
            <p className="text-sm text-[var(--color-text-muted)]">{t(slide.fun_fact)}</p>
          </div>
        </div>
      )}

      {/* Map embed (small corner map) */}
      {slide.map_embed && (
        <div className="absolute bottom-24 right-6 w-48 h-36 rounded-lg overflow-hidden shadow-lg border border-[var(--color-border)] hidden lg:block">
          <iframe
            src={slide.map_embed}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Location map"
          />
        </div>
      )}
    </>
  );
}

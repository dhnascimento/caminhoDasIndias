import type { SlideEnrichments as EnrichmentsType } from '../../types/slides';
import { useLanguage } from '../../context/LanguageContext';

interface SlideEnrichmentsProps {
  slide: EnrichmentsType;
}

export function SlideEnrichments({ slide }: SlideEnrichmentsProps) {
  const { lang, t } = useLanguage();
  const hasEnrichments = slide.location || slide.music || slide.fun_fact || slide.map_embed;

  if (!hasEnrichments) return null;

  return (
    <>
      {/* Location tag */}
      {slide.location && (
        <div className="absolute bottom-24 left-6 flex items-center gap-2 glass px-4 py-2 rounded-full text-sm">
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[var(--color-text-muted)]">{slide.location}</span>
        </div>
      )}

      {/* Music link */}
      {slide.music && (
        <a
          href={slide.music}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-24 right-6 flex items-center gap-2 glass px-4 py-2 rounded-full text-sm hover:bg-[var(--button-hover-bg)] transition-colors"
        >
          <svg className="w-4 h-4 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          <span className="text-[var(--color-text-muted)]">{lang === 'pt' ? 'Ouvir no Spotify' : 'Listen on Spotify'}</span>
        </a>
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

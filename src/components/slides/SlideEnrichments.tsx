import { useState, useRef, useEffect } from 'react';
import type { SlideEnrichments as EnrichmentsType } from '../../types/slides';
import { useLanguage } from '../../context/LanguageContext';

interface SlideEnrichmentsProps {
  slide: EnrichmentsType;
}

export function SlideEnrichments({ slide }: SlideEnrichmentsProps) {
  const { t } = useLanguage();
  const [funFactOpen, setFunFactOpen] = useState(false);
  const funFactRef = useRef<HTMLDivElement>(null);
  const hasEnrichments = slide.location || slide.fun_fact || slide.map_embed;

  // Close fun fact when clicking outside
  useEffect(() => {
    if (!funFactOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (funFactRef.current && !funFactRef.current.contains(e.target as Node)) {
        setFunFactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [funFactOpen]);

  // Reset when slide changes
  useEffect(() => {
    setFunFactOpen(false);
  }, [slide.fun_fact]);

  if (!hasEnrichments) return null;

  return (
    <>
      {/* Location tag — desktop only */}
      {slide.location && (
        <div className="hidden md:flex absolute md:bottom-6 md:left-6 items-center gap-2 glass px-4 py-2 rounded-full text-sm">
          <svg className="w-4 h-4 text-[var(--color-primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-[var(--color-text-muted)]">{slide.location}</span>
        </div>
      )}

      {/* Fun fact — toggleable on mobile, always visible on desktop */}
      {slide.fun_fact && (
        <div ref={funFactRef}>
          {/* Mobile: toggle button */}
          <button
            className="md:hidden absolute bottom-20 right-4 btn-control z-[5]"
            onClick={() => setFunFactOpen(prev => !prev)}
            aria-label={funFactOpen ? 'Hide fun fact' : 'Show fun fact'}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18h6M10 22h4M12 2a7 7 0 0 1 4 12.7V17a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-2.3A7 7 0 0 1 12 2z" />
            </svg>
          </button>

          {/* Mobile: popover card */}
          {funFactOpen && (
            <div className="md:hidden absolute bottom-32 right-4 max-w-[calc(100%-2rem)] glass px-4 py-3 rounded-lg z-[5] animate-fade-in">
              <div className="flex items-start gap-2">
                <span className="text-lg">💡</span>
                <p className="text-sm text-[var(--color-text-muted)]">{t(slide.fun_fact)}</p>
              </div>
            </div>
          )}

          {/* Desktop: always visible */}
          <div className="hidden md:block absolute md:top-24 md:right-6 md:max-w-xs glass px-4 py-3 rounded-lg z-[5]">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <p className="text-sm text-[var(--color-text-muted)]">{t(slide.fun_fact)}</p>
            </div>
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

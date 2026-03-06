import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { StorySlide as StorySlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';
import { useLanguage } from '../../context/LanguageContext';

interface StorySlideProps {
  slide: StorySlideType;
}

export function StorySlide({ slide }: StorySlideProps) {
  const { t } = useLanguage();
  const [isLoaded, setIsLoaded] = useState(false);
  const photoUrl = resolvePhotoPath(slide.photo);
  const isPhotoLeft = slide.layout !== 'photo-right';

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      <div className={`flex flex-col ${isPhotoLeft ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12 max-w-6xl w-full`}>
        {/* Photo */}
        <div className={`flex-1 w-full md:w-auto animate-slide-in-${isPhotoLeft ? 'left' : 'right'}`}>
          <div className="photo-frame aspect-[4/3] md:aspect-auto md:h-[60vh]">
            {!isLoaded && (
              <div className="absolute inset-0 photo-loading rounded" />
            )}
            <img
              src={photoUrl}
              alt={t(slide.title)}
              className={`w-full h-full object-cover rounded transition-opacity duration-500 ${
                isLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setIsLoaded(true)}
            />
          </div>
        </div>

        {/* Text content */}
        <div className={`flex-1 text-center md:text-left animate-slide-in-${isPhotoLeft ? 'right' : 'left'}`}>
          {slide.title && (
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-[var(--color-text)] mb-6">
              {t(slide.title)}
            </h2>
          )}
          <div className="markdown-content text-lg md:text-xl text-[var(--color-text-muted)] leading-relaxed">
            <ReactMarkdown>{t(slide.text)}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

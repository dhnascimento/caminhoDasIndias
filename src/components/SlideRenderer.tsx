import type { Slide } from '../types/slides';
import {
  TitleSlide,
  DividerSlide,
  PhotoSlide,
  GallerySlide,
  StorySlide,
  VideoSlide,
  ClosingSlide,
  ComparisonSlide,
} from './slides';

interface SlideRendererProps {
  slide: Slide;
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  switch (slide.type) {
    case 'title':
      return <TitleSlide slide={slide} />;
    case 'divider':
      return <DividerSlide slide={slide} />;
    case 'photo':
      return <PhotoSlide slide={slide} />;
    case 'gallery':
      return <GallerySlide slide={slide} />;
    case 'story':
      return <StorySlide slide={slide} />;
    case 'video':
      return <VideoSlide slide={slide} />;
    case 'closing':
      return <ClosingSlide slide={slide} />;
    case 'comparison':
      return <ComparisonSlide slide={slide} />;
    default:
      return (
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-[var(--color-text-muted)]">
            Unknown slide type: {(slide as { type: string }).type}
          </p>
        </div>
      );
  }
}

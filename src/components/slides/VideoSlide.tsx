import { useRef, useState } from 'react';
import type { VideoSlide as VideoSlideType } from '../../types/slides';
import { resolvePhotoPath } from '../../utils/yamlLoader';
import { SlideEnrichments } from './SlideEnrichments';

interface VideoSlideProps {
  slide: VideoSlideType;
}

export function VideoSlide({ slide }: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoUrl = resolvePhotoPath(slide.src);
  const posterUrl = slide.poster ? resolvePhotoPath(slide.poster) : undefined;

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8 lg:p-12 overflow-hidden">
      {/* Video container */}
      <div className="relative max-w-4xl w-full animate-scale-in">
        <div className="photo-frame aspect-video">
          <video
            ref={videoRef}
            src={videoUrl}
            poster={posterUrl}
            className="w-full h-full object-contain rounded"
            onEnded={handleVideoEnd}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            controls={isPlaying}
            playsInline
          />

          {/* Play overlay (shown when not playing) */}
          {!isPlaying && (
            <button
              className="absolute inset-0 flex items-center justify-center bg-black/30 group cursor-pointer"
              onClick={togglePlayPause}
              aria-label="Play video"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-white ml-1"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Caption */}
      {slide.caption && (
        <p className="mt-6 text-xl md:text-2xl text-[var(--color-text)] font-display text-center max-w-2xl">
          {slide.caption}
        </p>
      )}

      {/* Optional enrichments */}
      <SlideEnrichments slide={slide} />
    </div>
  );
}

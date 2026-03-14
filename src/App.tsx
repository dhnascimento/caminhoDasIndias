import { useState, useCallback, useEffect } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import slidesData from './content/slides.yaml';
import { processSlides } from './utils/yamlLoader';
import type { MusicTrack } from './types/slides';
import { buildSlideToTrackMap } from './utils/playlistMapping';
import {
  SlideRenderer,
  Navigation,
  ProgressBar,
  SlideOverview,
  Controls,
  MusicPlayerOverlay,
  YouTubePlayerOverlay,
} from './components';
import {
  useSlideNavigation,
  useKeyboardControls,
  useSwipeGesture,
  useFullscreen,
  useLazyLoad,
  useYouTubePlayer,
} from './hooks';

// Process slides from YAML
const { slides, playlist } = processSlides(slidesData);
const slideToTrackMap = playlist ? buildSlideToTrackMap(playlist, slides.length) : null;
const YT_ELEMENT_ID = 'yt-playlist-player';

function App() {
  const [showOverview, setShowOverview] = useState(false);
  const [musicPlayerOpen, setMusicPlayerOpen] = useState(false);
  const [activeMusic, setActiveMusic] = useState<MusicTrack | null>(null);

  const {
    currentSlide,
    isFirstSlide,
    isLastSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    isAutoPlaying,
    toggleAutoPlay,
  } = useSlideNavigation({ totalSlides: slides.length });

  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const { shouldLoad } = useLazyLoad({
    currentSlide,
    totalSlides: slides.length,
    preloadAhead: 2,
    preloadBehind: 1,
  });

  const toggleOverview = useCallback(() => {
    setShowOverview(prev => !prev);
  }, []);

  const toggleMusicPlayer = useCallback(() => {
    setMusicPlayerOpen(prev => !prev);
  }, []);

  // Derive current track index for playlist mode
  const currentTrackIndex = slideToTrackMap ? slideToTrackMap[currentSlide] : -1;

  // Persist music across slides (per-slide mode only)
  useEffect(() => {
    if (playlist) return; // playlist mode handles music separately
    const slideMusic = (slides[currentSlide] as { music?: MusicTrack }).music;
    if (slideMusic) {
      setActiveMusic(slideMusic);
      setMusicPlayerOpen(true);
    }
  }, [currentSlide]);

  const hasMusicOnCurrentSlide = playlist
    ? currentTrackIndex >= 0
    : !!activeMusic;

  // YouTube player (only active in playlist mode)
  const ytPlayer = useYouTubePlayer({
    playlistId: playlist?.youtube ?? '',
    elementId: YT_ELEMENT_ID,
  });

  const handleEscape = useCallback(() => {
    if (showOverview) {
      setShowOverview(false);
    } else {
      setShowOverview(true);
    }
  }, [showOverview]);

  // Keyboard controls
  useKeyboardControls({
    onNext: nextSlide,
    onPrev: prevSlide,
    onToggleOverview: toggleOverview,
    onToggleFullscreen: toggleFullscreen,
    onToggleMusicPlayer: hasMusicOnCurrentSlide ? toggleMusicPlayer : undefined,
    onEscape: handleEscape,
    enabled: !showOverview,
  });

  // Touch/swipe controls
  useSwipeGesture({
    onSwipeLeft: nextSlide,
    onSwipeRight: prevSlide,
    enabled: !showOverview,
  });

  // Handle empty slides
  if (slides.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="font-display text-3xl text-[var(--color-text)] mb-4">
            No Slides Found
          </h1>
          <p className="text-[var(--color-text-muted)] mb-6">
            The slides.yaml file appears to be empty or contains errors.
            Please check the file and make sure it follows the correct format.
          </p>
          <p className="text-sm text-[var(--color-text-muted)]">
            See the <code className="px-2 py-1 bg-[var(--color-surface)] rounded">EDITING-GUIDE.md</code> for help.
          </p>
        </div>
      </div>
    );
  }

  return (
    <LanguageProvider>
    <div className="min-h-screen bg-[var(--color-background)] overflow-hidden">
      {/* Main slide area */}
      <main className="relative w-full h-screen">
        {/* Slides container with transitions */}
        <div className="w-full h-full">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-500 ${
                index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={index !== currentSlide}
            >
              {shouldLoad(index) && <SlideRenderer slide={slide} />}
            </div>
          ))}
        </div>

        {/* Navigation zones */}
        <Navigation
          onPrev={prevSlide}
          onNext={nextSlide}
          canGoPrev={!isFirstSlide}
          canGoNext={!isLastSlide}
        />

        {/* Music player overlay */}
        {playlist ? (
          <YouTubePlayerOverlay
            isOpen={musicPlayerOpen}
            isReady={ytPlayer.isReady}
            currentTrackIndex={currentTrackIndex}
            playVideoAt={ytPlayer.playVideoAt}
            play={ytPlayer.play}
            elementId={YT_ELEMENT_ID}
          />
        ) : (
          <MusicPlayerOverlay
            music={activeMusic ?? undefined}
            isOpen={musicPlayerOpen}
          />
        )}

        {/* Progress bar */}
        <ProgressBar
          current={currentSlide}
          total={slides.length}
          onSlideClick={goToSlide}
        />

        {/* Controls */}
        <Controls
          onToggleOverview={toggleOverview}
          onToggleFullscreen={toggleFullscreen}
          onToggleAutoPlay={toggleAutoPlay}
          onToggleMusicPlayer={toggleMusicPlayer}
          onToggleMute={playlist ? ytPlayer.toggleMute : undefined}
          isAutoPlaying={isAutoPlaying}
          isMuted={playlist ? ytPlayer.isMuted : false}
          isFullscreen={isFullscreen}
          musicPlayerOpen={musicPlayerOpen}
          hasMusicOnCurrentSlide={hasMusicOnCurrentSlide}
        />
      </main>

      {/* Slide overview modal */}
      {showOverview && (
        <SlideOverview
          slides={slides}
          currentSlide={currentSlide}
          onSlideSelect={goToSlide}
          onClose={() => setShowOverview(false)}
        />
      )}
    </div>
    </LanguageProvider>
  );
}

export default App;

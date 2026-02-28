import { useState, useCallback } from 'react';
import slidesData from './content/slides.yaml';
import { processSlides } from './utils/yamlLoader';
import type { Slide } from './types/slides';
import {
  SlideRenderer,
  Navigation,
  ProgressBar,
  SlideOverview,
  PresenterNotes,
  Controls,
} from './components';
import {
  useSlideNavigation,
  useKeyboardControls,
  useSwipeGesture,
  useFullscreen,
  useLazyLoad,
} from './hooks';

// Process slides from YAML
const slides: Slide[] = processSlides(slidesData);

function App() {
  const [showOverview, setShowOverview] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);

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

  const togglePresenterMode = useCallback(() => {
    setShowPresenterNotes(prev => !prev);
  }, []);

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
    onTogglePresenterMode: togglePresenterMode,
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

  const currentSlideData = slides[currentSlide];

  return (
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

        {/* Presenter notes */}
        <PresenterNotes
          slide={currentSlideData}
          isVisible={showPresenterNotes}
        />

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
          onTogglePresenterMode={togglePresenterMode}
          isAutoPlaying={isAutoPlaying}
          isPresenterMode={showPresenterNotes}
          isFullscreen={isFullscreen}
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
  );
}

export default App;

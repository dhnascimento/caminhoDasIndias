import { useState, useCallback, useEffect } from 'react';

interface UseSlideNavigationProps {
  totalSlides: number;
  autoPlayInterval?: number;
}

export type SlideDirection = 'forward' | 'backward';

interface UseSlideNavigationReturn {
  currentSlide: number;
  direction: SlideDirection;
  isFirstSlide: boolean;
  isLastSlide: boolean;
  goToSlide: (index: number) => void;
  nextSlide: () => void;
  prevSlide: () => void;
  isAutoPlaying: boolean;
  toggleAutoPlay: () => void;
  setAutoPlayInterval: (interval: number) => void;
}

export function useSlideNavigation({
  totalSlides,
  autoPlayInterval: initialInterval = 5000,
}: UseSlideNavigationProps): UseSlideNavigationReturn {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState<SlideDirection>('forward');
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [autoPlayInterval, setAutoPlayInterval] = useState(initialInterval);

  const isFirstSlide = currentSlide === 0;
  const isLastSlide = currentSlide === totalSlides - 1;

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setDirection(index >= currentSlide ? 'forward' : 'backward');
      setCurrentSlide(index);
    }
  }, [totalSlides, currentSlide]);

  const nextSlide = useCallback(() => {
    if (!isLastSlide) {
      setDirection('forward');
      setCurrentSlide(prev => prev + 1);
    } else if (isAutoPlaying) {
      // Loop back to start in autoplay mode
      setDirection('forward');
      setCurrentSlide(0);
    }
  }, [isLastSlide, isAutoPlaying]);

  const prevSlide = useCallback(() => {
    if (!isFirstSlide) {
      setDirection('backward');
      setCurrentSlide(prev => prev - 1);
    }
  }, [isFirstSlide]);

  const toggleAutoPlay = useCallback(() => {
    setIsAutoPlaying(prev => !prev);
  }, []);

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [isAutoPlaying, autoPlayInterval, nextSlide]);

  // Update URL hash when slide changes
  useEffect(() => {
    const newHash = `#slide-${currentSlide + 1}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, '', newHash);
    }
  }, [currentSlide]);

  // Read initial slide from URL hash
  useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/^#slide-(\d+)$/);
    if (match) {
      const slideNum = parseInt(match[1], 10) - 1;
      if (slideNum >= 0 && slideNum < totalSlides) {
        setCurrentSlide(slideNum);
      }
    }
  }, [totalSlides]);

  return {
    currentSlide,
    direction,
    isFirstSlide,
    isLastSlide,
    goToSlide,
    nextSlide,
    prevSlide,
    isAutoPlaying,
    toggleAutoPlay,
    setAutoPlayInterval,
  };
}

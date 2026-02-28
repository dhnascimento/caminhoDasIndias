import { useState, useEffect } from 'react';

interface UseLazyLoadProps {
  currentSlide: number;
  totalSlides: number;
  preloadAhead?: number;
  preloadBehind?: number;
}

/**
 * Hook that determines which slides should be loaded based on current position.
 * Helps with performance by only loading nearby slides.
 */
export function useLazyLoad({
  currentSlide,
  totalSlides,
  preloadAhead = 2,
  preloadBehind = 1,
}: UseLazyLoadProps) {
  const [loadedSlides, setLoadedSlides] = useState<Set<number>>(new Set([0]));

  useEffect(() => {
    const newLoaded = new Set(loadedSlides);

    // Calculate range of slides to load
    const start = Math.max(0, currentSlide - preloadBehind);
    const end = Math.min(totalSlides - 1, currentSlide + preloadAhead);

    // Add slides in range
    for (let i = start; i <= end; i++) {
      newLoaded.add(i);
    }

    // Only update if set has changed
    if (newLoaded.size !== loadedSlides.size) {
      setLoadedSlides(newLoaded);
    }
  }, [currentSlide, totalSlides, preloadAhead, preloadBehind, loadedSlides]);

  const shouldLoad = (slideIndex: number): boolean => {
    return loadedSlides.has(slideIndex);
  };

  const isNearby = (slideIndex: number): boolean => {
    return Math.abs(slideIndex - currentSlide) <= preloadAhead;
  };

  return { shouldLoad, isNearby, loadedSlides };
}

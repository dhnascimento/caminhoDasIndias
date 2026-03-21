import { useState, useEffect, useRef, useCallback } from 'react';
import type { SlideDirection } from './useSlideNavigation';

export type TransitionType = 'fade';

const TRANSITION_DURATION = 500;

interface UseSlideTransitionProps {
  currentSlide: number;
  direction: SlideDirection;
}

interface UseSlideTransitionReturn {
  previousSlide: number | null;
  isTransitioning: boolean;
  transitionType: TransitionType;
  getSlideClassName: (index: number) => string;
}

export function useSlideTransition({
  currentSlide,
}: UseSlideTransitionProps): UseSlideTransitionReturn {
  const [previousSlide, setPreviousSlide] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevSlideRef = useRef(currentSlide);

  const transitionType: TransitionType = 'fade';

  useEffect(() => {
    if (prevSlideRef.current === currentSlide) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const prev = prevSlideRef.current;
    prevSlideRef.current = currentSlide;

    setPreviousSlide(prev);
    setIsTransitioning(true);

    timerRef.current = setTimeout(() => {
      setIsTransitioning(false);
      setPreviousSlide(null);
      timerRef.current = null;
    }, TRANSITION_DURATION);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [currentSlide]);

  const getSlideClassName = useCallback(
    (index: number): string => {
      if (index === currentSlide) {
        return 'transition-opacity duration-500 opacity-100 z-10';
      }
      if (index === previousSlide && isTransitioning) {
        return 'transition-opacity duration-500 opacity-0 z-[9]';
      }
      return 'transition-opacity duration-500 opacity-0 z-0 pointer-events-none';
    },
    [currentSlide, previousSlide, isTransitioning],
  );

  return {
    previousSlide,
    isTransitioning,
    transitionType,
    getSlideClassName,
  };
}

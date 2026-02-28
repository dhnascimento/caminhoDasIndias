import { useEffect, useRef, useCallback } from 'react';

interface UseSwipeGestureProps {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  enabled?: boolean;
}

interface TouchState {
  startX: number;
  startY: number;
  startTime: number;
}

export function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  enabled = true,
}: UseSwipeGestureProps) {
  const touchState = useRef<TouchState | null>(null);

  const handleTouchStart = useCallback((event: TouchEvent) => {
    if (!enabled) return;

    const touch = event.touches[0];
    touchState.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, [enabled]);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    if (!enabled || !touchState.current) return;

    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - touchState.current.startX;
    const deltaY = touch.clientY - touchState.current.startY;
    const deltaTime = Date.now() - touchState.current.startTime;

    // Only register swipes that are quick enough (under 500ms)
    if (deltaTime > 500) {
      touchState.current = null;
      return;
    }

    const absDeltaX = Math.abs(deltaX);
    const absDeltaY = Math.abs(deltaY);

    // Determine if this is a horizontal or vertical swipe
    if (absDeltaX > absDeltaY && absDeltaX > threshold) {
      // Horizontal swipe
      if (deltaX > 0) {
        onSwipeRight();
      } else {
        onSwipeLeft();
      }
    } else if (absDeltaY > absDeltaX && absDeltaY > threshold) {
      // Vertical swipe
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    touchState.current = null;
  }, [enabled, threshold, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown]);

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchEnd]);
}

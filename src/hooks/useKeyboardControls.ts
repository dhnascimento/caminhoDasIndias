import { useEffect, useCallback } from 'react';

interface UseKeyboardControlsProps {
  onNext: () => void;
  onPrev: () => void;
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  onTogglePresenterMode?: () => void;
  onEscape?: () => void;
  enabled?: boolean;
}

export function useKeyboardControls({
  onNext,
  onPrev,
  onToggleOverview,
  onToggleFullscreen,
  onTogglePresenterMode,
  onEscape,
  enabled = true,
}: UseKeyboardControlsProps) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Don't capture keys when typing in inputs
    if (
      event.target instanceof HTMLInputElement ||
      event.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowDown':
      case ' ': // Space
      case 'PageDown':
        event.preventDefault();
        onNext();
        break;

      case 'ArrowLeft':
      case 'ArrowUp':
      case 'PageUp':
        event.preventDefault();
        onPrev();
        break;

      case 'Escape':
        event.preventDefault();
        if (onEscape) {
          onEscape();
        } else {
          onToggleOverview();
        }
        break;

      case 'f':
      case 'F':
        event.preventDefault();
        onToggleFullscreen();
        break;

      case 'g':
      case 'G':
        // Grid/overview mode
        event.preventDefault();
        onToggleOverview();
        break;

      case 'p':
      case 'P':
        // Presenter mode
        if (onTogglePresenterMode) {
          event.preventDefault();
          onTogglePresenterMode();
        }
        break;

      case 'Home':
        event.preventDefault();
        // Go to first slide - handled by calling onPrev multiple times or externally
        break;

      case 'End':
        event.preventDefault();
        // Go to last slide - handled externally
        break;
    }
  }, [enabled, onNext, onPrev, onToggleOverview, onToggleFullscreen, onTogglePresenterMode, onEscape]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}

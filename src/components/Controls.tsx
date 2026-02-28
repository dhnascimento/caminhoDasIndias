import { ThemeSwitcher } from './ThemeSwitcher';
import {
  GridIcon,
  ExpandIcon,
  PlayIcon,
  PauseIcon,
  NotesIcon,
} from './icons';

interface ControlsProps {
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  onToggleAutoPlay: () => void;
  onTogglePresenterMode: () => void;
  isAutoPlaying: boolean;
  isPresenterMode: boolean;
  isFullscreen: boolean;
}

export function Controls({
  onToggleOverview,
  onToggleFullscreen,
  onToggleAutoPlay,
  onTogglePresenterMode,
  isAutoPlaying,
  isPresenterMode,
  isFullscreen,
}: ControlsProps) {
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {/* Presenter mode toggle */}
      <button
        onClick={onTogglePresenterMode}
        className={`btn-control ${isPresenterMode ? 'bg-[var(--color-primary)]/30' : ''}`}
        aria-label={isPresenterMode ? 'Hide presenter notes' : 'Show presenter notes'}
        title="Toggle presenter notes (P)"
      >
        <NotesIcon className="w-5 h-5" />
      </button>

      {/* Auto-play toggle */}
      <button
        onClick={onToggleAutoPlay}
        className={`btn-control ${isAutoPlaying ? 'bg-[var(--color-primary)]/30' : ''}`}
        aria-label={isAutoPlaying ? 'Stop auto-play' : 'Start auto-play'}
        title="Toggle auto-play"
      >
        {isAutoPlaying ? (
          <PauseIcon className="w-5 h-5" />
        ) : (
          <PlayIcon className="w-5 h-5" />
        )}
      </button>

      {/* Grid/overview */}
      <button
        onClick={onToggleOverview}
        className="btn-control"
        aria-label="Show slide overview"
        title="Slide overview (G or Esc)"
      >
        <GridIcon className="w-5 h-5" />
      </button>

      {/* Fullscreen */}
      <button
        onClick={onToggleFullscreen}
        className={`btn-control ${isFullscreen ? 'bg-[var(--color-primary)]/30' : ''}`}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title="Fullscreen (F)"
      >
        <ExpandIcon className="w-5 h-5" />
      </button>

      {/* Theme switcher */}
      <ThemeSwitcher />
    </div>
  );
}

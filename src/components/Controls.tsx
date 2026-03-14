import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  GridIcon,
  ExpandIcon,
  PlayIcon,
  PauseIcon,
  MusicNoteIcon,
  VolumeOnIcon,
  VolumeOffIcon,
} from './icons';

interface ControlsProps {
  onToggleOverview: () => void;
  onToggleFullscreen: () => void;
  onToggleAutoPlay: () => void;
  onToggleMusicPlayer: () => void;
  onToggleMute?: () => void;
  isAutoPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  musicPlayerOpen: boolean;
  hasMusicOnCurrentSlide: boolean;
}

export function Controls({
  onToggleOverview,
  onToggleFullscreen,
  onToggleAutoPlay,
  onToggleMusicPlayer,
  onToggleMute,
  isAutoPlaying,
  isMuted,
  isFullscreen,
  musicPlayerOpen,
  hasMusicOnCurrentSlide,
}: ControlsProps) {
  return (
    <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
      {/* Mute toggle */}
      {hasMusicOnCurrentSlide && onToggleMute && (
        <button
          onClick={onToggleMute}
          className={`btn-control ${isMuted ? 'bg-[var(--color-primary)]/30' : ''}`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <VolumeOffIcon className="w-5 h-5" />
          ) : (
            <VolumeOnIcon className="w-5 h-5" />
          )}
        </button>
      )}

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

      {/* Music player toggle */}
      {hasMusicOnCurrentSlide && (
        <button
          onClick={onToggleMusicPlayer}
          className={`btn-control ${musicPlayerOpen ? 'bg-[var(--color-primary)]/30' : ''}`}
          aria-label={musicPlayerOpen ? 'Hide music player' : 'Show music player'}
          title="Toggle music player (M)"
        >
          <MusicNoteIcon className="w-5 h-5" />
        </button>
      )}

      {/* Language switcher */}
      <LanguageSwitcher />

      {/* Theme switcher */}
      <ThemeSwitcher />
    </div>
  );
}

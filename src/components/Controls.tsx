import { useState, useRef, useEffect } from 'react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { LanguageSwitcher } from './LanguageSwitcher';
import {
  GridIcon,
  ExpandIcon,
  PlayIcon,
  PauseIcon,
  YouTubeIcon,
  VolumeOnIcon,
  VolumeOffIcon,
  MenuIcon,
  CloseIcon,
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const buttons = (
    <>
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
          <YouTubeIcon className="w-5 h-5" />
        </button>
      )}

      {/* Language switcher */}
      <LanguageSwitcher />

      {/* Theme switcher */}
      <ThemeSwitcher />
    </>
  );

  return (
    <>
      {/* Desktop: horizontal toolbar */}
      <div className="hidden md:flex fixed top-4 right-4 z-40 items-center gap-2">
        {buttons}
      </div>

      {/* Mobile: collapsible vertical menu */}
      <div ref={menuRef} className="md:hidden fixed top-4 right-4 z-40">
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          className="btn-control"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          {menuOpen ? (
            <CloseIcon className="w-5 h-5" />
          ) : (
            <MenuIcon className="w-5 h-5" />
          )}
        </button>

        {menuOpen && (
          <div className="absolute top-12 right-0 flex flex-col gap-2 animate-fade-in">
            {buttons}
          </div>
        )}
      </div>
    </>
  );
}

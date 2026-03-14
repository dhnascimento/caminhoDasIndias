import { useEffect, useRef } from 'react';

interface YouTubePlayerOverlayProps {
  isOpen: boolean;
  isReady: boolean;
  currentTrackIndex: number;
  playVideoAt: (index: number) => void;
  play: () => void;
  elementId: string;
}

export function YouTubePlayerOverlay({
  isOpen,
  isReady,
  currentTrackIndex,
  playVideoAt,
  play,
  elementId,
}: YouTubePlayerOverlayProps) {
  const pendingTrackRef = useRef(-1);

  // Sync track index when it changes
  useEffect(() => {
    if (currentTrackIndex < 0) return;

    if (isReady) {
      playVideoAt(currentTrackIndex);
    } else {
      pendingTrackRef.current = currentTrackIndex;
    }
  }, [currentTrackIndex, isReady, playVideoAt]);

  // When player becomes ready, apply buffered track and start playback
  useEffect(() => {
    if (!isReady) return;

    if (pendingTrackRef.current >= 0) {
      playVideoAt(pendingTrackRef.current);
      pendingTrackRef.current = -1;
    }
    play();
  }, [isReady, playVideoAt, play]);

  return (
    <div
      className={`absolute bottom-6 right-6 z-20 transition-all ${
        isOpen
          ? 'hidden sm:block'
          : 'w-px h-px overflow-hidden opacity-0 pointer-events-none'
      }`}
    >
      <div className="rounded-xl overflow-hidden shadow-lg w-[320px] h-[180px]">
        <div id={elementId} />
      </div>
    </div>
  );
}

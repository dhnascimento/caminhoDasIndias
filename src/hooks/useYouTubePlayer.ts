import { useState, useRef, useEffect, useCallback } from 'react';

function extractPlaylistId(input: string): string {
  try {
    const url = new URL(input);
    return url.searchParams.get('list') ?? input;
  } catch {
    // Bare ID — strip any query-like suffixes (e.g. "&pp=sAgC" from copy-paste)
    return input.split('&')[0].split('?')[0];
  }
}

// Module-level singleton for API loading
let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeAPI(): Promise<void> {
  if (apiLoadPromise) return apiLoadPromise;

  if (window.YT?.Player) {
    apiLoadPromise = Promise.resolve();
    return apiLoadPromise;
  }

  apiLoadPromise = new Promise<void>((resolve) => {
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      resolve();
    };
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
  });
  return apiLoadPromise;
}

interface UseYouTubePlayerProps {
  playlistId: string;
  elementId: string;
}

interface UseYouTubePlayerReturn {
  isReady: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  playVideoAt: (index: number) => void;
  play: () => void;
  pause: () => void;
  togglePlayback: () => void;
  toggleMute: () => void;
}

export function useYouTubePlayer({
  playlistId,
  elementId,
}: UseYouTubePlayerProps): UseYouTubePlayerReturn {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<YT.Player | null>(null);
  const currentTrackRef = useRef(-1);

  useEffect(() => {
    if (!playlistId) return;
    let destroyed = false;

    loadYouTubeAPI().then(() => {
      if (destroyed) return;

      const id = extractPlaylistId(playlistId);
      playerRef.current = new YT.Player(elementId, {
        height: 180,
        width: 320,
        playerVars: {
          listType: 'playlist',
          list: id,
          autoplay: 1,
          mute: 1,
          controls: 1,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => {
            if (!destroyed) setIsReady(true);
          },
          onStateChange: (event) => {
            if (!destroyed) {
              setIsPlaying(event.data === 1); // YT.PlayerState.PLAYING
            }
          },
        },
      });
    });

    return () => {
      destroyed = true;
      playerRef.current?.destroy();
      playerRef.current = null;
      setIsReady(false);
    };
  }, [playlistId, elementId]);

  const playVideoAt = useCallback(
    (index: number) => {
      if (!playerRef.current || !isReady) return;
      if (currentTrackRef.current === index) return;
      currentTrackRef.current = index;
      playerRef.current.playVideoAt(index);
    },
    [isReady],
  );

  const play = useCallback(() => {
    playerRef.current?.playVideo();
  }, []);

  const pause = useCallback(() => {
    playerRef.current?.pauseVideo();
  }, []);

  const togglePlayback = useCallback(() => {
    if (!playerRef.current) return;
    const state = playerRef.current.getPlayerState();
    if (state === 1) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  }, []);

  const toggleMute = useCallback(() => {
    if (!playerRef.current) return;
    if (playerRef.current.isMuted()) {
      playerRef.current.unMute();
      setIsMuted(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  }, []);

  return { isReady, isPlaying, isMuted, playVideoAt, play, pause, togglePlayback, toggleMute };
}

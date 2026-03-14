/// <reference types="vite/client" />

declare module '*.yaml' {
  const content: unknown;
  export default content;
}

declare module '*.yml' {
  const content: unknown;
  export default content;
}

// YouTube IFrame Player API types
declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);
    playVideoAt(index: number): void;
    playVideo(): void;
    pauseVideo(): void;
    mute(): void;
    unMute(): void;
    isMuted(): boolean;
    getPlayerState(): number;
    destroy(): void;
  }
  interface PlayerOptions {
    height?: number | string;
    width?: number | string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (event: { target: Player }) => void;
      onStateChange?: (event: { data: number }) => void;
    };
  }
  const PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

interface Window {
  onYouTubeIframeAPIReady?: () => void;
  YT?: typeof YT;
}

import { useState, useCallback, useEffect } from 'react';

interface UseFullscreenReturn {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
  exitFullscreen: () => void;
  isSupported: boolean;
}

export function useFullscreen(): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const isSupported = !!(
    document.fullscreenEnabled ||
    // @ts-expect-error - webkit prefix
    document.webkitFullscreenEnabled ||
    // @ts-expect-error - moz prefix
    document.mozFullScreenEnabled ||
    // @ts-expect-error - ms prefix
    document.msFullscreenEnabled
  );

  const enterFullscreen = useCallback(async () => {
    try {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      // @ts-expect-error - webkit prefix
      } else if (elem.webkitRequestFullscreen) {
        // @ts-expect-error - webkit prefix
        await elem.webkitRequestFullscreen();
      // @ts-expect-error - moz prefix
      } else if (elem.mozRequestFullScreen) {
        // @ts-expect-error - moz prefix
        await elem.mozRequestFullScreen();
      // @ts-expect-error - ms prefix
      } else if (elem.msRequestFullscreen) {
        // @ts-expect-error - ms prefix
        await elem.msRequestFullscreen();
      }
    } catch (error) {
      console.error('Failed to enter fullscreen:', error);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    try {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      // @ts-expect-error - webkit prefix
      } else if (document.webkitExitFullscreen) {
        // @ts-expect-error - webkit prefix
        await document.webkitExitFullscreen();
      // @ts-expect-error - moz prefix
      } else if (document.mozCancelFullScreen) {
        // @ts-expect-error - moz prefix
        await document.mozCancelFullScreen();
      // @ts-expect-error - ms prefix
      } else if (document.msExitFullscreen) {
        // @ts-expect-error - ms prefix
        await document.msExitFullscreen();
      }
    } catch (error) {
      console.error('Failed to exit fullscreen:', error);
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  return {
    isFullscreen,
    toggleFullscreen,
    enterFullscreen,
    exitFullscreen,
    isSupported,
  };
}

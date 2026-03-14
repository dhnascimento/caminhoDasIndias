import type { PlaylistConfig } from '../types/slides';

/**
 * Build a lookup array where index = slideIndex, value = trackIndex (or -1 if unmapped).
 * O(totalSlides) construction, O(1) lookup per slide transition.
 */
export function buildSlideToTrackMap(
  playlist: PlaylistConfig,
  totalSlides: number,
): number[] {
  const map = new Array<number>(totalSlides).fill(-1);
  playlist.tracks.forEach((track, trackIndex) => {
    const [start, end] = track.slides;
    for (let i = Math.max(0, start); i <= Math.min(end, totalSlides - 1); i++) {
      map[i] = trackIndex;
    }
  });
  return map;
}

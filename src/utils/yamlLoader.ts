/**
 * YAML Content Loader
 *
 * Utilities for loading and validating slide content from YAML.
 */

import type { Slide, PlaylistConfig, PlaylistTrackMapping } from '../types/slides';

export interface ProcessedContent {
  slides: Slide[];
  playlist: PlaylistConfig | null;
}

/**
 * Validates that a slide has all required fields for its type.
 * Returns the slide if valid, or logs a warning and returns a placeholder.
 */
export function validateSlide(slide: unknown, index: number): Slide | null {
  if (!slide || typeof slide !== 'object') {
    console.warn(`Slide ${index + 1}: Invalid slide format`);
    return null;
  }

  const s = slide as Record<string, unknown>;

  if (!s.type || typeof s.type !== 'string') {
    console.warn(`Slide ${index + 1}: Missing or invalid 'type' field`);
    return null;
  }

  // Validate based on type
  switch (s.type) {
    case 'title':
      if (!s.title) {
        console.warn(`Slide ${index + 1}: Title slide missing 'title' field`);
        return null;
      }
      break;

    case 'divider':
      if (!s.title) {
        console.warn(`Slide ${index + 1}: Divider slide missing 'title' field`);
        return null;
      }
      break;

    case 'photo':
      if (!s.photo) {
        console.warn(`Slide ${index + 1}: Photo slide missing 'photo' field`);
        return null;
      }
      break;

    case 'gallery':
      if (!s.photos || !Array.isArray(s.photos) || s.photos.length === 0) {
        console.warn(`Slide ${index + 1}: Gallery slide missing or empty 'photos' array`);
        return null;
      }
      break;

    case 'story':
      if (!s.photo || !s.text) {
        console.warn(`Slide ${index + 1}: Story slide missing 'photo' or 'text' field`);
        return null;
      }
      break;

    case 'video':
      if (!s.src) {
        console.warn(`Slide ${index + 1}: Video slide missing 'src' field`);
        return null;
      }
      break;

    case 'closing':
      if (!s.title) {
        console.warn(`Slide ${index + 1}: Closing slide missing 'title' field`);
        return null;
      }
      break;

    case 'comparison':
      if (!s.photos || !Array.isArray(s.photos) || s.photos.length < 2) {
        console.warn(`Slide ${index + 1}: Comparison slide needs at least 2 photos`);
        return null;
      }
      break;

    default:
      console.warn(`Slide ${index + 1}: Unknown slide type '${s.type}'`);
      return null;
  }

  return slide as Slide;
}

/**
 * Validates a playlist configuration object.
 */
function validatePlaylist(raw: unknown): PlaylistConfig | null {
  if (!raw || typeof raw !== 'object') return null;
  const p = raw as Record<string, unknown>;
  if (typeof p.youtube !== 'string' || !p.youtube) {
    console.warn('Playlist: missing "youtube" field');
    return null;
  }
  if (!Array.isArray(p.tracks) || p.tracks.length === 0) {
    console.warn('Playlist: missing or empty "tracks" array');
    return null;
  }
  const tracks = (p.tracks as Record<string, unknown>[])
    .map((t, i): PlaylistTrackMapping | null => {
      if (
        !Array.isArray(t.slides) ||
        t.slides.length !== 2 ||
        typeof t.slides[0] !== 'number' ||
        typeof t.slides[1] !== 'number'
      ) {
        console.warn(`Playlist track ${i}: "slides" must be [startIndex, endIndex]`);
        return null;
      }
      return { slides: t.slides as [number, number] };
    })
    .filter((t): t is PlaylistTrackMapping => t !== null);

  return { youtube: p.youtube, tracks };
}

/**
 * Processes raw YAML content into validated slides and optional playlist config.
 * Accepts either a plain array (backwards compatible) or an object with { playlist?, slides }.
 */
export function processSlides(rawContent: unknown): ProcessedContent {
  // Backward compatibility: plain array = no playlist
  if (Array.isArray(rawContent)) {
    const validSlides: Slide[] = [];
    for (let i = 0; i < rawContent.length; i++) {
      const slide = validateSlide(rawContent[i], i);
      if (slide) validSlides.push(slide);
    }
    return { slides: validSlides, playlist: null };
  }

  // Object format: { playlist?, slides }
  if (rawContent && typeof rawContent === 'object') {
    const obj = rawContent as Record<string, unknown>;
    const rawSlides = Array.isArray(obj.slides) ? obj.slides : [];
    const playlist = obj.playlist ? validatePlaylist(obj.playlist) : null;

    const validSlides: Slide[] = [];
    for (let i = 0; i < rawSlides.length; i++) {
      const slide = validateSlide(rawSlides[i], i);
      if (slide) validSlides.push(slide);
    }
    return { slides: validSlides, playlist };
  }

  console.error('Slides content must be an array or an object with a "slides" key');
  return { slides: [], playlist: null };
}

/**
 * Resolves a photo path to a full URL.
 * Handles both absolute and relative paths.
 */
export function resolvePhotoPath(path: string): string {
  if (!path) return '';

  // Already absolute URL
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Already starts with /
  if (path.startsWith('/')) {
    return path;
  }

  // Relative path - prepend /
  return `/${path}`;
}

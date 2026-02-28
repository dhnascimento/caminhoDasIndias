/**
 * YAML Content Loader
 *
 * Utilities for loading and validating slide content from YAML.
 */

import type { Slide } from '../types/slides';

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
 * Processes raw YAML content into validated slides array.
 */
export function processSlides(rawContent: unknown): Slide[] {
  if (!Array.isArray(rawContent)) {
    console.error('Slides content must be an array');
    return [];
  }

  const validSlides: Slide[] = [];

  for (let i = 0; i < rawContent.length; i++) {
    const slide = validateSlide(rawContent[i], i);
    if (slide) {
      validSlides.push(slide);
    }
  }

  return validSlides;
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

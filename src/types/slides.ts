/**
 * Slide Types and Interfaces
 *
 * This file defines all the TypeScript types for the slideshow content.
 * The slides.yaml file should match these structures.
 */

// Bilingual string: either a plain string (no translation) or a locale object
export type LocalizedString = string | { en: string; pt: string };

// Music track for embedded player (Tidal or Spotify)
export interface MusicTrack {
  provider: 'tidal' | 'spotify';
  /** Full track URL copied from the browser, e.g. https://tidal.com/browse/track/12345678 */
  url: string;
}

// YouTube playlist configuration
export interface PlaylistTrackMapping {
  /** [startSlide, endSlide] inclusive range, 0-indexed */
  slides: [number, number];
}

export interface PlaylistConfig {
  /** YouTube playlist ID (e.g. "PLxxxxxxxx") or full URL */
  youtube: string;
  /** Maps each playlist track index to a slide range */
  tracks: PlaylistTrackMapping[];
}

// Common optional fields that any slide can have
export interface SlideEnrichments {
  /** Embedded music player (Tidal or Spotify) */
  music?: MusicTrack;
  /** Location name - shows as a subtle tag */
  location?: string;
  /** Google Maps embed URL */
  map_embed?: string;
  /** Fun fact shown as an overlay or callout */
  fun_fact?: LocalizedString;
  /** Notes (metadata only, not displayed in the UI) */
  notes?: string;
}

// Base slide with common fields
interface BaseSlide extends SlideEnrichments {
  type: string;
}

// 1. Title Slide
export interface TitleSlide extends BaseSlide {
  type: 'title';
  title: LocalizedString;
  subtitle?: LocalizedString;
  photo?: string;
}

// 2. Day/Section Divider
export interface DividerSlide extends BaseSlide {
  type: 'divider';
  day?: number;
  title: LocalizedString;
  date?: LocalizedString;
  subtitle?: LocalizedString;
  photo?: string;
}

// 3. Single Photo with Caption
export interface PhotoSlide extends BaseSlide {
  type: 'photo';
  photo: string;
  caption?: LocalizedString;
  subcaption?: LocalizedString;
}

// 4. Photo Gallery (grid)
export interface GalleryPhoto {
  src: string;
  caption?: LocalizedString;
}

export interface GallerySlide extends BaseSlide {
  type: 'gallery';
  title?: LocalizedString;
  photos: GalleryPhoto[];
  caption?: LocalizedString;
  /** Mobile layout for gallery images: auto (default), scroll, column, grid-2 */
  mobile_layout?: 'auto' | 'scroll' | 'column' | 'grid-2';
}

// 5. Photo + Text Side by Side
export interface StorySlide extends BaseSlide {
  type: 'story';
  photo?: string;
  title?: LocalizedString;
  text: LocalizedString;
  layout?: 'photo-left' | 'photo-right';
}

// 6. Video Slide
export interface VideoSlide extends BaseSlide {
  type: 'video';
  src: string;
  caption?: LocalizedString;
  poster?: string;
}

// 7. Closing/Credits Slide
export interface ClosingSlide extends BaseSlide {
  type: 'closing';
  title: LocalizedString;
  text?: LocalizedString;
  photo?: string;
}

// 8. Comparison / Before-After
export interface ComparisonPhoto {
  src: string;
  label?: LocalizedString;
}

export interface ComparisonSlide extends BaseSlide {
  type: 'comparison';
  title?: LocalizedString;
  photos: ComparisonPhoto[];
  caption?: LocalizedString;
}

// Union of all slide types
export type Slide =
  | TitleSlide
  | DividerSlide
  | PhotoSlide
  | GallerySlide
  | StorySlide
  | VideoSlide
  | ClosingSlide
  | ComparisonSlide;

// Theme names
export type ThemeName = 'festive' | 'minimal-light' | 'minimal-dark' | 'warm-documentary';

// Theme configuration
export interface Theme {
  id: ThemeName;
  name: string;
  description: string;
}

export const THEMES: Theme[] = [
  {
    id: 'festive',
    name: 'Festive',
    description: 'Warm, vibrant Indian wedding colors'
  },
  {
    id: 'minimal-light',
    name: 'Minimal Light',
    description: 'Clean white background'
  },
  {
    id: 'minimal-dark',
    name: 'Minimal Dark',
    description: 'Clean dark background'
  },
  {
    id: 'warm-documentary',
    name: 'Documentary',
    description: 'Muted earth tones, editorial feel'
  },
];

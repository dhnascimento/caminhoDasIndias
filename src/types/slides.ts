/**
 * Slide Types and Interfaces
 *
 * This file defines all the TypeScript types for the slideshow content.
 * The slides.yaml file should match these structures.
 */

// Common optional fields that any slide can have
export interface SlideEnrichments {
  /** Spotify track URL - shows a small embed or link */
  music?: string;
  /** Location name - shows as a subtle tag */
  location?: string;
  /** Google Maps embed URL */
  map_embed?: string;
  /** Fun fact shown as an overlay or callout */
  fun_fact?: string;
  /** Presenter notes - not shown in slides, only in presenter mode */
  notes?: string;
}

// Base slide with common fields
interface BaseSlide extends SlideEnrichments {
  type: string;
}

// 1. Title Slide
export interface TitleSlide extends BaseSlide {
  type: 'title';
  title: string;
  subtitle?: string;
  photo?: string;
}

// 2. Day/Section Divider
export interface DividerSlide extends BaseSlide {
  type: 'divider';
  day?: number;
  title: string;
  date?: string;
  subtitle?: string;
  photo?: string;
}

// 3. Single Photo with Caption
export interface PhotoSlide extends BaseSlide {
  type: 'photo';
  photo: string;
  caption?: string;
  subcaption?: string;
}

// 4. Photo Gallery (grid)
export interface GalleryPhoto {
  src: string;
  caption?: string;
}

export interface GallerySlide extends BaseSlide {
  type: 'gallery';
  title?: string;
  photos: GalleryPhoto[];
  caption?: string;
}

// 5. Photo + Text Side by Side
export interface StorySlide extends BaseSlide {
  type: 'story';
  photo: string;
  title?: string;
  text: string;
  layout?: 'photo-left' | 'photo-right';
}

// 6. Video Slide
export interface VideoSlide extends BaseSlide {
  type: 'video';
  src: string;
  caption?: string;
  poster?: string;
}

// 7. Closing/Credits Slide
export interface ClosingSlide extends BaseSlide {
  type: 'closing';
  title: string;
  text?: string;
  photo?: string;
}

// 8. Comparison / Before-After
export interface ComparisonPhoto {
  src: string;
  label?: string;
}

export interface ComparisonSlide extends BaseSlide {
  type: 'comparison';
  title?: string;
  photos: ComparisonPhoto[];
  caption?: string;
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

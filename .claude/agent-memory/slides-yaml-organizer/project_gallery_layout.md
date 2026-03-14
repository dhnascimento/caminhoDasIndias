---
name: Gallery layout behavior
description: Gallery renders equal-height rows and normalizes outlier orientations
type: project
---

The gallery component (`GallerySlide.tsx`) renders all images in equal-height horizontal rows using flexbox. It detects the dominant orientation (portrait vs landscape) among photos and forces outliers to match using `object-cover` with a fixed aspect ratio.

**Why:** Mixed orientations in a single gallery cause unbalanced layouts. The normalization keeps slides visually clean.
**How to apply:** When organizing photos into galleries, group photos with similar orientations together. If a folder has a mix of portrait and landscape shots, split them into separate gallery slides rather than combining them.

---
name: Media folder structure and numbering
description: How media files are organized in public/media/ and how numbering maps to slides
type: project
---

Media is stored in `public/media/` in event-named folders (e.g., `Wedding - Sangeet/`, `Jaipur - Arrival/`).

Files are numbered by tens to indicate slide groupings:
- `01` = standalone slide (story cover or single video)
- `10, 11, 12, 13` = gallery slide (all items in the tens group)
- `(video)` suffix = video slide type
- Each tens boundary starts a new slide

**Why:** This convention was established by the user to make it easy to organize media into slides without explicit configuration.
**How to apply:** When processing a new media folder, sort files by number, group by tens prefix, and create the appropriate slide type for each group.

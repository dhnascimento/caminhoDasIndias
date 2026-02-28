# How to Edit Your Slideshow

Welcome! This guide will help you customize the slideshow with your own photos and text. No coding experience needed!

## The Basics

All your slideshow content lives in one file:
```
src/content/slides.yaml
```

Open this file in any text editor (even Notepad works!) to make changes.

## Adding Photos

1. Copy your photos into the `public/photos/` folder
2. In slides.yaml, reference them like: `photo: "photos/your-photo.jpg"`

That's it! The slideshow will display them automatically.

## Slide Types (Copy & Paste Templates)

### Title Slide
The opening slide with a big title.

```yaml
- type: title
  title: "Your Trip Title"
  subtitle: "Dates and Location"
  photo: "photos/your-hero-image.jpg"
```

### Day Divider
Use between days or sections.

```yaml
- type: divider
  day: 1
  title: "Day Title"
  date: "February 15, 2026"
  subtitle: "Optional subtitle"
  photo: "photos/background.jpg"
```

### Single Photo
Show one photo with a caption.

```yaml
- type: photo
  photo: "photos/your-photo.jpg"
  caption: "Main caption text"
  subcaption: "Smaller text below (optional)"
```

### Photo Gallery
Show multiple photos in a grid.

```yaml
- type: gallery
  title: "Gallery Title"
  photos:
    - src: "photos/photo1.jpg"
      caption: "Caption for photo 1"
    - src: "photos/photo2.jpg"
    - src: "photos/photo3.jpg"
      caption: "Caption for photo 3"
  caption: "Overall gallery caption"
```

### Story (Photo + Text)
Photo on one side, text on the other.

```yaml
- type: story
  photo: "photos/your-photo.jpg"
  title: "Story Title"
  text: |
    Write your story here. This can be multiple lines.

    Use **double asterisks** for bold.
    Use *single asterisks* for italic.
  layout: "photo-left"
```

Change `layout: "photo-left"` to `layout: "photo-right"` to flip it.

### Video
Show a video with a play button.

```yaml
- type: video
  src: "videos/your-video.mp4"
  caption: "Video caption"
  poster: "photos/video-thumbnail.jpg"
```

### Comparison (Before/After)
Show two photos side by side.

```yaml
- type: comparison
  title: "Comparison Title"
  photos:
    - src: "photos/before.jpg"
      label: "Before"
    - src: "photos/after.jpg"
      label: "After"
```

### Closing Slide
The ending slide with a message.

```yaml
- type: closing
  title: "Thank You"
  text: "Your closing message here"
  photo: "photos/final-photo.jpg"
```

## Extra Features (Optional)

You can add these to any slide:

```yaml
- type: photo
  photo: "photos/example.jpg"
  caption: "Example photo"
  location: "Taj Mahal, Agra"           # Shows a location tag
  fun_fact: "Built in 1632!"            # Shows a fun fact box
  notes: "Remember to mention..."       # Presenter notes (hidden unless P is pressed)
```

## Common Tasks

### Reordering Slides

Just cut and paste! Each slide starts with `- type:` and ends before the next `- type:`.

### Deleting a Slide

Delete everything from `- type:` to just before the next `- type:`.

### Changing a Photo

Find the `photo:` line and change the filename:
```yaml
photo: "photos/new-photo-name.jpg"
```

### Changing a Caption

Find the `caption:` line and change the text:
```yaml
caption: "Your new caption here"
```

## Previewing Your Changes

1. Open a terminal in the project folder
2. Run: `npm run dev`
3. Open your browser to the URL shown (usually http://localhost:5173)
4. Changes will appear as you save the file!

## Common Mistakes (and Fixes)

### "The slides aren't showing!"

Check that:
- Your YAML indentation uses **spaces, not tabs**
- Photo filenames match exactly (including capitalization!)
- Each slide starts with `- type:`

### "I see weird characters!"

Make sure text with special characters is in quotes:
```yaml
title: "Matt & Sarah's Wedding"  # Good - in quotes
title: Matt & Sarah's Wedding    # Bad - needs quotes
```

### "My multi-line text isn't working!"

Use the `|` character for multi-line text:
```yaml
text: |
  First paragraph.

  Second paragraph.
```

## Need Help?

Just describe what you want to change to Claude Code and it will edit the file for you!

Examples:
- "Change the title slide background to sunset.jpg"
- "Add a new photo slide after Day 3"
- "Switch the theme to dark mode"
- "Add a caption to the Taj Mahal photo"

Claude Code understands natural language and can make the changes for you.

## Keyboard Shortcuts (When Viewing)

| Key | What it does |
|-----|-------------|
| `Right Arrow` or `Space` | Next slide |
| `Left Arrow` | Previous slide |
| `F` | Fullscreen mode |
| `G` or `Escape` | Show all slides |
| `P` | Show presenter notes |

## Themes

Click the paint palette icon in the top-right corner to change themes:
- **Festive** - Warm, colorful (default)
- **Minimal Light** - Clean, white background
- **Minimal Dark** - Clean, dark background
- **Documentary** - Muted, editorial feel

Your theme choice is saved automatically!

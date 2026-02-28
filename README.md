# Caminho das Índias

A beautiful React-based slideshow for sharing photos and memories from our trip to India.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Adding Your Photos

1. Drop your photos in `public/photos/`
2. Drop any videos in `public/videos/`
3. Edit `src/content/slides.yaml` to reference them

That's it! The slideshow will automatically display your content.

## Editing Content

All slideshow content is controlled by a single file: `src/content/slides.yaml`

**For non-developers:** See [EDITING-GUIDE.md](./EDITING-GUIDE.md) for a friendly, step-by-step guide.

## Features

- **Multiple Slide Types:** Title, photo, gallery, story (photo + text), video, dividers, and more
- **Keyboard Navigation:** Arrow keys, Space, Page Up/Down
- **Touch Support:** Swipe left/right on mobile
- **Fullscreen Mode:** Press `F` for presentation mode
- **Slide Overview:** Press `G` or `Escape` to see all slides
- **Auto-Play:** Loop through slides automatically
- **Presenter Notes:** Hidden notes for the presenter
- **4 Themes:** Festive, Minimal Light, Minimal Dark, Warm Documentary
- **Responsive:** Works on phones, tablets, laptops, and projected displays

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `→` `↓` `Space` | Next slide |
| `←` `↑` | Previous slide |
| `F` | Toggle fullscreen |
| `G` or `Escape` | Toggle slide overview |
| `P` | Toggle presenter notes |

## Deployment

### Vercel (Recommended)

The easiest option — just push to GitHub and connect to Vercel:

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your repository
4. Deploy! (Vercel auto-detects Vite)

### Docker / Fly.io

```bash
# Build Docker image
docker build -t india-slideshow .

# Run locally
docker run -p 8080:80 india-slideshow

# Deploy to Fly.io
fly launch
fly deploy
```

### Static Files

The built site can be served from any static host:

```bash
npm run build
# Upload contents of dist/ to any web server
```

### Local Files

After building, you can open `dist/index.html` directly in a browser for local viewing (navigation will work, but some features may be limited without a server).

## Project Structure

```
├── public/
│   ├── photos/          # Your photos go here
│   └── videos/          # Your videos go here
├── src/
│   ├── content/
│   │   └── slides.yaml  # THE main content file
│   ├── components/      # React components
│   ├── hooks/           # Custom React hooks
│   ├── themes/          # Theme CSS
│   └── types/           # TypeScript types
├── EDITING-GUIDE.md     # Guide for non-developers
├── Dockerfile           # For Docker/Fly.io deployment
└── vercel.json          # Vercel configuration
```

## Optimizing Images

For large photo collections (50+ images), consider optimizing them first:

```bash
# On macOS/Linux with ImageMagick installed:
./scripts/optimize-images.sh
```

Or use any image editor to:
- Resize to max 2400px wide
- Save as JPEG quality 85
- This keeps photos beautiful while reducing load times

## Tech Stack

- **Framework:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Content:** YAML (human-readable config)

## Getting Help

- **For content editing:** See [EDITING-GUIDE.md](./EDITING-GUIDE.md)
- **For technical issues:** Check the browser console for errors
- **Need changes?** Ask Claude Code — describe what you want and it will edit the files for you!

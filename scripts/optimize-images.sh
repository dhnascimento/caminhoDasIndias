#!/bin/bash
# ============================================
# IMAGE OPTIMIZATION SCRIPT
# ============================================
# This script helps optimize large photos for web use.
# It creates web-optimized versions while keeping originals.
#
# Requirements:
#   - ImageMagick (install with: brew install imagemagick)
#   - or use any image editor that can batch resize
#
# Usage:
#   ./scripts/optimize-images.sh
#
# ============================================

# Configuration
MAX_WIDTH=2400        # Max width in pixels
QUALITY=85            # JPEG quality (0-100)
PHOTOS_DIR="public/photos"
BACKUP_DIR="public/photos/originals"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick is not installed."
    echo "Install it with: brew install imagemagick (macOS) or apt install imagemagick (Linux)"
    exit 1
fi

# Create backup directory
mkdir -p "$BACKUP_DIR"

echo "Optimizing images in $PHOTOS_DIR..."
echo "Originals will be backed up to $BACKUP_DIR"
echo ""

# Process each image
for img in "$PHOTOS_DIR"/*.{jpg,jpeg,JPG,JPEG,png,PNG} 2>/dev/null; do
    # Skip if no files found
    [ -f "$img" ] || continue

    filename=$(basename "$img")

    # Skip if already processed (check if original exists in backup)
    if [ -f "$BACKUP_DIR/$filename" ]; then
        echo "Skipping $filename (already processed)"
        continue
    fi

    # Get original size
    original_size=$(du -h "$img" | cut -f1)

    # Backup original
    cp "$img" "$BACKUP_DIR/$filename"

    # Optimize image
    convert "$img" \
        -resize "${MAX_WIDTH}x>" \
        -quality $QUALITY \
        -strip \
        "$img"

    # Get new size
    new_size=$(du -h "$img" | cut -f1)

    echo "Processed: $filename ($original_size -> $new_size)"
done

echo ""
echo "Done! Originals saved in $BACKUP_DIR"
echo ""
echo "TIP: If you need to restore originals, run:"
echo "  cp $BACKUP_DIR/* $PHOTOS_DIR/"

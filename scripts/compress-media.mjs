import sharp from 'sharp';
import { execSync } from 'child_process';
import { readdirSync, mkdirSync, existsSync, statSync } from 'fs';
import { join, extname, relative } from 'path';

const INPUT = 'public/media';
const OUTPUT = 'public/media-compressed';
const IMAGE_EXTS = ['.jpg', '.jpeg', '.png'];
const VIDEO_EXTS = ['.mp4'];
const MAX_DIMENSION = 2000;
const JPEG_QUALITY = 80;

function walk(dir) {
  const results = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) results.push(...walk(full));
    else results.push(full);
  }
  return results;
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function compressImage(src, dest) {
  mkdirSync(join(dest, '..'), { recursive: true });
  const outPath = dest.replace(/\.\w+$/i, '.jpg');
  await sharp(src)
    .rotate() // auto-rotate based on EXIF orientation before stripping metadata
    .resize({ width: MAX_DIMENSION, height: MAX_DIMENSION, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toFile(outPath);
  return outPath;
}

function compressVideo(src, dest) {
  mkdirSync(join(dest, '..'), { recursive: true });
  execSync(
    `ffmpeg -i "${src}" -c:v libx264 -preset slow -crf 23 -c:a aac -b:a 128k -movflags +faststart -y "${dest}"`,
    { stdio: 'inherit' }
  );
  return dest;
}

async function main() {
  const files = walk(INPUT);
  let imgCount = 0, vidCount = 0, skipped = 0;
  let totalBefore = 0, totalAfter = 0;
  const failed = [];

  for (const file of files) {
    const ext = extname(file).toLowerCase();
    const rel = relative(INPUT, file);
    const dest = join(OUTPUT, rel);

    if (IMAGE_EXTS.includes(ext)) {
      const outPath = dest.replace(/\.\w+$/i, '.jpg');
      if (existsSync(outPath)) { skipped++; continue; }

      const before = statSync(file).size;
      console.log(`[img] ${rel} (${formatSize(before)})`);
      try {
        const result = await compressImage(file, dest);
        const after = statSync(result).size;
        totalBefore += before;
        totalAfter += after;
        console.log(`      -> ${formatSize(after)} (${Math.round((1 - after / before) * 100)}% reduction)`);
        imgCount++;
      } catch (err) {
        console.log(`      !! FAILED: ${err.message} — copying original`);
        const { copyFileSync } = await import('fs');
        mkdirSync(join(outPath, '..'), { recursive: true });
        copyFileSync(file, outPath);
        failed.push(rel);
      }
    } else if (VIDEO_EXTS.includes(ext)) {
      if (existsSync(dest)) { skipped++; continue; }

      const before = statSync(file).size;
      console.log(`[vid] ${rel} (${formatSize(before)})`);
      try {
        compressVideo(file, dest);
        const after = statSync(dest).size;
        totalBefore += before;
        totalAfter += after;
        console.log(`      -> ${formatSize(after)} (${Math.round((1 - after / before) * 100)}% reduction)`);
        vidCount++;
      } catch (err) {
        console.log(`      !! FAILED: ${err.message} — copying original`);
        const { copyFileSync } = await import('fs');
        mkdirSync(join(dest, '..'), { recursive: true });
        copyFileSync(file, dest);
        failed.push(rel);
      }
    }
  }

  console.log(`\nDone: ${imgCount} images, ${vidCount} videos compressed. ${skipped} skipped.`);
  if (failed.length > 0) {
    console.log(`\nFailed (copied original): ${failed.join(', ')}`);
  }
  if (totalBefore > 0) {
    console.log(`Total: ${formatSize(totalBefore)} -> ${formatSize(totalAfter)} (${Math.round((1 - totalAfter / totalBefore) * 100)}% reduction)`);
  }
}

main().catch(console.error);

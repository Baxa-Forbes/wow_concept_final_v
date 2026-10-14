/**
 * Image optimization script for public/product/
 *
 * - Re-encodes all JPEG/JPG images in place (quality 80, max width 1600px)
 * - Creates a backup of originals in public/product-backup/ before modifying
 * - Prints before/after sizes
 *
 * Usage: npm run optimize:images
 */
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCT_DIR = path.resolve(__dirname, '../public/product');
const BACKUP_DIR = path.resolve(__dirname, '../public/product-backup');

const MAX_WIDTH = 1600;
const JPEG_QUALITY = 80;

function formatBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function main() {
  const files = fs
    .readdirSync(PRODUCT_DIR)
    .filter((f) => /\.(jpe?g|png)$/i.test(f));

  console.log(`Found ${files.length} images in public/product/`);

  // Create backup directory if it doesn't exist
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
    console.log(`Created backup directory: public/product-backup/`);
  }

  let totalBefore = 0;
  let totalAfter = 0;
  let processed = 0;

  for (const file of files) {
    const filePath = path.join(PRODUCT_DIR, file);
    const stat = fs.statSync(filePath);
    totalBefore += stat.size;

    // Backup original (only if not already backed up)
    const backupPath = path.join(BACKUP_DIR, file);
    if (!fs.existsSync(backupPath)) {
      fs.copyFileSync(filePath, backupPath);
    }

    const ext = path.extname(file).toLowerCase();
    const tempPath = filePath + '.tmp';

    try {
      if (ext === '.png') {
        // For PNG: just optimize, keep format
        await sharp(filePath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .png({ quality: 80 })
          .toFile(tempPath);
      } else {
        // For JPEG: resize + re-encode
        await sharp(filePath)
          .resize({ width: MAX_WIDTH, withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
          .toFile(tempPath);
      }
      // Replace original with optimized version
      fs.renameSync(tempPath, filePath);

      const newStat = fs.statSync(filePath);
      totalAfter += newStat.size;
      processed++;
      console.log(
        `  ✓ ${file}: ${formatBytes(stat.size)} → ${formatBytes(newStat.size)}`
      );
    } catch (err) {
      console.error(`  ✗ ${file}: ${err.message}`);
      // Clean up temp file on error
      if (fs.existsSync(tempPath)) {
        fs.unlinkSync(tempPath);
      }
    }
  }

  const saved = totalBefore - totalAfter;
  console.log('\n--- Summary ---');
  console.log(`Processed: ${processed}/${files.length} images`);
  console.log(`Before: ${formatBytes(totalBefore)}`);
  console.log(`After:  ${formatBytes(totalAfter)}`);
  console.log(`Saved:  ${formatBytes(saved)} (${((saved / totalBefore) * 100).toFixed(1)}%)`);
  console.log('\nOriginals are backed up in public/product-backup/');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

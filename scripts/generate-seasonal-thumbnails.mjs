/**
 * Generate placeholder thumbnails for seasonal collections
 * Creates 3 thumbnails for each of the 4 collections
 */

import { writeFileSync, mkdirSync, existsSync, readFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import sharp from 'sharp';

const outputDir = join(process.cwd(), 'public', 'images', 'seasonal-collections');

// Ensure directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Collection configurations
const collections = [
  {
    slug: 'christmas',
    name: 'Christmas Collection',
    colors: ['#dc2626', '#16a34a'], // red, green
  },
  {
    slug: 'halloween',
    name: 'Halloween Collection',
    colors: ['#ea580c', '#9333ea'], // orange, purple
  },
  {
    slug: 'thanksgiving',
    name: 'Thanksgiving Collection',
    colors: ['#ea580c', '#eab308'], // orange, yellow
  },
  {
    slug: 'fathers-day',
    name: "Father's Day Collection",
    colors: ['#1e40af', '#475569'], // blue, slate
  },
];

/**
 * Generate SVG placeholder thumbnail
 */
function generateSVGThumbnail(collection, index, colors) {
  const [color1, color2] = colors;
  const size = 512;
  
  // Create gradient-based SVG
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${index}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color1};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${color2};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
      <feOffset dx="0" dy="4" result="offsetblur"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#grad${index})" rx="24"/>
  <circle cx="${size/2}" cy="${size/2}" r="120" fill="rgba(255,255,255,0.2)" filter="url(#shadow)"/>
  <text x="${size/2}" y="${size/2 + 20}" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9">${collection.charAt(0).toUpperCase()}</text>
</svg>`;
}

/**
 * Generate all thumbnails
 */
async function generateThumbnails() {
  console.log('🎨 Generating seasonal collection thumbnails...\n');
  
  for (const collection of collections) {
    console.log(`Generating thumbnails for ${collection.name}...`);
    
    for (let i = 1; i <= 3; i++) {
      const filename = `${collection.slug}-thumbnail-${i}.png`;
      const svgContent = generateSVGThumbnail(collection.slug, i, collection.colors);
      
      // Create temporary SVG file
      const svgPath = join(outputDir, filename.replace('.png', '.svg'));
      writeFileSync(svgPath, svgContent);
      
      // Convert SVG to PNG using sharp
      const pngPath = join(outputDir, filename);
      try {
        await sharp(svgPath)
          .resize(512, 512)
          .png()
          .toFile(pngPath);
        
        // Remove temporary SVG file
        unlinkSync(svgPath);
        console.log(`  ✓ Created ${filename}`);
      } catch (error) {
        console.error(`  ✗ Error converting ${filename}:`, error.message);
      }
    }
  }
  
  console.log('\n✅ All thumbnails generated!');
}

// Run the generator
generateThumbnails().catch(console.error);


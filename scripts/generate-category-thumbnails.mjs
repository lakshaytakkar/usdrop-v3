/**
 * Generate category thumbnails using Gemini API
 * 
 * This script generates consistent thumbnails for all categories following a 3-layer structure:
 * 1. Objects: Top products from the category
 * 2. Background: Complimenting gradient/pattern
 * 3. Effects & Lighting: Professional photography feel
 * 
 * Usage:
 *   Set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in your environment, then run:
 *   node scripts/generate-category-thumbnails.mjs
 */

import { GoogleGenAI } from "@google/genai";
import { writeFileSync, mkdirSync } from 'fs';
import { access } from 'fs/promises';
import { join } from 'path';
import { createClient } from '@supabase/supabase-js';

// Try to load from .env.local if not in environment
let API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
              process.env.GEMINI_API_KEY;

if (!API_KEY) {
  try {
    const { readFileSync } = await import('fs');
    const envContent = readFileSync('.env.local', 'utf8');
    const match = envContent.match(/GEMINI_API_KEY=(.+)/);
    if (match) {
      API_KEY = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    // .env.local doesn't exist or can't be read
  }
}

if (!API_KEY) {
  console.error('❌ Error: No API key found.');
  console.error('   Set GEMINI_API_KEY or NEXT_PUBLIC_GEMINI_API_KEY in your environment');
  console.error('   Or add GEMINI_API_KEY=your-key to .env.local');
  process.exit(1);
}

// Try to load Supabase credentials from .env.local if not in environment
let SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
let SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  try {
    const { readFileSync } = await import('fs');
    const envContent = readFileSync('.env.local', 'utf8');
    
    if (!SUPABASE_URL) {
      const match = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
      if (match) SUPABASE_URL = match[1].trim().replace(/^["']|["']$/g, '');
    }
    
    if (!SUPABASE_SERVICE_ROLE_KEY) {
      const match = envContent.match(/SUPABASE_SERVICE_ROLE_KEY=(.+)/);
      if (match) SUPABASE_SERVICE_ROLE_KEY = match[1].trim().replace(/^["']|["']$/g, '');
    }
  } catch (e) {
    // .env.local doesn't exist or can't be read
  }
}

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: Supabase credentials not found');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Or add them to .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
const outputDir = join(process.cwd(), 'public', 'categories');

// Ensure directory exists
mkdirSync(outputDir, { recursive: true });

// Category-specific product examples for Layer 1
const categoryProducts = {
  'Electronics': ['smartphone', 'wireless earbuds', 'smartwatch', 'tablet'],
  'Fashion & Accessories': ['elegant watch', 'stylish sunglasses', 'designer handbag', 'jewelry'],
  'Beauty & Personal Care': ['skincare bottles', 'makeup palette', 'beauty tools', 'perfume'],
  'Home & Garden': ['decorative vase', 'plant pot', 'candle', 'home accessory'],
  'Kitchen & Dining': ['kitchen knife set', 'coffee maker', 'dining set', 'cookware'],
  'Sports & Fitness': ['yoga mat', 'dumbbells', 'water bottle', 'fitness tracker'],
  'Pet Supplies': ['pet food bowl', 'dog toy', 'cat bed', 'pet leash'],
  'Baby & Kids': ['baby bottle', 'toy blocks', 'stroller', 'kids clothing'],
  'Gadgets': ['smart speaker', 'wireless charger', 'bluetooth headphones', 'tech accessory'],
  'Home Decor': ['wall art', 'throw pillow', 'decorative lamp', 'vase'],
  'Other': ['miscellaneous products', 'various items', 'assorted goods'],
};

// Category-specific background colors
const categoryColors = {
  'Electronics': 'deep blue to purple',
  'Fashion & Accessories': 'rose gold to champagne',
  'Beauty & Personal Care': 'pink to lavender',
  'Home & Garden': 'sage green to cream',
  'Kitchen & Dining': 'warm orange to beige',
  'Sports & Fitness': 'energetic blue to green',
  'Pet Supplies': 'warm brown to tan',
  'Baby & Kids': 'soft pastel blue to pink',
  'Gadgets': 'modern teal to navy',
  'Home Decor': 'elegant gray to gold',
  'Other': 'neutral gray to white',
};

/**
 * Generate a consistent prompt for category thumbnails
 */
function generatePrompt(categoryName, description) {
  const products = categoryProducts[categoryName] || ['top products', 'popular items', 'featured goods'];
  const colors = categoryColors[categoryName] || 'neutral gradient';
  
  return `Create a professional e-commerce category thumbnail for ${categoryName} (${description}). 

Layer 1 (Objects): Display 3-4 ${products.join(', ')} arranged elegantly in the foreground. Products should be clearly visible and professionally styled.

Layer 2 (Background): Soft gradient background in ${colors} with subtle patterns or textures that complement the category theme. The background should enhance but not distract from the products.

Layer 3 (Effects & Lighting): Professional product photography lighting with soft shadows, subtle glow effects around products, and a clean, modern aesthetic. The overall feel should be premium and inviting.

Technical requirements:
- Square format (1:1 aspect ratio)
- Suitable for category cards and thumbnails
- High quality, professional photography style
- Products clearly visible and well-lit
- Background complements the category theme
- Consistent with e-commerce product photography standards`;
}

/**
 * Generate thumbnail image using Gemini
 */
async function generateThumbnail(categoryName, description, slug) {
  try {
    console.log(`  🎨 Generating thumbnail for "${categoryName}"...`);
    
    const prompt = generatePrompt(categoryName, description);
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseModalities: ['IMAGE'],
        imageConfig: {
          aspectRatio: '1:1'
        }
      }
    });

    let imageData = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          imageData = part.inlineData.data;
          break;
        }
      }
    }

    if (!imageData) {
      console.error(`  ❌ Failed to generate image for "${categoryName}"`);
      return false;
    }

    const fileName = `${slug}-thumbnail.png`;
    const filePath = join(outputDir, fileName);
    const buffer = Buffer.from(imageData, 'base64');
    writeFileSync(filePath, buffer);
    
    console.log(`  💾 Saved: ${fileName}`);
    
    // Update database
    const thumbnailUrl = `/categories/${fileName}`;
    const { error: updateError } = await supabase
      .from('categories')
      .update({ thumbnail: thumbnailUrl })
      .eq('slug', slug);
    
    if (updateError) {
      console.error(`  ❌ Error updating database:`, updateError.message);
      return false;
    }
    
    console.log(`  ✅ Updated database for "${categoryName}"`);
    return true;
  } catch (error) {
    console.error(`  ❌ Error generating thumbnail for "${categoryName}":`, error.message);
    return false;
  }
}

/**
 * Main function to generate all category thumbnails
 */
async function main() {
  console.log('🚀 Starting category thumbnail generation...\n');
  
  // Fetch all categories
  const { data: categories, error } = await supabase
    .from('categories')
    .select('id, name, slug, description')
    .order('name');
  
  if (error) {
    console.error('❌ Error fetching categories:', error.message);
    process.exit(1);
  }
  
  if (!categories || categories.length === 0) {
    console.error('❌ No categories found');
    process.exit(1);
  }
  
  console.log(`📋 Found ${categories.length} categories\n`);
  console.log(`📁 Output directory: ${outputDir}\n`);
  
  let success = 0;
  let failed = 0;
  let skipped = 0;
  
  // Generate thumbnails for each category
  for (let i = 0; i < categories.length; i++) {
    const category = categories[i];
    const fileName = `${category.slug}-thumbnail.png`;
    const filePath = join(outputDir, fileName);
    
    // Check if thumbnail already exists
    try {
      await access(filePath);
      console.log(`  ⏭️  Thumbnail already exists for "${category.name}", skipping...`);
      skipped++;
      continue;
    } catch {
      // File doesn't exist, proceed with generation
    }
    
    console.log(`[${i + 1}/${categories.length}] Processing: ${category.name}`);
    
    const result = await generateThumbnail(
      category.name,
      category.description || 'products',
      category.slug
    );
    
    if (result) {
      success++;
    } else {
      failed++;
    }
    
    // Rate limiting - wait 2 seconds between requests
    if (i < categories.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    console.log(); // Empty line for readability
  }
  
  console.log(`\n✨ Thumbnail generation complete!`);
  console.log(`   ✅ Generated: ${success}`);
  console.log(`   ⏭️  Skipped: ${skipped}`);
  if (failed > 0) {
    console.log(`   ❌ Failed: ${failed}`);
  }
  console.log(`\n📁 Images saved to: ${outputDir}`);
}

// Run the script
main().catch(console.error);


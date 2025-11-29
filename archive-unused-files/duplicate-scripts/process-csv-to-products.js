/**
 * CSV to Product Picks Processing Script
 * Processes TikTok Shop CSV data and maps it to product_picks structure
 */

const fs = require('fs');
const path = require('path');

// Parse CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Field separator
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current); // Add last field
  return result;
}

// Parse CSV file
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) return [];
  
  // Parse header
  const headers = parseCSVLine(lines[0]);
  
  // Parse rows
  const rows = [];
  for (let i = 1; i < Math.min(lines.length, 201); i++) { // Sample first 200 rows
    const values = parseCSVLine(lines[i]);
    if (values.length !== headers.length) continue;
    
    const row = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }
  
  return rows;
}

// Parse JSON string safely
function parseJSON(jsonString, defaultValue) {
  if (!jsonString || jsonString.trim() === '') return defaultValue;
  try {
    return JSON.parse(jsonString);
  } catch {
    return defaultValue;
  }
}

// Clean category name
function cleanCategory(category) {
  if (!category) return 'uncategorized';
  return category
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

// Generate random trend data
function generateTrendData() {
  const data = [];
  for (let i = 0; i < 8; i++) {
    data.push(Math.floor(Math.random() * 90) + 30); // Random between 30-120
  }
  return data;
}

// Generate random rating (weighted toward 4.5+)
function generateRating() {
  const rand = Math.random();
  if (rand < 0.3) {
    // 30% chance of 4.0-4.5
    return Number((Math.random() * 0.5 + 4.0).toFixed(1));
  } else {
    // 70% chance of 4.5-5.0
    return Number((Math.random() * 0.5 + 4.5).toFixed(1));
  }
}

// Process CSV row to ProductPick
function processRow(row) {
  // Validate required fields
  if (!row.title || !row.final_price) return null;
  
  // Parse images
  const images = parseJSON(row.images, []);
  if (images.length === 0) return null; // Skip products without images
  
  // Parse price (handle cents - if price > 1000, likely in cents)
  let sellPrice = parseFloat(row.final_price);
  if (sellPrice > 1000) {
    sellPrice = sellPrice / 100; // Convert from cents
  }
  
  if (isNaN(sellPrice) || sellPrice <= 0) return null;
  
  // Calculate buy price (30-50% margin, so buy_price is 50-70% of sell_price)
  const marginMultiplier = Math.random() * 0.2 + 0.5; // Random between 0.5 and 0.7
  const buyPrice = Number((sellPrice * marginMultiplier).toFixed(2));
  const profitPerOrder = Number((sellPrice - buyPrice).toFixed(2));
  
  // Parse specifications
  const specifications = parseJSON(row.specifications, null);
  
  // Get reviews count
  const reviewsCount = parseInt(row.reviews_count) || 0;
  
  // Clean description
  const description = row.description?.trim() || row.title;
  
  return {
    image: images[0],
    title: row.title.trim(),
    buy_price: buyPrice,
    sell_price: sellPrice,
    profit_per_order: profitPerOrder,
    trend_data: generateTrendData(),
    category: cleanCategory(row.category || 'uncategorized'),
    rating: generateRating(),
    reviews_count: reviewsCount,
    description: description.substring(0, 1000), // Limit description length
    additional_images: images.slice(1),
    specifications: specifications,
  };
}

// Remove duplicates by title similarity
function removeDuplicates(products) {
  const seen = new Set();
  const unique = [];
  
  for (const product of products) {
    const normalizedTitle = product.title.toLowerCase().trim();
    if (!seen.has(normalizedTitle)) {
      seen.add(normalizedTitle);
      unique.push(product);
    }
  }
  
  return unique;
}

// Main processing function
function processCSVToProducts() {
  console.log('🚀 Starting CSV to Product Picks processing...');
  
  const csvPath = path.join(__dirname, '../public/snap_miin3sjp1o36majndf.csv');
  
  if (!fs.existsSync(csvPath)) {
    console.error(`❌ CSV file not found at: ${csvPath}`);
    process.exit(1);
  }
  
  console.log('📖 Reading CSV file...');
  const rows = parseCSV(csvPath);
  console.log(`📊 Found ${rows.length} rows to process`);
  
  console.log('🔄 Processing rows...');
  const processed = [];
  
  for (const row of rows) {
    const product = processRow(row);
    if (product) {
      processed.push(product);
    }
  }
  
  console.log(`✅ Processed ${processed.length} valid products`);
  
  // Remove duplicates
  console.log('🔍 Removing duplicates...');
  const unique = removeDuplicates(processed);
  console.log(`✅ ${unique.length} unique products after deduplication`);
  
  // Limit to 100 products
  const finalProducts = unique.slice(0, 100);
  console.log(`📦 Final product count: ${finalProducts.length}`);
  
  // Generate TypeScript output
  const outputPath = path.join(__dirname, '../src/data/product-picks.ts');
  const outputDir = path.dirname(outputPath);
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const timestamp = new Date().toISOString();
  
  const tsContent = `/**
 * Product Picks Data
 * Generated from TikTok Shop CSV on ${new Date().toLocaleString()}
 * Total products: ${finalProducts.length}
 */

import { ProductPick } from '@/types/product-pick';

export const productPicks: ProductPick[] = [
${finalProducts.map((product, index) => {
  const id = `product-${index + 1}`;
  return `  {
    id: "${id}",
    image: ${JSON.stringify(product.image)},
    title: ${JSON.stringify(product.title)},
    buy_price: ${product.buy_price},
    sell_price: ${product.sell_price},
    profit_per_order: ${product.profit_per_order},
    trend_data: ${JSON.stringify(product.trend_data)},
    category: ${JSON.stringify(product.category)},
    rating: ${product.rating},
    reviews_count: ${product.reviews_count},
    description: ${JSON.stringify(product.description)},
    supplier_id: null,
    additional_images: ${JSON.stringify(product.additional_images)},
    specifications: ${JSON.stringify(product.specifications)},
    created_at: ${JSON.stringify(timestamp)},
    updated_at: ${JSON.stringify(timestamp)},
  }`;
}).join(',\n')}
];

export default productPicks;
`;
  
  fs.writeFileSync(outputPath, tsContent, 'utf-8');
  console.log(`✅ Output written to: ${outputPath}`);
  console.log(`\n🎉 Processing complete! Generated ${finalProducts.length} products.`);
}

// Run the processing
processCSVToProducts();



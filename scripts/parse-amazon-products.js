const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, '..', 'Amazon best seller products.csv');
const outputPath = path.join(__dirname, 'seed-amazon-products.sql');

// Simple CSV parser
function parseCSV(content) {
  const lines = content.split('\n');
  const headers = parseCSVLine(lines[0]);
  const data = [];

  for (let i = 1; i < lines.length && data.length < 100; i++) {
    if (!lines[i].trim()) continue;

    try {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length - 5) {
        const row = {};
        headers.forEach((header, idx) => {
          row[header.replace(/"/g, '').trim()] = values[idx] ? values[idx].replace(/"/g, '').trim() : '';
        });

        // Only include products with valid data
        if (row.title && row.image_url && (row.final_price || row.initial_price)) {
          data.push(row);
        }
      }
    } catch (e) {
      // Skip malformed rows
    }
  }

  return data;
}

// Parse a single CSV line handling quoted fields
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);

  return result;
}

// Map Amazon categories to our category system
function mapCategory(amazonCategories) {
  const categoryMap = {
    'electronics': 'gadgets',
    'camera & photo': 'gadgets',
    'computers': 'gadgets',
    'cell phones': 'gadgets',
    'video games': 'gadgets',
    'home & kitchen': 'home-decor',
    'kitchen': 'kitchen',
    'home': 'home-decor',
    'furniture': 'home-decor',
    'garden & outdoor': 'home-garden',
    'patio, lawn & garden': 'home-garden',
    'beauty': 'beauty',
    'beauty & personal care': 'beauty',
    'health': 'beauty',
    'personal care': 'beauty',
    'sports': 'sports-fitness',
    'sports & outdoors': 'sports-fitness',
    'fitness': 'sports-fitness',
    'clothing': 'fashion',
    'fashion': 'fashion',
    'shoes': 'fashion',
    'jewelry': 'fashion',
    'accessories': 'fashion',
    'pet supplies': 'pets',
    'pets': 'pets',
    'baby': 'mother-kids',
    'toys': 'mother-kids',
    'kids': 'mother-kids',
  };

  // Parse the Amazon categories JSON array
  let categories = [];
  try {
    if (amazonCategories && amazonCategories.startsWith('[')) {
      categories = JSON.parse(amazonCategories.replace(/'/g, '"'));
    }
  } catch (e) {
    return 'gadgets'; // default
  }

  // Find a matching category
  for (const cat of categories) {
    const lowerCat = cat.toLowerCase();
    for (const [key, value] of Object.entries(categoryMap)) {
      if (lowerCat.includes(key)) {
        return value;
      }
    }
  }

  return 'gadgets'; // default to gadgets for electronics products
}

// Generate random trend data
function generateTrendData() {
  const base = Math.floor(Math.random() * 1000) + 100;
  return Array.from({ length: 7 }, () =>
    base + Math.floor(Math.random() * 200) - 100
  );
}

// Escape SQL string
function escapeSql(str) {
  if (!str) return 'NULL';
  return `'${str.replace(/'/g, "''").substring(0, 500)}'`;
}

// Main function
async function main() {
  console.log('Reading CSV file...');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

  console.log('Parsing CSV...');
  const products = parseCSV(csvContent);
  console.log(`Found ${products.length} valid products`);

  // Category slug to UUID mapping (we'll need to create these first)
  const categoryUUIDs = {
    'gadgets': 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    'home-decor': 'b2c3d4e5-f6a7-8901-bcde-f12345678901',
    'kitchen': 'c3d4e5f6-a7b8-9012-cdef-123456789012',
    'home-garden': 'd4e5f6a7-b8c9-0123-def1-234567890123',
    'beauty': 'e5f6a7b8-c9d0-1234-ef12-345678901234',
    'sports-fitness': 'f6a7b8c9-d0e1-2345-f123-456789012345',
    'fashion': 'a7b8c9d0-e1f2-3456-0123-567890123456',
    'pets': 'b8c9d0e1-f2a3-4567-1234-678901234567',
    'mother-kids': 'c9d0e1f2-a3b4-5678-2345-789012345678',
  };

  let sql = `-- Amazon Bestseller Products Import
-- Generated on ${new Date().toISOString()}
-- Total products: ${products.length}

-- First, ensure categories exist
INSERT INTO categories (id, name, slug, description, trending, product_count, created_at, updated_at)
VALUES
  ('${categoryUUIDs['gadgets']}', 'Gadgets', 'gadgets', 'Electronics and tech gadgets', true, 0, NOW(), NOW()),
  ('${categoryUUIDs['home-decor']}', 'Home Decor', 'home-decor', 'Home decoration and furnishing', true, 0, NOW(), NOW()),
  ('${categoryUUIDs['kitchen']}', 'Kitchen', 'kitchen', 'Kitchen appliances and tools', false, 0, NOW(), NOW()),
  ('${categoryUUIDs['home-garden']}', 'Home & Garden', 'home-garden', 'Garden and outdoor products', false, 0, NOW(), NOW()),
  ('${categoryUUIDs['beauty']}', 'Beauty', 'beauty', 'Beauty and personal care', true, 0, NOW(), NOW()),
  ('${categoryUUIDs['sports-fitness']}', 'Sports & Fitness', 'sports-fitness', 'Sports and fitness equipment', false, 0, NOW(), NOW()),
  ('${categoryUUIDs['fashion']}', 'Fashion', 'fashion', 'Clothing and accessories', true, 0, NOW(), NOW()),
  ('${categoryUUIDs['pets']}', 'Pets', 'pets', 'Pet supplies and accessories', false, 0, NOW(), NOW()),
  ('${categoryUUIDs['mother-kids']}', 'Mother & Kids', 'mother-kids', 'Baby and kids products', false, 0, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  updated_at = NOW();

-- Insert products
`;

  products.forEach((product, index) => {
    const productId = `11111111-1111-1111-1111-${String(index + 1).padStart(12, '0')}`;
    const sourceId = `22222222-2222-2222-2222-${String(index + 1).padStart(12, '0')}`;
    const metadataId = `33333333-3333-3333-3333-${String(index + 1).padStart(12, '0')}`;

    // Parse prices
    let sellPrice = parseFloat(product.final_price) || parseFloat(product.initial_price) || 19.99;
    if (isNaN(sellPrice) || sellPrice <= 0) sellPrice = 19.99;

    // Calculate buy price as 40-60% of sell price (realistic dropshipping margin)
    const marginPercent = 0.4 + Math.random() * 0.2;
    const buyPrice = (sellPrice * marginPercent).toFixed(2);
    const profitPerOrder = (sellPrice - parseFloat(buyPrice)).toFixed(2);

    // Get rating and reviews
    const rating = parseFloat(product.rating) || (3.5 + Math.random() * 1.5);
    const reviewsCount = parseInt(product.reviews_count) || Math.floor(Math.random() * 500);

    // Map category
    const categorySlug = mapCategory(product.categories);
    const categoryId = categoryUUIDs[categorySlug];

    // Get image URL
    const imageUrl = product.image_url || product.image || '';

    // Get title (clean it up)
    let title = product.title || 'Unknown Product';
    title = title.substring(0, 200);

    // Clean description
    let description = product.description || '';
    if (description.includes('***')) {
      description = ''; // Remove censored descriptions
    }
    description = description.substring(0, 500);

    // Generate trend data
    const trendData = generateTrendData();

    sql += `
-- Product ${index + 1}: ${title.substring(0, 50)}...
INSERT INTO products (id, title, image, description, category_id, buy_price, sell_price, profit_per_order, additional_images, specifications, rating, reviews_count, trend_data, created_at, updated_at)
VALUES (
  '${productId}',
  ${escapeSql(title)},
  ${escapeSql(imageUrl)},
  ${description ? escapeSql(description) : 'NULL'},
  '${categoryId}',
  ${buyPrice},
  ${sellPrice.toFixed(2)},
  ${profitPerOrder},
  ARRAY[]::text[],
  NULL,
  ${rating.toFixed(1)},
  ${reviewsCount},
  ARRAY[${trendData.join(', ')}]::numeric[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  image = EXCLUDED.image,
  updated_at = NOW();

INSERT INTO product_source (id, product_id, source_type, source_id, created_at, updated_at)
VALUES (
  '${sourceId}',
  '${productId}',
  'scraped',
  ${escapeSql(product.asin || null)},
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO product_metadata (id, product_id, is_winning, is_locked, profit_margin, items_sold, filters, created_at, updated_at)
VALUES (
  '${metadataId}',
  '${productId}',
  ${Math.random() > 0.7 ? 'true' : 'false'},
  false,
  ${((parseFloat(profitPerOrder) / sellPrice) * 100).toFixed(1)},
  ${Math.floor(Math.random() * 5000)},
  ARRAY['amazon-bestseller']::text[],
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
`;
  });

  // Update category product counts
  sql += `
-- Update category product counts
UPDATE categories SET product_count = (
  SELECT COUNT(*) FROM products WHERE category_id = categories.id
), updated_at = NOW();

-- Summary
-- Total products inserted: ${products.length}
`;

  console.log('Writing SQL file...');
  fs.writeFileSync(outputPath, sql, 'utf-8');
  console.log(`SQL file written to: ${outputPath}`);
  console.log(`Total products: ${products.length}`);
}

main().catch(console.error);

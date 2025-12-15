const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSql() {
  const sqlPath = path.join(__dirname, 'seed-amazon-products.sql');
  const sql = fs.readFileSync(sqlPath, 'utf-8');

  // Split SQL into individual statements
  const statements = sql
    .split(/;\s*\n/)
    .filter(s => s.trim() && !s.trim().startsWith('--'))
    .map(s => s.trim() + ';');

  console.log(`Found ${statements.length} SQL statements to execute`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < statements.length; i++) {
    const statement = statements[i];

    // Skip comment-only statements
    if (statement.replace(/--[^\n]*\n?/g, '').trim() === ';') {
      continue;
    }

    try {
      // Use rpc to execute raw SQL
      const { data, error } = await supabase.rpc('exec_sql', { sql: statement });

      if (error) {
        // If exec_sql doesn't exist, try using the REST API directly
        throw error;
      }

      successCount++;
      if ((successCount % 50) === 0) {
        console.log(`Executed ${successCount} statements...`);
      }
    } catch (err) {
      // For errors, we'll handle them differently
      errorCount++;
      if (errorCount <= 5) {
        console.log(`Statement ${i + 1} error: ${err.message?.substring(0, 100)}`);
      }
    }
  }

  console.log(`\nCompleted: ${successCount} successful, ${errorCount} errors`);
}

// Alternative approach - directly insert using Supabase client
async function seedProducts() {
  console.log('Starting product seeding...\n');

  // Read CSV and parse
  const csvPath = path.join(__dirname, '..', 'Amazon best seller products.csv');
  const csvContent = fs.readFileSync(csvPath, 'utf-8');

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

  const lines = csvContent.split('\n');
  const headers = parseCSVLine(lines[0]);
  const products = [];

  for (let i = 1; i < lines.length && products.length < 100; i++) {
    if (!lines[i].trim()) continue;

    try {
      const values = parseCSVLine(lines[i]);
      if (values.length >= headers.length - 5) {
        const row = {};
        headers.forEach((header, idx) => {
          row[header.replace(/"/g, '').trim()] = values[idx] ? values[idx].replace(/"/g, '').trim() : '';
        });

        if (row.title && row.image_url && (row.final_price || row.initial_price)) {
          products.push(row);
        }
      }
    } catch (e) {}
  }

  console.log(`Parsed ${products.length} products from CSV\n`);

  // Category mapping
  const categoryMap = {
    'electronics': 'gadgets',
    'camera & photo': 'gadgets',
    'computers': 'gadgets',
    'home & kitchen': 'home-decor',
    'kitchen': 'kitchen',
    'home': 'home-decor',
    'garden': 'home-garden',
    'beauty': 'beauty',
    'sports': 'sports-fitness',
    'clothing': 'fashion',
    'fashion': 'fashion',
    'pet': 'pets',
    'baby': 'mother-kids',
    'toys': 'mother-kids',
  };

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

  function mapCategory(amazonCategories) {
    let categories = [];
    try {
      if (amazonCategories && amazonCategories.startsWith('[')) {
        categories = JSON.parse(amazonCategories.replace(/'/g, '"'));
      }
    } catch (e) {
      return 'gadgets';
    }

    for (const cat of categories) {
      const lowerCat = cat.toLowerCase();
      for (const [key, value] of Object.entries(categoryMap)) {
        if (lowerCat.includes(key)) {
          return value;
        }
      }
    }
    return 'gadgets';
  }

  function generateTrendData() {
    const base = Math.floor(Math.random() * 1000) + 100;
    return Array.from({ length: 7 }, () => base + Math.floor(Math.random() * 200) - 100);
  }

  // Step 1: Insert categories
  console.log('Step 1: Inserting categories...');
  const categoriesData = [
    { id: categoryUUIDs['gadgets'], name: 'Gadgets', slug: 'gadgets', description: 'Electronics and tech gadgets', trending: true, product_count: 0 },
    { id: categoryUUIDs['home-decor'], name: 'Home Decor', slug: 'home-decor', description: 'Home decoration and furnishing', trending: true, product_count: 0 },
    { id: categoryUUIDs['kitchen'], name: 'Kitchen', slug: 'kitchen', description: 'Kitchen appliances and tools', trending: false, product_count: 0 },
    { id: categoryUUIDs['home-garden'], name: 'Home & Garden', slug: 'home-garden', description: 'Garden and outdoor products', trending: false, product_count: 0 },
    { id: categoryUUIDs['beauty'], name: 'Beauty', slug: 'beauty', description: 'Beauty and personal care', trending: true, product_count: 0 },
    { id: categoryUUIDs['sports-fitness'], name: 'Sports & Fitness', slug: 'sports-fitness', description: 'Sports and fitness equipment', trending: false, product_count: 0 },
    { id: categoryUUIDs['fashion'], name: 'Fashion', slug: 'fashion', description: 'Clothing and accessories', trending: true, product_count: 0 },
    { id: categoryUUIDs['pets'], name: 'Pets', slug: 'pets', description: 'Pet supplies and accessories', trending: false, product_count: 0 },
    { id: categoryUUIDs['mother-kids'], name: 'Mother & Kids', slug: 'mother-kids', description: 'Baby and kids products', trending: false, product_count: 0 },
  ];

  // First check if categories exist, and get their IDs if they do
  const { data: existingCats } = await supabase.from('categories').select('id, slug');
  const existingSlugs = new Set((existingCats || []).map(c => c.slug));

  // Only insert categories that don't exist yet
  const newCategories = categoriesData.filter(c => !existingSlugs.has(c.slug));

  if (newCategories.length > 0) {
    const { error: catError } = await supabase
      .from('categories')
      .insert(newCategories);

    if (catError) {
      console.log('Categories error:', catError.message);
    } else {
      console.log(`Inserted ${newCategories.length} new categories\n`);
    }
  } else {
    console.log('All categories already exist\n');
  }

  // Update our category UUIDs map with existing IDs
  if (existingCats && existingCats.length > 0) {
    for (const cat of existingCats) {
      if (categoryUUIDs[cat.slug]) {
        categoryUUIDs[cat.slug] = cat.id;
      }
    }
    console.log('Using existing category IDs from database\n');
  }

  // Step 2: Insert products in batches
  console.log('Step 2: Inserting products...');
  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const productId = `11111111-1111-1111-1111-${String(i + 1).padStart(12, '0')}`;
    const sourceId = `22222222-2222-2222-2222-${String(i + 1).padStart(12, '0')}`;
    const metadataId = `33333333-3333-3333-3333-${String(i + 1).padStart(12, '0')}`;

    let sellPrice = parseFloat(product.final_price) || parseFloat(product.initial_price) || 19.99;
    if (isNaN(sellPrice) || sellPrice <= 0) sellPrice = 19.99;

    const marginPercent = 0.4 + Math.random() * 0.2;
    const buyPrice = parseFloat((sellPrice * marginPercent).toFixed(2));
    const profitPerOrder = parseFloat((sellPrice - buyPrice).toFixed(2));

    const rating = parseFloat(product.rating) || (3.5 + Math.random() * 1.5);
    const reviewsCount = parseInt(product.reviews_count) || Math.floor(Math.random() * 500);

    const categorySlug = mapCategory(product.categories);
    const categoryId = categoryUUIDs[categorySlug];

    const imageUrl = product.image_url || product.image || '';
    let title = (product.title || 'Unknown Product').substring(0, 200);

    let description = product.description || '';
    if (description.includes('***')) description = '';
    description = description.substring(0, 500) || null;

    const trendData = generateTrendData();

    // Insert product (profit_per_order is computed, so we don't include it)
    const { error: prodError } = await supabase
      .from('products')
      .upsert({
        id: productId,
        title: title,
        image: imageUrl,
        description: description,
        category_id: categoryId,
        buy_price: buyPrice,
        sell_price: sellPrice,
        additional_images: [],
        specifications: null,
        rating: parseFloat(rating.toFixed(1)),
        reviews_count: reviewsCount,
        trend_data: trendData,
      }, { onConflict: 'id' });

    if (prodError) {
      errorCount++;
      if (errorCount <= 3) console.log(`Product ${i + 1} error:`, prodError.message);
    } else {
      successCount++;

      // Insert source
      await supabase.from('product_source').upsert({
        id: sourceId,
        product_id: productId,
        source_type: 'scraped',
        source_id: product.asin || null,
      }, { onConflict: 'id' });

      // Insert metadata
      await supabase.from('product_metadata').upsert({
        id: metadataId,
        product_id: productId,
        is_winning: Math.random() > 0.7,
        is_locked: false,
        profit_margin: parseFloat(((profitPerOrder / sellPrice) * 100).toFixed(1)),
        items_sold: Math.floor(Math.random() * 5000),
        filters: ['amazon-bestseller'],
      }, { onConflict: 'id' });
    }

    if ((i + 1) % 20 === 0) {
      console.log(`Processed ${i + 1}/${products.length} products...`);
    }
  }

  console.log(`\nProducts inserted: ${successCount} successful, ${errorCount} errors`);

  // Step 3: Update category counts
  console.log('\nStep 3: Updating category counts...');
  for (const [slug, id] of Object.entries(categoryUUIDs)) {
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('category_id', id);

    await supabase
      .from('categories')
      .update({ product_count: count || 0 })
      .eq('id', id);
  }

  console.log('Category counts updated\n');
  console.log('=== Seeding Complete ===');
  console.log(`Total products: ${successCount}`);
}

seedProducts().catch(console.error);

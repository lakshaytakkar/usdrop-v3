const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function verify() {
  console.log('Verifying seeded products...\n');

  // Count total products
  const { count: totalProducts } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`Total products in database: ${totalProducts}`);

  // Count scraped products
  const { count: scrapedCount } = await supabase
    .from('product_source')
    .select('*', { count: 'exact', head: true })
    .eq('source_type', 'scraped');

  console.log(`Scraped products (source_type='scraped'): ${scrapedCount}`);

  // Get products by category
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name, slug, product_count');

  console.log('\nProducts by category:');
  for (const cat of categories || []) {
    if (cat.product_count > 0) {
      console.log(`  - ${cat.name}: ${cat.product_count}`);
    }
  }

  // Sample some products
  const { data: sampleProducts } = await supabase
    .from('products')
    .select('id, title, image, sell_price, buy_price, rating')
    .limit(5);

  console.log('\n--- Sample Products ---');
  for (const p of sampleProducts || []) {
    console.log(`\n${p.title.substring(0, 60)}...`);
    console.log(`  Price: $${p.sell_price} (buy: $${p.buy_price})`);
    console.log(`  Rating: ${p.rating}`);
    console.log(`  Image: ${p.image.substring(0, 50)}...`);
  }
}

verify().catch(console.error);

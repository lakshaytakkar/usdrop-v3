/**
 * Seed script to populate database with categories and sample products
 */

import { createClient } from '@supabase/supabase-js'

// Get Supabase credentials from environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://znddcikjgrvmltruuvca.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_ROLE_KEY is required')
  console.error('Please set it in your environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Basic categories to seed
const categoriesToSeed = [
  {
    name: 'Electronics',
    slug: 'electronics',
    description: 'Gadgets, smart devices, and consumer electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop',
    trending: true,
    growth_percentage: 35.8,
    avg_profit_margin: 42.5,
  },
  {
    name: 'Fashion & Accessories',
    slug: 'fashion',
    description: 'Clothing, jewelry, bags, and fashion accessories',
    image: '/categories/fashion-accessories.png',
    trending: true,
    growth_percentage: 42.3,
    avg_profit_margin: 55.2,
  },
  {
    name: 'Home & Garden',
    slug: 'home-garden',
    description: 'Home decor, furniture, and garden essentials',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=400&h=300&fit=crop',
    trending: true,
    growth_percentage: 28.5,
    avg_profit_margin: 48.7,
  },
  {
    name: 'Beauty & Personal Care',
    slug: 'beauty',
    description: 'Skincare, makeup, and beauty tools',
    image: 'https://images.unsplash.com/photo-1522338242992-e1a55eea58cc?w=400&h=300&fit=crop',
    trending: true,
    growth_percentage: 38.2,
    avg_profit_margin: 45.3,
  },
  {
    name: 'Sports & Fitness',
    slug: 'sports-fitness',
    description: 'Sports equipment, fitness gear, and athletic wear',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
    trending: true,
    growth_percentage: 32.1,
    avg_profit_margin: 50.8,
  },
  {
    name: 'Kitchen & Dining',
    slug: 'kitchen',
    description: 'Kitchen appliances, cookware, and dining essentials',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop',
    trending: false,
    growth_percentage: 18.5,
    avg_profit_margin: 40.2,
  },
  {
    name: 'Pet Supplies',
    slug: 'pets',
    description: 'Pet food, toys, and accessories',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
    trending: false,
    growth_percentage: 25.3,
    avg_profit_margin: 43.7,
  },
  {
    name: 'Baby & Kids',
    slug: 'mother-kids',
    description: 'Baby products, toys, and kids accessories',
    image: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=300&fit=crop',
    trending: false,
    growth_percentage: 22.8,
    avg_profit_margin: 46.5,
  },
  {
    name: 'Other',
    slug: 'other',
    description: 'Miscellaneous products',
    image: null,
    trending: false,
    growth_percentage: 10.0,
    avg_profit_margin: 35.0,
  },
]

// Sample products to seed
const sampleProducts = [
  {
    title: 'Smart Watch Fitness Tracker with Heart Rate Monitor',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
    description: 'Advanced fitness tracking watch with heart rate monitor and activity tracking',
    category_slug: 'electronics',
    buy_price: 135.00,
    sell_price: 249.99,
    rating: 4.5,
    reviews_count: 1240,
    trend_data: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 85000, 92000, 105000, 118000, 125000],
    is_winning: true,
    is_locked: false,
    profit_margin: 45.99,
    pot_revenue: 125000,
    revenue_growth_rate: 525,
    items_sold: 24840,
    avg_unit_price: 208.47,
    revenue_trend: [45000, 52000, 48000, 61000, 58000, 72000, 68000, 85000, 92000, 105000, 118000, 125000],
    found_date: '2024-01-15',
    source_type: 'hand_picked' as const,
  },
  {
    title: 'Wireless Noise Cancelling Headphones Premium',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    description: 'Premium wireless headphones with active noise cancellation',
    category_slug: 'electronics',
    buy_price: 95.00,
    sell_price: 199.99,
    rating: 4.7,
    reviews_count: 2890,
    trend_data: [92000, 98000, 105000, 112000, 125000, 138000, 152000, 168000, 175000, 180000, 182000, 185000],
    is_winning: true,
    is_locked: false,
    profit_margin: 52.50,
    pot_revenue: 185000,
    revenue_growth_rate: 101.3,
    items_sold: 59790,
    avg_unit_price: 79.80,
    revenue_trend: [92000, 98000, 105000, 112000, 125000, 138000, 152000, 168000, 175000, 180000, 182000, 185000],
    found_date: '2024-01-14',
    source_type: 'hand_picked' as const,
  },
  {
    title: 'Boho Style Summer Maxi Dress with Floral Print',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
    description: 'Beautiful boho-style maxi dress perfect for summer',
    category_slug: 'fashion',
    buy_price: 46.40,
    sell_price: 79.99,
    rating: 4.6,
    reviews_count: 856,
    trend_data: [36000, 42000, 48000, 55000, 62000, 72000, 85000, 98000, 112000, 125000, 135000, 142000],
    is_winning: true,
    is_locked: false,
    profit_margin: 42.00,
    pot_revenue: 142000,
    revenue_growth_rate: 288.5,
    items_sold: 28560,
    avg_unit_price: 100.71,
    revenue_trend: [36000, 42000, 48000, 55000, 62000, 72000, 85000, 98000, 112000, 125000, 135000, 142000],
    found_date: '2024-01-12',
    source_type: 'hand_picked' as const,
  },
  {
    title: 'LED Strip Lights RGB Smart Home Lighting Kit',
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop',
    description: 'Smart RGB LED strip lights with app control',
    category_slug: 'home-garden',
    buy_price: 38.75,
    sell_price: 59.99,
    rating: 4.4,
    reviews_count: 2340,
    trend_data: [39000, 42000, 45000, 52000, 58000, 65000, 72000, 80000, 86000, 90000, 93000, 95000],
    is_winning: true,
    is_locked: false,
    profit_margin: 35.50,
    pot_revenue: 95000,
    revenue_growth_rate: 145.2,
    items_sold: 18950,
    avg_unit_price: 38.75,
    revenue_trend: [39000, 42000, 45000, 52000, 58000, 65000, 72000, 80000, 86000, 90000, 93000, 95000],
    found_date: '2024-01-10',
    source_type: 'hand_picked' as const,
  },
]

async function seedCategories() {
  console.log('🌱 Seeding categories...')
  
  const slugToIdMap: Map<string, string> = new Map()
  
  for (const cat of categoriesToSeed) {
    // Check if category already exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single()
    
    if (existing) {
      slugToIdMap.set(cat.slug, existing.id)
      console.log(`  ✓ Category "${cat.name}" already exists (${existing.id})`)
      continue
    }
    
    const { data, error } = await supabase
      .from('categories')
      .insert({
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
        parent_category_id: null,
        trending: cat.trending,
        growth_percentage: cat.growth_percentage,
        avg_profit_margin: cat.avg_profit_margin,
      })
      .select('id')
      .single()
    
    if (error) {
      console.error(`  ✗ Error creating category "${cat.name}":`, error.message)
      continue
    }
    
    slugToIdMap.set(cat.slug, data.id)
    console.log(`  ✓ Created category "${cat.name}" (${data.id})`)
  }
  
  console.log(`✅ Categories seeded: ${slugToIdMap.size} total`)
  return slugToIdMap
}

async function seedProducts(slugToIdMap: Map<string, string>) {
  console.log('\n🌱 Seeding products...')
  
  let totalInserted = 0
  let totalErrors = 0
  
  for (const productData of sampleProducts) {
    try {
      const categoryId = slugToIdMap.get(productData.category_slug)
      if (!categoryId) {
        console.error(`  ✗ Category "${productData.category_slug}" not found`)
        totalErrors++
        continue
      }
      
      // Insert product
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert({
          title: productData.title,
          image: productData.image,
          description: productData.description,
          category_id: categoryId,
          buy_price: productData.buy_price,
          sell_price: productData.sell_price,
          additional_images: [],
          specifications: null,
          rating: productData.rating,
          reviews_count: productData.reviews_count || 0,
          trend_data: productData.trend_data || [],
          supplier_id: null,
        })
        .select('id')
        .single()
      
      if (productError) {
        console.error(`  ✗ Error creating product "${productData.title}":`, productError.message)
        totalErrors++
        continue
      }
      
      // Create product_metadata if it's a winning product
      if (productData.is_winning) {
        await supabase
          .from('product_metadata')
          .insert({
            product_id: product.id,
            is_winning: productData.is_winning,
            is_locked: productData.is_locked || false,
            unlock_price: productData.is_locked ? 9.99 : null,
            profit_margin: productData.profit_margin,
            pot_revenue: productData.pot_revenue,
            revenue_growth_rate: productData.revenue_growth_rate,
            items_sold: productData.items_sold,
            avg_unit_price: productData.avg_unit_price,
            revenue_trend: productData.revenue_trend,
            found_date: productData.found_date,
          })
      }
      
      // Create product_source
      await supabase
        .from('product_source')
        .insert({
          product_id: product.id,
          source_type: productData.source_type,
          source_id: product.id, // Use product ID as source_id
        })
      
      totalInserted++
      console.log(`  ✓ Created product "${productData.title}"`)
    } catch (error: any) {
      console.error(`  ✗ Error processing product "${productData.title}":`, error.message)
      totalErrors++
    }
  }
  
  console.log(`\n✅ Products seeded: ${totalInserted} inserted, ${totalErrors} errors`)
}

async function main() {
  console.log('🚀 Starting database seeding...\n')
  
  try {
    // Seed categories first
    const slugToIdMap = await seedCategories()
    
    // Seed products
    await seedProducts(slugToIdMap)
    
    console.log('\n🎉 Seeding completed successfully!')
  } catch (error) {
    console.error('\n❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { main as seedProductsCategories }

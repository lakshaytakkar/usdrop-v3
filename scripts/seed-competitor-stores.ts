/**
 * Seed script to populate database with competitor stores
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

// Category name to slug mapping
const categoryMapping: Record<string, string> = {
  'Electronics': 'electronics',
  'Fashion': 'fashion',
  'Beauty & Health': 'beauty',
  'Beauty': 'beauty',
  'Sports & Fitness': 'sports-fitness',
  'Home & Living': 'home-garden',
  'Home & Decor': 'home-garden',
  'Pets': 'pets',
  'Baby & Kids': 'mother-kids',
  'Kitchen & Dining': 'kitchen',
  'Automotive': 'other',
  'Books & Media': 'other',
  'Handmade': 'other',
}

// Helper function to generate Dicebear Micah avatar URL
function getStoreLogo(storeName: string): string {
  return `https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(storeName)}`
}

// Data from external page (competitor-stores/data/stores.ts)
const externalStores = [
  {
    id: 1,
    name: "TrendyGadgets Pro",
    url: "trendygadgets.com",
    logo: getStoreLogo("TrendyGadgets Pro"),
    category: "Electronics",
    monthlyRevenue: 285000,
    monthlyTraffic: 145000,
    growth: 28.5,
    country: "USA",
    products: 458,
    rating: 4.8,
    verified: true
  },
  {
    id: 2,
    name: "FashionHub Elite",
    url: "fashionhubelite.com",
    logo: getStoreLogo("FashionHub Elite"),
    category: "Fashion",
    monthlyRevenue: 425000,
    monthlyTraffic: 235000,
    growth: 42.3,
    country: "UK",
    products: 892,
    rating: 4.9,
    verified: true
  },
  {
    id: 3,
    name: "BeautyBliss Store",
    url: "beautyblissstore.com",
    logo: getStoreLogo("BeautyBliss Store"),
    category: "Beauty & Health",
    monthlyRevenue: 320000,
    monthlyTraffic: 180000,
    growth: 35.2,
    country: "USA",
    products: 567,
    rating: 4.7,
    verified: true
  },
  {
    id: 4,
    name: "FitZone Pro",
    url: "fitzonepro.com",
    logo: getStoreLogo("FitZone Pro"),
    category: "Sports & Fitness",
    monthlyRevenue: 198000,
    monthlyTraffic: 112000,
    growth: 22.8,
    country: "Canada",
    products: 334,
    rating: 4.6,
    verified: true
  },
  {
    id: 5,
    name: "HomeStyle Plus",
    url: "homestyleplus.com",
    logo: getStoreLogo("HomeStyle Plus"),
    category: "Home & Living",
    monthlyRevenue: 275000,
    monthlyTraffic: 158000,
    growth: 31.5,
    country: "USA",
    products: 445,
    rating: 4.8,
    verified: true
  },
  {
    id: 6,
    name: "PetParadise Shop",
    url: "petparadiseshop.com",
    logo: getStoreLogo("PetParadise Shop"),
    category: "Pets",
    monthlyRevenue: 156000,
    monthlyTraffic: 89000,
    growth: 19.3,
    country: "USA",
    products: 278,
    rating: 4.5,
    verified: true
  },
  {
    id: 7,
    name: "TechInnovators Hub",
    url: "techinnovatorshub.com",
    logo: getStoreLogo("TechInnovators Hub"),
    category: "Electronics",
    monthlyRevenue: 512000,
    monthlyTraffic: 298000,
    growth: 48.6,
    country: "USA",
    products: 723,
    rating: 4.9,
    verified: true
  },
  {
    id: 8,
    name: "StyleMasters Boutique",
    url: "stylemastersboutique.com",
    logo: getStoreLogo("StyleMasters Boutique"),
    category: "Fashion",
    monthlyRevenue: 389000,
    monthlyTraffic: 215000,
    growth: 38.9,
    country: "UK",
    products: 634,
    rating: 4.8,
    verified: true
  },
  {
    id: 9,
    name: "Wellness World",
    url: "wellnessworld.com",
    logo: getStoreLogo("Wellness World"),
    category: "Beauty & Health",
    monthlyRevenue: 267000,
    monthlyTraffic: 152000,
    growth: 29.7,
    country: "USA",
    products: 412,
    rating: 4.7,
    verified: true
  },
  {
    id: 10,
    name: "ActiveLife Store",
    url: "activelifestore.com",
    logo: getStoreLogo("ActiveLife Store"),
    category: "Sports & Fitness",
    monthlyRevenue: 223000,
    monthlyTraffic: 128000,
    growth: 25.4,
    country: "Australia",
    products: 389,
    rating: 4.6,
    verified: true
  },
  {
    id: 11,
    name: "CozyHome Essentials",
    url: "cozyhomeessentials.com",
    logo: getStoreLogo("CozyHome Essentials"),
    category: "Home & Living",
    monthlyRevenue: 198000,
    monthlyTraffic: 115000,
    growth: 21.2,
    country: "USA",
    products: 356,
    rating: 4.5,
    verified: true
  },
  {
    id: 12,
    name: "FurryFriends Market",
    url: "furryfriendsmarket.com",
    logo: getStoreLogo("FurryFriends Market"),
    category: "Pets",
    monthlyRevenue: 134000,
    monthlyTraffic: 78000,
    growth: 16.8,
    country: "UK",
    products: 245,
    rating: 4.4,
    verified: true
  },
  {
    id: 13,
    name: "GadgetGalaxy",
    url: "gadgetgalaxy.com",
    logo: getStoreLogo("GadgetGalaxy"),
    category: "Electronics",
    monthlyRevenue: 445000,
    monthlyTraffic: 265000,
    growth: 41.3,
    country: "USA",
    products: 678,
    rating: 4.8,
    verified: true
  },
  {
    id: 14,
    name: "Artisan Crafts Hub",
    url: "artisancraftshub.com",
    logo: getStoreLogo("Artisan Crafts Hub"),
    category: "Handmade",
    monthlyRevenue: 98000,
    monthlyTraffic: 52000,
    growth: 12.8,
    country: "UK",
    products: 892,
    rating: 4.5,
    verified: false
  },
  {
    id: 15,
    name: "Tech Innovators Shop",
    url: "techinnovatorsshop.com",
    logo: getStoreLogo("Tech Innovators Shop"),
    category: "Electronics",
    monthlyRevenue: 465000,
    monthlyTraffic: 245000,
    growth: 48.6,
    country: "USA",
    products: 723,
    rating: 4.9,
    verified: true
  },
  {
    id: 16,
    name: "Vintage Fashion Finds",
    url: "vintagefashionfinds.com",
    logo: getStoreLogo("Vintage Fashion Finds"),
    category: "Fashion",
    monthlyRevenue: 215000,
    monthlyTraffic: 115000,
    growth: 28.3,
    country: "USA",
    products: 634,
    rating: 4.7,
    verified: true
  },
  {
    id: 17,
    name: "Wellness & Vitamins Co",
    url: "wellnessvitaminsco.com",
    logo: getStoreLogo("Wellness & Vitamins Co"),
    category: "Beauty & Health",
    monthlyRevenue: 387000,
    monthlyTraffic: 192000,
    growth: 36.9,
    country: "Canada",
    products: 425,
    rating: 4.8,
    verified: true
  },
  {
    id: 18,
    name: "Kids Fun World",
    url: "kidsfunworld.com",
    logo: getStoreLogo("Kids Fun World"),
    category: "Baby & Kids",
    monthlyRevenue: 256000,
    monthlyTraffic: 135000,
    growth: 32.5,
    country: "USA",
    products: 589,
    rating: 4.7,
    verified: true
  },
  {
    id: 19,
    name: "Auto Accessories Pro",
    url: "autoaccessoriespro.com",
    logo: getStoreLogo("Auto Accessories Pro"),
    category: "Automotive",
    monthlyRevenue: 342000,
    monthlyTraffic: 178000,
    growth: 39.4,
    country: "USA",
    products: 512,
    rating: 4.6,
    verified: true
  },
  {
    id: 20,
    name: "Book Lovers Paradise",
    url: "bookloversparadise.com",
    logo: getStoreLogo("Book Lovers Paradise"),
    category: "Books & Media",
    monthlyRevenue: 125000,
    monthlyTraffic: 68000,
    growth: 16.7,
    country: "UK",
    products: 1245,
    rating: 4.8,
    verified: true
  },
]

// Data from admin page (admin/competitor-stores/data/stores.ts)
const adminStores = [
  {
    id: "cs_001",
    name: "TechGadgets Store",
    url: "techgadgets.com",
    category: "Electronics",
    country: "USA",
    monthly_traffic: 125000,
    monthly_revenue: 450000,
    growth: 15.5,
    products_count: 1250,
    rating: 4.8,
    verified: true,
    created_at: "2024-01-10T00:00:00Z",
    updated_at: "2024-01-10T00:00:00Z",
  },
  {
    id: "cs_002",
    name: "Fashion Forward",
    url: "fashionforward.com",
    category: "Fashion",
    country: "UK",
    monthly_traffic: 89000,
    monthly_revenue: 320000,
    growth: 22.3,
    products_count: 890,
    rating: 4.6,
    verified: true,
    created_at: "2024-01-09T00:00:00Z",
    updated_at: "2024-01-09T00:00:00Z",
  },
  {
    id: "cs_003",
    name: "Home Decor Plus",
    url: "homedecorplus.com",
    category: "Home & Decor",
    country: "Canada",
    monthly_traffic: 67000,
    monthly_revenue: 245000,
    growth: 8.7,
    products_count: 560,
    rating: 4.4,
    verified: false,
    created_at: "2024-01-08T00:00:00Z",
    updated_at: "2024-01-08T00:00:00Z",
  },
  {
    id: "cs_004",
    name: "Beauty Essentials",
    url: "beautyessentials.com",
    category: "Beauty",
    country: "USA",
    monthly_traffic: 150000,
    monthly_revenue: 520000,
    growth: 18.2,
    products_count: 2100,
    rating: 4.9,
    verified: true,
    created_at: "2024-01-07T00:00:00Z",
    updated_at: "2024-01-07T00:00:00Z",
  },
  {
    id: "cs_005",
    name: "Sports Zone",
    url: "sportszone.com",
    category: "Sports & Fitness",
    country: "Australia",
    monthly_traffic: 95000,
    monthly_revenue: 380000,
    growth: 12.5,
    products_count: 980,
    rating: 4.7,
    verified: true,
    created_at: "2024-01-06T00:00:00Z",
    updated_at: "2024-01-06T00:00:00Z",
  },
]

async function seedCompetitorStores() {
  console.log('🌱 Starting competitor stores seeding...\n')

  try {
    // 1. Fetch all categories to map category names to IDs
    console.log('📋 Fetching categories...')
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`)
    }

    if (!categories || categories.length === 0) {
      throw new Error('No categories found. Please seed categories first.')
    }

    console.log(`✅ Found ${categories.length} categories\n`)

    // Create a map of category slug to category ID
    const categoryMap = new Map<string, string>()
    categories.forEach(cat => {
      categoryMap.set(cat.slug, cat.id)
    })

    // 2. Merge and deduplicate stores (match by URL)
    console.log('🔄 Merging stores from both sources...')
    const allStoresMap = new Map<string, any>()

    // Add external stores
    externalStores.forEach(store => {
      const url = store.url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
      if (!allStoresMap.has(url)) {
        allStoresMap.set(url, {
          name: store.name,
          url: store.url,
          logo: store.logo,
          category: store.category,
          country: store.country,
          monthly_traffic: store.monthlyTraffic,
          monthly_revenue: store.monthlyRevenue,
          growth: store.growth,
          products_count: store.products,
          rating: store.rating,
          verified: store.verified,
        })
      }
    })

    // Add admin stores (they take precedence if URL matches)
    adminStores.forEach(store => {
      const url = store.url.toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
      allStoresMap.set(url, {
        name: store.name,
        url: store.url,
        logo: getStoreLogo(store.name),
        category: store.category,
        country: store.country,
        monthly_traffic: store.monthly_traffic,
        monthly_revenue: store.monthly_revenue,
        growth: store.growth,
        products_count: store.products_count,
        rating: store.rating,
        verified: store.verified,
      })
    })

    const uniqueStores = Array.from(allStoresMap.values())
    console.log(`✅ Merged to ${uniqueStores.length} unique stores\n`)

    // 3. Map categories and prepare insert data
    console.log('📝 Preparing store data...')
    const storesToInsert = uniqueStores.map(store => {
      const categorySlug = categoryMapping[store.category] || 'other'
      const categoryId = categoryMap.get(categorySlug) || categoryMap.get('other')

      if (!categoryId) {
        console.warn(`⚠️  Category "${store.category}" not found, using "other"`)
      }

      return {
        name: store.name,
        url: store.url,
        logo: store.logo || null,
        category_id: categoryId || null,
        country: store.country || null,
        monthly_traffic: store.monthly_traffic || 0,
        monthly_revenue: store.monthly_revenue || null,
        growth: store.growth || 0,
        products_count: store.products_count || null,
        rating: store.rating || null,
        verified: store.verified || false,
      }
    })

    // 4. Insert stores
    console.log(`💾 Inserting ${storesToInsert.length} stores...`)
    const { data: insertedStores, error: insertError } = await supabase
      .from('competitor_stores')
      .insert(storesToInsert)
      .select()

    if (insertError) {
      throw new Error(`Failed to insert stores: ${insertError.message}`)
    }

    console.log(`✅ Successfully inserted ${insertedStores?.length || 0} stores\n`)

    // 5. Summary
    console.log('📊 Seeding Summary:')
    console.log(`   - Total stores processed: ${uniqueStores.length}`)
    console.log(`   - Stores inserted: ${insertedStores?.length || 0}`)
    console.log(`   - Verified stores: ${storesToInsert.filter(s => s.verified).length}`)
    console.log(`   - Unverified stores: ${storesToInsert.filter(s => !s.verified).length}`)
    console.log('\n✅ Competitor stores seeding completed successfully!')

  } catch (error) {
    console.error('\n❌ Error seeding competitor stores:', error)
    if (error instanceof Error) {
      console.error('   Message:', error.message)
    }
    process.exit(1)
  }
}

// Run the seed function
seedCompetitorStores()


/**
 * Seed Onboarding Course Data Script
 * Creates onboarding modules and videos for the onboarding system
 * 
 * Usage: npx tsx scripts/seed-onboarding-course.ts
 * 
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const trimmedLine = line.trim()
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
          process.env[key.trim()] = value
        }
      }
    })
  }
}

loadEnvFile()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Onboarding course data structure
const onboardingModules = [
  {
    title: "Welcome to USDrop",
    description: "Get started with USDrop and learn the basics of the platform",
    order_index: 1,
    thumbnail: null,
    videos: [
      {
        title: "Introduction to USDrop Platform",
        description: "Learn about USDrop's features and how it can help your dropshipping business",
        video_url: "https://example.com/videos/welcome-intro.mp4",
        video_duration: 180, // 3 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Setting Up Your Account",
        description: "Step-by-step guide to setting up your USDrop account and profile",
        video_url: "https://example.com/videos/setup-account.mp4",
        video_duration: 240, // 4 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Navigating the Dashboard",
        description: "Learn how to navigate the USDrop dashboard and find key features",
        video_url: "https://example.com/videos/navigate-dashboard.mp4",
        video_duration: 150, // 2.5 minutes
        thumbnail: null,
        order_index: 3
      }
    ]
  },
  {
    title: "Dropshipping Fundamentals",
    description: "Master the basics of dropshipping and e-commerce",
    order_index: 2,
    thumbnail: null,
    videos: [
      {
        title: "What is Dropshipping?",
        description: "Understanding the dropshipping business model and how it works",
        video_url: "https://example.com/videos/dropshipping-basics.mp4",
        video_duration: 300, // 5 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Finding Winning Products",
        description: "Learn how to identify profitable products for your store",
        video_url: "https://example.com/videos/finding-products.mp4",
        video_duration: 360, // 6 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Pricing Strategies",
        description: "Master pricing strategies to maximize your profit margins",
        video_url: "https://example.com/videos/pricing-strategies.mp4",
        video_duration: 270, // 4.5 minutes
        thumbnail: null,
        order_index: 3
      }
    ]
  },
  {
    title: "USDrop AI Tools",
    description: "Learn how to use USDrop's powerful AI tools to grow your business",
    order_index: 3,
    thumbnail: null,
    videos: [
      {
        title: "Image Studio Overview",
        description: "Create stunning product images with AI-powered Image Studio",
        video_url: "https://example.com/videos/image-studio.mp4",
        video_duration: 240, // 4 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Ad Studio Basics",
        description: "Generate high-converting ad creatives with Ad Studio",
        video_url: "https://example.com/videos/ad-studio.mp4",
        video_duration: 300, // 5 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Campaign Studio",
        description: "Plan and manage your advertising campaigns effectively",
        video_url: "https://example.com/videos/campaign-studio.mp4",
        video_duration: 360, // 6 minutes
        thumbnail: null,
        order_index: 3
      },
      {
        title: "Model Studio",
        description: "Create professional model advertisements for your products",
        video_url: "https://example.com/videos/model-studio.mp4",
        video_duration: 270, // 4.5 minutes
        thumbnail: null,
        order_index: 4
      }
    ]
  },
  {
    title: "Getting Started with Your Store",
    description: "Set up your first store and start selling",
    order_index: 4,
    thumbnail: null,
    videos: [
      {
        title: "Connecting Your Shopify Store",
        description: "Learn how to connect and sync your Shopify store with USDrop",
        video_url: "https://example.com/videos/connect-shopify.mp4",
        video_duration: 300, // 5 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Adding Your First Product",
        description: "Step-by-step guide to adding and optimizing your first product",
        video_url: "https://example.com/videos/add-product.mp4",
        video_duration: 360, // 6 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Setting Up Payment Methods",
        description: "Configure payment gateways and payment methods for your store",
        video_url: "https://example.com/videos/payment-setup.mp4",
        video_duration: 240, // 4 minutes
        thumbnail: null,
        order_index: 3
      }
    ]
  },
  {
    title: "Marketing & Growth",
    description: "Learn marketing strategies to grow your dropshipping business",
    order_index: 5,
    thumbnail: null,
    videos: [
      {
        title: "Facebook & Instagram Ads",
        description: "Create effective social media ads to drive traffic and sales",
        video_url: "https://example.com/videos/social-ads.mp4",
        video_duration: 420, // 7 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Email Marketing Basics",
        description: "Build and nurture your customer email list",
        video_url: "https://example.com/videos/email-marketing.mp4",
        video_duration: 300, // 5 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Customer Retention Strategies",
        description: "Learn how to keep customers coming back",
        video_url: "https://example.com/videos/customer-retention.mp4",
        video_duration: 360, // 6 minutes
        thumbnail: null,
        order_index: 3
      }
    ]
  },
  {
    title: "Advanced Tips & Best Practices",
    description: "Advanced strategies and best practices for success",
    order_index: 6,
    thumbnail: null,
    videos: [
      {
        title: "Scaling Your Business",
        description: "Learn how to scale your dropshipping business efficiently",
        video_url: "https://example.com/videos/scaling-business.mp4",
        video_duration: 450, // 7.5 minutes
        thumbnail: null,
        order_index: 1
      },
      {
        title: "Customer Service Excellence",
        description: "Provide exceptional customer service to build trust and loyalty",
        video_url: "https://example.com/videos/customer-service.mp4",
        video_duration: 300, // 5 minutes
        thumbnail: null,
        order_index: 2
      },
      {
        title: "Analytics & Optimization",
        description: "Use data and analytics to optimize your store performance",
        video_url: "https://example.com/videos/analytics.mp4",
        video_duration: 360, // 6 minutes
        thumbnail: null,
        order_index: 3
      }
    ]
  }
]

async function seedOnboardingCourse() {
  try {
    console.log('Starting onboarding course seed...')

    // Clear existing onboarding data (optional - comment out if you want to keep existing data)
    // const { error: deleteVideosError } = await supabaseAdmin
    //   .from('onboarding_videos')
    //   .delete()
    //   .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all
    
    // const { error: deleteModulesError } = await supabaseAdmin
    //   .from('onboarding_modules')
    //   .delete()
    //   .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

    // Insert modules and videos
    for (const moduleData of onboardingModules) {
      const { videos, ...moduleFields } = moduleData

      // Insert module
      const { data: module, error: moduleError } = await supabaseAdmin
        .from('onboarding_modules')
        .insert({
          ...moduleFields,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (moduleError) {
        console.error(`Error inserting module "${moduleData.title}":`, moduleError)
        continue
      }

      console.log(`✓ Created module: ${moduleData.title}`)

      // Insert videos for this module
      for (const videoData of videos) {
        const { error: videoError } = await supabaseAdmin
          .from('onboarding_videos')
          .insert({
            ...videoData,
            module_id: module.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })

        if (videoError) {
          console.error(`Error inserting video "${videoData.title}":`, videoError)
        } else {
          console.log(`  ✓ Created video: ${videoData.title}`)
        }
      }
    }

    console.log('\n✅ Onboarding course seed completed successfully!')
    console.log(`Created ${onboardingModules.length} modules with ${onboardingModules.reduce((sum, m) => sum + m.videos.length, 0)} videos total`)
  } catch (error) {
    console.error('Error seeding onboarding course:', error)
    process.exit(1)
  }
}

seedOnboardingCourse()


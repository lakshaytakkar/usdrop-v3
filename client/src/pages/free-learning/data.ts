export interface FreeLearningLesson {
  id: string
  title: string
  duration: string
  videoUrl: string | null
  externalUrl?: string | null
  description?: string
  tags?: string[]
}

export interface FreeLearningModule {
  id: string
  title: string
  lessons: FreeLearningLesson[]
  totalDuration: string
}

export const freeLearningCourse = {
  title: "Free DropShipping",
  subtitle: "Part of Finding of Founders",
  description: "Master the fundamentals of USA dropshipping — from product research to Shopify setup to running your first ads. Free for everyone.",
  rating: 4.82,
  reviewCount: 11,
  memberCount: 1518,
  completionTime: "4 hours 28 minutes",
  lastUpdate: "22/01/2025",
  thumbnail: "/images/thumbnail-store-setup.png",
}

export const freeLearningModules: FreeLearningModule[] = [
  {
    id: "intro-dropshipping",
    title: "1: Introduction to Dropshipping",
    totalDuration: "18 mins",
    lessons: [
      {
        id: "part-01",
        title: "Part 01 | USA Dropshipping Overview",
        duration: "18 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/fAdCYxe7e4A",
        description: "You can find endless content online about building businesses, especially about dropshipping. In this video, we share honest, uncensored experience on topics you won't find elsewhere.",
        tags: ["Dropshipping", "Entrepreneurship"],
      },
    ],
  },
  {
    id: "product-selection",
    title: "2: Product Selection and Research",
    totalDuration: "22 mins",
    lessons: [
      {
        id: "part-02",
        title: "Part 02 | Product Research & Niches",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/TORi-nBGX4Q",
        description: "Learn the fundamentals of product research and how to identify profitable niches for your dropshipping business.",
        tags: ["Product Research", "Niches"],
      },
      {
        id: "part-03",
        title: "Part 03 | Find Niches Ideas and Products",
        duration: "3 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/NVGS6r7M-z0",
        description: "Discover practical methods for finding niche ideas and products that sell well in the US market.",
        tags: ["Niches", "Product Ideas"],
      },
      {
        id: "part-04",
        title: "Part 04 | How We Build Dropshipping Eco System in USA & China",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/lf4ff58mkIw",
        description: "Understand how the dropshipping ecosystem works between the USA and China, from sourcing to delivery.",
        tags: ["Sourcing", "Supply Chain"],
      },
      {
        id: "part-05",
        title: "Part 05 | Products Categories for USA Dropshipping",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/GVaNraNfB2U",
        description: "Explore the most profitable product categories for USA dropshipping and learn which ones to focus on.",
        tags: ["Categories", "Products"],
      },
      {
        id: "part-06",
        title: "Part 06 | Products for USA Dropshipping",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/4iNYORF-fAA",
        description: "Deep dive into specific product selections that work best for the US dropshipping market.",
        tags: ["Products", "Dropshipping"],
      },
      {
        id: "part-07",
        title: "Part 07 | How to Start USA Dropshipping Business",
        duration: "3 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/IxK4h6QCznk",
        description: "Step-by-step guide to launching your USA dropshipping business from scratch.",
        tags: ["Getting Started", "Business"],
      },
    ],
  },
  {
    id: "shopify-setup",
    title: "3: Setting Up Shopify Website",
    totalDuration: "1 hr 38 mins",
    lessons: [
      {
        id: "shopify-01",
        title: "Shopify 01 | Shopify Setup",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/wJEL46Bs0yI",
        description: "Get your Shopify store up and running. We walk through the initial setup, plan selection, and basic configuration.",
        tags: ["Shopify", "Setup"],
      },
      {
        id: "shopify-02",
        title: "Shopify 02 | Overview of Shopify Dashboard",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/-iu8MByByLM",
        description: "Navigate the Shopify dashboard like a pro. Learn where everything is and what each section does.",
        tags: ["Shopify", "Dashboard"],
      },
      {
        id: "shopify-03",
        title: "Shopify 03 | Create First Collections in Shopify",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/zd7PWTKGui8",
        description: "Organize your products into collections to improve store navigation and customer experience.",
        tags: ["Shopify", "Collections"],
      },
      {
        id: "shopify-04",
        title: "Shopify 04 | Create First Product",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/J8qOnWio1fI",
        description: "Add your first product to your Shopify store with optimized titles, descriptions, and images.",
        tags: ["Shopify", "Products"],
      },
      {
        id: "shopify-05",
        title: "Shopify 05 | Bulk Products Upload",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/SjBSesJdOFM",
        description: "Save time by uploading multiple products at once using Shopify's bulk import tools.",
        tags: ["Shopify", "Bulk Upload"],
      },
      {
        id: "shopify-06",
        title: "Shopify 06 | Order Fulfilment",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/pTIDcVBMQGU",
        description: "Learn the complete order fulfillment process for dropshipping — from customer order to delivery.",
        tags: ["Shopify", "Fulfillment"],
      },
      {
        id: "shopify-07",
        title: "Shopify 07 | App Installation",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/NFCDIY59Vgg",
        description: "Install essential Shopify apps that will streamline your dropshipping operations and boost sales.",
        tags: ["Shopify", "Apps"],
      },
      {
        id: "shopify-08",
        title: "Shopify 08 | Theme Upload",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/YvmzNsBzC6k",
        description: "Upload and install a professional Shopify theme to give your store a polished, conversion-ready look.",
        tags: ["Shopify", "Themes"],
      },
      {
        id: "shopify-09",
        title: "Shopify 09 | Theme Landing Page Customization",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/aNeVfa8Vbv8",
        description: "Customize your store's landing page to maximize conversions and create a great first impression.",
        tags: ["Shopify", "Customization"],
      },
      {
        id: "shopify-10",
        title: "Shopify 10 | Theme Landing Collection, Products & Checkout Customization",
        duration: "8 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/3_RChdhAyS4",
        description: "Fine-tune your collection pages, product pages, and checkout flow for maximum conversions.",
        tags: ["Shopify", "Checkout"],
      },
    ],
  },
  {
    id: "usa-mentorship",
    title: "USA Mentorship",
    totalDuration: "1 hr 39 mins",
    lessons: [
      {
        id: "mentorship-intro",
        title: "Introduction of Mentorship",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/09QU1SRGPmk",
        description: "Get an overview of our mentorship program and what you'll gain from personalized 1-on-1 guidance.",
        tags: ["Mentorship", "Overview"],
      },
      {
        id: "mentorship-01",
        title: "Introduction Mentorship - Part 01",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/-tCQRiePfgM",
        description: "Part 1 of the mentorship introduction covering the core principles and methodology we use.",
        tags: ["Mentorship", "Foundations"],
      },
      {
        id: "mentorship-02",
        title: "Introduction Mentorship - Part 02",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/rjBEoV5msRI",
        description: "Part 2 continues the mentorship methodology with advanced strategies and real-world case studies.",
        tags: ["Mentorship", "Strategy"],
      },
      {
        id: "mentorship-03",
        title: "Mentorship Onboarding - Part 03",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/3Ayjk9M6y4U",
        description: "Complete the onboarding process and understand how to maximize your mentorship experience.",
        tags: ["Mentorship", "Onboarding"],
      },
      {
        id: "mentorship-04",
        title: "Live Preview Mentorship - Part 04",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/ZH01_oTvFp8",
        description: "Live preview session showing how mentorship sessions work and what to expect from your mentor.",
        tags: ["Mentorship", "Live Preview"],
      },
      {
        id: "mentorship-05",
        title: "Mentorship Framework",
        duration: "19 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/F5RKz5T7hxk",
        description: "Learn our proven mentorship framework that has helped 100+ students build successful dropshipping businesses.",
        tags: ["Mentorship", "Framework"],
      },
    ],
  },
  {
    id: "meta-ads",
    title: "Learning - Meta Ads",
    totalDuration: "31 mins",
    lessons: [
      {
        id: "meta-ads-01",
        title: "Meta Ads 01 - Create First Meta Ads",
        duration: "31 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/rOIzv8jTKOg",
        description: "Learn how to create and launch your first Meta (Facebook/Instagram) ad campaign for your dropshipping store.",
        tags: ["Meta Ads", "Marketing"],
      },
    ],
  },
  {
    id: "managing-store",
    title: "4: Managing Your Store",
    totalDuration: "",
    lessons: [
      {
        id: "knowledge-docs",
        title: "Right to Knowledge Docs",
        duration: "",
        videoUrl: null,
        externalUrl: "https://docs.google.com/spreadsheets/d/1R1_C09Jjruq3cO5X-Tqnd5OwDEAiOhHThAifGzZpz_g/edit?usp=sharing",
        description: "Access our comprehensive knowledge base with supplier lists, product data, and business resources.",
        tags: ["Resources", "Knowledge Base"],
      },
    ],
  },
]

export function getYouTubeThumbnail(videoUrl: string | null): string | null {
  if (!videoUrl) return null
  const match = videoUrl.match(/\/embed\/([a-zA-Z0-9_-]+)/)
  if (match && match[1]) {
    return `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg`
  }
  return null
}

export function findLesson(lessonId: string): { module: FreeLearningModule; lesson: FreeLearningLesson; lessonIndex: number; moduleIndex: number } | null {
  for (let mi = 0; mi < freeLearningModules.length; mi++) {
    const module = freeLearningModules[mi]
    for (let li = 0; li < module.lessons.length; li++) {
      if (module.lessons[li].id === lessonId) {
        return { module, lesson: module.lessons[li], lessonIndex: li, moduleIndex: mi }
      }
    }
  }
  return null
}

export function getNextLesson(currentLessonId: string): FreeLearningLesson | null {
  const allLessons = freeLearningModules.flatMap(m => m.lessons)
  const idx = allLessons.findIndex(l => l.id === currentLessonId)
  if (idx >= 0 && idx < allLessons.length - 1) {
    return allLessons[idx + 1]
  }
  return null
}

export function getPrevLesson(currentLessonId: string): FreeLearningLesson | null {
  const allLessons = freeLearningModules.flatMap(m => m.lessons)
  const idx = allLessons.findIndex(l => l.id === currentLessonId)
  if (idx > 0) {
    return allLessons[idx - 1]
  }
  return null
}

export function getTotalLessons(): number {
  return freeLearningModules.reduce((acc, m) => acc + m.lessons.length, 0)
}

const STORAGE_KEY = "free-learning-completed"

export function markLessonCompleted(lessonId: string): void {
  const completed = getCompletedLessons()
  if (!completed.includes(lessonId)) {
    completed.push(lessonId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }
}

export function getCompletedLessons(): string[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {}
  return []
}

export function getCompletionCount(): number {
  const completed = getCompletedLessons()
  const allIds = freeLearningModules.flatMap(m => m.lessons.map(l => l.id))
  return allIds.filter(id => completed.includes(id)).length
}

export function isAllCompleted(): boolean {
  const total = getTotalLessons()
  return getCompletionCount() >= total
}

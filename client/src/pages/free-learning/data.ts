export interface FreeLearningLesson {
  id: string
  title: string
  duration: string
  videoUrl: string | null
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
        videoUrl: null,
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
        videoUrl: null,
      },
      {
        id: "part-03",
        title: "Part 03 | Find Niches Ideas and Products",
        duration: "3 min",
        videoUrl: null,
      },
      {
        id: "part-04",
        title: "Part 04 | How We Build Dropshipping Eco System in USA & China",
        duration: "4 min",
        videoUrl: null,
      },
      {
        id: "part-05",
        title: "Part 05 | Products Categories for USA Dropshipping",
        duration: "4 min",
        videoUrl: null,
      },
      {
        id: "part-06",
        title: "Part 06 | Products for USA Dropshipping",
        duration: "4 min",
        videoUrl: null,
      },
      {
        id: "part-07",
        title: "Part 07 | How to Start USA Dropshipping Business",
        duration: "3 min",
        videoUrl: null,
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
        videoUrl: null,
      },
      {
        id: "shopify-02",
        title: "Shopify 02 | Overview of Shopify Dashboard",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-03",
        title: "Shopify 03 | Create First Collections in Shopify",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-04",
        title: "Shopify 04 | Create First Product",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-05",
        title: "Shopify 05 | Bulk Products Upload",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-06",
        title: "Shopify 06 | Order Fulfilment",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-07",
        title: "Shopify 07 | App Installation",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-08",
        title: "Shopify 08 | Theme Upload",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-09",
        title: "Shopify 09 | Theme Landing Page Customization",
        duration: "10 min",
        videoUrl: null,
      },
      {
        id: "shopify-10",
        title: "Shopify 10 | Theme Landing Collection, Products & Checkout Customization",
        duration: "8 min",
        videoUrl: null,
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
        videoUrl: null,
      },
      {
        id: "mentorship-01",
        title: "Introduction Mentorship - Part 01",
        duration: "16 min",
        videoUrl: null,
      },
      {
        id: "mentorship-02",
        title: "Introduction Mentorship - Part 02",
        duration: "16 min",
        videoUrl: null,
      },
      {
        id: "mentorship-03",
        title: "Mentorship Onboarding - Part 03",
        duration: "16 min",
        videoUrl: null,
      },
      {
        id: "mentorship-04",
        title: "Live Preview Mentorship - Part 04",
        duration: "16 min",
        videoUrl: null,
      },
      {
        id: "mentorship-05",
        title: "Mentorship Framework",
        duration: "19 min",
        videoUrl: null,
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
        videoUrl: null,
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
      },
    ],
  },
]

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

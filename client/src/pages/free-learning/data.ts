export interface FreeLearningLesson {
  id: string
  title: string
  duration: string
  videoUrl: string | null
  externalUrl?: string | null
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
      },
      {
        id: "part-03",
        title: "Part 03 | Find Niches Ideas and Products",
        duration: "3 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/NVGS6r7M-z0",
      },
      {
        id: "part-04",
        title: "Part 04 | How We Build Dropshipping Eco System in USA & China",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/lf4ff58mkIw",
      },
      {
        id: "part-05",
        title: "Part 05 | Products Categories for USA Dropshipping",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/GVaNraNfB2U",
      },
      {
        id: "part-06",
        title: "Part 06 | Products for USA Dropshipping",
        duration: "4 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/4iNYORF-fAA",
      },
      {
        id: "part-07",
        title: "Part 07 | How to Start USA Dropshipping Business",
        duration: "3 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/IxK4h6QCznk",
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
      },
      {
        id: "shopify-02",
        title: "Shopify 02 | Overview of Shopify Dashboard",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/-iu8MByByLM",
      },
      {
        id: "shopify-03",
        title: "Shopify 03 | Create First Collections in Shopify",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/zd7PWTKGui8",
      },
      {
        id: "shopify-04",
        title: "Shopify 04 | Create First Product",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/J8qOnWio1fI",
      },
      {
        id: "shopify-05",
        title: "Shopify 05 | Bulk Products Upload",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/SjBSesJdOFM",
      },
      {
        id: "shopify-06",
        title: "Shopify 06 | Order Fulfilment",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/pTIDcVBMQGU",
      },
      {
        id: "shopify-07",
        title: "Shopify 07 | App Installation",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/NFCDIY59Vgg",
      },
      {
        id: "shopify-08",
        title: "Shopify 08 | Theme Upload",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/YvmzNsBzC6k",
      },
      {
        id: "shopify-09",
        title: "Shopify 09 | Theme Landing Page Customization",
        duration: "10 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/aNeVfa8Vbv8",
      },
      {
        id: "shopify-10",
        title: "Shopify 10 | Theme Landing Collection, Products & Checkout Customization",
        duration: "8 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/3_RChdhAyS4",
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
      },
      {
        id: "mentorship-01",
        title: "Introduction Mentorship - Part 01",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/-tCQRiePfgM",
      },
      {
        id: "mentorship-02",
        title: "Introduction Mentorship - Part 02",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/rjBEoV5msRI",
      },
      {
        id: "mentorship-03",
        title: "Mentorship Onboarding - Part 03",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/3Ayjk9M6y4U",
      },
      {
        id: "mentorship-04",
        title: "Live Preview Mentorship - Part 04",
        duration: "16 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/ZH01_oTvFp8",
      },
      {
        id: "mentorship-05",
        title: "Mentorship Framework",
        duration: "19 min",
        videoUrl: "https://www.youtube-nocookie.com/embed/F5RKz5T7hxk",
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

const STORAGE_KEY = "free-learning-completed"

export function markLessonCompleted(lessonId: string): void {
  const completed = getCompletedLessons()
  if (!completed.includes(lessonId)) {
    completed.push(lessonId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completed))
  }
}

export async function markLessonCompletedOnServer(lessonId: string): Promise<void> {
  try {
    const token = localStorage.getItem('usdrop_auth_token')
    if (!token) return
    await fetch('/api/learning/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ lesson_id: lessonId }),
    })
  } catch {}
}

export async function syncCompletedLessonsFromServer(): Promise<string[]> {
  try {
    const token = localStorage.getItem('usdrop_auth_token')
    if (!token) return []
    const res = await fetch('/api/learning/progress', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    if (res.ok) {
      const data = await res.json()
      const serverLessons: string[] = (data.lessons || []).map((l: any) => l.lesson_id)
      const localLessons = getCompletedLessons()
      const merged = Array.from(new Set([...localLessons, ...serverLessons]))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(merged))
      return merged
    }
  } catch {}
  return getCompletedLessons()
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

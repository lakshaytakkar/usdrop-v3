export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  thumbnail: string
  duration: string
  lessons: number
  students: number
  rating: number
  price: number
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  featured: boolean
  modules: CourseModule[]
}

export interface CourseModule {
  id: string
  title: string
  duration: string
  lessons: number
  completed: boolean
  description?: string
  thumbnail?: string
  video_url?: string
}

export const sampleCourses: Course[] = [
  {
    id: "course-001",
    title: "Dropshipping Fundamentals",
    description:
      "Learn the basics of dropshipping, from setting up your store to finding winning products.",
    instructor: "Sarah Johnson",
    instructorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    thumbnail: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400",
    duration: "8 hours",
    lessons: 24,
    students: 3420,
    rating: 4.8,
    price: 0,
    category: "Basics",
    level: "Beginner",
    featured: true,
    modules: [
      {
        id: "mod-1",
        title: "Introduction to Dropshipping",
        duration: "30 min",
        lessons: 5,
        completed: true,
      },
      {
        id: "mod-2",
        title: "Setting Up Your Store",
        duration: "45 min",
        lessons: 8,
        completed: true,
      },
      {
        id: "mod-3",
        title: "Finding Winning Products",
        duration: "60 min",
        lessons: 6,
        completed: false,
      },
      {
        id: "mod-4",
        title: "Marketing Strategies",
        duration: "50 min",
        lessons: 5,
        completed: false,
      },
    ],
  },
  {
    id: "course-002",
    title: "Advanced Facebook Ads",
    description:
      "Master Facebook advertising to scale your dropshipping business with profitable campaigns.",
    instructor: "Michael Chen",
    instructorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    thumbnail: "https://images.unsplash.com/photo-1544117519-31a4b719223d?w=400",
    duration: "12 hours",
    lessons: 36,
    students: 2156,
    rating: 4.9,
    price: 99,
    category: "Marketing",
    level: "Advanced",
    featured: true,
    modules: [
      {
        id: "mod-1",
        title: "Ad Creative Mastery",
        duration: "45 min",
        lessons: 8,
        completed: false,
      },
      {
        id: "mod-2",
        title: "Audience Targeting",
        duration: "60 min",
        lessons: 10,
        completed: false,
      },
      {
        id: "mod-3",
        title: "Campaign Optimization",
        duration: "55 min",
        lessons: 9,
        completed: false,
      },
      {
        id: "mod-4",
        title: "Scaling Strategies",
        duration: "50 min",
        lessons: 9,
        completed: false,
      },
    ],
  },
  {
    id: "course-003",
    title: "Product Research Mastery",
    description: "Discover proven methods to find winning products that sell consistently.",
    instructor: "Emily Rodriguez",
    instructorAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    thumbnail: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
    duration: "6 hours",
    lessons: 18,
    students: 1890,
    rating: 4.7,
    price: 79,
    category: "Research",
    level: "Intermediate",
    featured: false,
    modules: [
      {
        id: "mod-1",
        title: "Research Tools & Methods",
        duration: "40 min",
        lessons: 6,
        completed: false,
      },
      {
        id: "mod-2",
        title: "Trend Analysis",
        duration: "35 min",
        lessons: 5,
        completed: false,
      },
      {
        id: "mod-3",
        title: "Competitor Analysis",
        duration: "45 min",
        lessons: 7,
        completed: false,
      },
    ],
  },
  {
    id: "course-004",
    title: "Store Optimization",
    description: "Optimize your store for conversions and maximize your sales potential.",
    instructor: "David Williams",
    instructorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    thumbnail: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400",
    duration: "5 hours",
    lessons: 15,
    students: 1234,
    rating: 4.6,
    price: 69,
    category: "Optimization",
    level: "Intermediate",
    featured: false,
    modules: [
      {
        id: "mod-1",
        title: "Homepage Design",
        duration: "30 min",
        lessons: 4,
        completed: false,
      },
      {
        id: "mod-2",
        title: "Product Pages",
        duration: "40 min",
        lessons: 5,
        completed: false,
      },
      {
        id: "mod-3",
        title: "Checkout Optimization",
        duration: "35 min",
        lessons: 6,
        completed: false,
      },
    ],
  },
]


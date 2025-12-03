// Chapter Content Types
export type ChapterContentType = "video" | "text" | "quiz" | "assignment" | "resource"

// Quiz Question Types
export interface QuizQuestion {
  id: string
  question: string
  type: "multiple-choice" | "true-false" | "short-answer"
  options?: string[]
  correct_answer: string | number
  explanation?: string
  points: number
}

// Chapter Content based on type
export interface ChapterContent {
  video_url?: string
  video_transcript?: string
  video_duration?: string
  text_content?: string
  quiz_questions?: QuizQuestion[]
  assignment_instructions?: string
  assignment_type?: "file-upload" | "text-submission" | "both"
  downloadable_files?: string[]
  resource_url?: string
  resource_type?: "pdf" | "image" | "document" | "link"
}

// Resource interface
export interface Resource {
  id: string
  name: string
  url: string
  type: string
  size?: string
}

// Chapter interface
export interface Chapter {
  id: string
  module_id: string
  title: string
  description?: string
  content_type: ChapterContentType
  content: ChapterContent
  order_index: number
  duration?: string
  is_preview?: boolean
  resources?: Resource[]
  created_at: string
  updated_at: string
}

// Module interface
export interface Module {
  id: string
  course_id: string
  title: string
  description?: string
  thumbnail?: string
  order_index: number
  chapters?: Chapter[]
  duration?: string
  is_preview?: boolean
  created_at: string
  updated_at: string
}

// Course interface - enhanced with modules
export interface Course {
  id: string
  title: string
  slug: string
  description: string
  instructor_id: string | null
  instructor_name: string
  instructor_avatar: string | null
  thumbnail: string | null
  duration: string | null
  lessons_count: number
  students_count: number
  rating: number | null
  price: number
  category: string | null
  level: "Beginner" | "Intermediate" | "Advanced" | null
  featured: boolean
  published: boolean
  published_at: string | null
  modules?: Module[]
  tags?: string[]
  learning_objectives?: string[]
  prerequisites?: string[]
  created_at: string
  updated_at: string
}

export const sampleCourses: Course[] = [
  {
    id: "course_001",
    title: "E-commerce Mastery",
    slug: "ecommerce-mastery",
    description: "Learn how to build and scale a successful e-commerce business from scratch. This comprehensive course covers everything from product selection to marketing strategies.",
    instructor_id: "instructor_001",
    instructor_name: "John Smith",
    instructor_avatar: null,
    thumbnail: "https://images.unsplash.com/photo-1556740758-90de374c12ad?w=400",
    duration: "8 hours",
    lessons_count: 24,
    students_count: 1250,
    rating: 4.8,
    price: 99.99,
    category: "Business",
    level: "Intermediate",
    featured: true,
    published: true,
    published_at: "2024-01-01T00:00:00Z",
    tags: ["ecommerce", "business", "marketing"],
    learning_objectives: [
      "Understand e-commerce fundamentals",
      "Build a scalable online store",
      "Master digital marketing strategies"
    ],
    prerequisites: ["Basic business knowledge"],
    modules: [
      {
        id: "module_001",
        course_id: "course_001",
        title: "Introduction to E-commerce",
        description: "Get started with the fundamentals of e-commerce",
        order_index: 0,
        duration: "2 hours",
        is_preview: true,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        chapters: [
          {
            id: "chapter_001",
            module_id: "module_001",
            title: "What is E-commerce?",
            description: "Introduction to e-commerce concepts",
            content_type: "video",
            content: {
              video_url: "https://example.com/video1.mp4",
              video_transcript: "Welcome to e-commerce mastery...",
              video_duration: "15:30"
            },
            order_index: 0,
            duration: "15:30",
            is_preview: true,
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: "chapter_002",
            module_id: "module_001",
            title: "E-commerce Business Models",
            content_type: "text",
            content: {
              text_content: "There are several e-commerce business models..."
            },
            order_index: 1,
            duration: "10:00",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          }
        ]
      },
      {
        id: "module_002",
        course_id: "course_001",
        title: "Setting Up Your Store",
        description: "Learn how to set up and configure your online store",
        order_index: 1,
        duration: "3 hours",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
        chapters: [
          {
            id: "chapter_003",
            module_id: "module_002",
            title: "Choosing a Platform",
            content_type: "video",
            content: {
              video_url: "https://example.com/video2.mp4",
              video_duration: "20:00"
            },
            order_index: 0,
            duration: "20:00",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          },
          {
            id: "chapter_004",
            module_id: "module_002",
            title: "Platform Comparison Quiz",
            content_type: "quiz",
            content: {
              quiz_questions: [
                {
                  id: "q1",
                  question: "Which platform is best for beginners?",
                  type: "multiple-choice",
                  options: ["Shopify", "WooCommerce", "Magento", "BigCommerce"],
                  correct_answer: 0,
                  explanation: "Shopify is the most beginner-friendly platform",
                  points: 10
                }
              ]
            },
            order_index: 1,
            duration: "15:00",
            created_at: "2024-01-01T00:00:00Z",
            updated_at: "2024-01-01T00:00:00Z"
          }
        ]
      }
    ],
    created_at: "2023-12-15T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: "course_002",
    title: "Dropshipping Fundamentals",
    slug: "dropshipping-fundamentals",
    description: "Complete guide to starting a dropshipping business",
    instructor_id: "instructor_002",
    instructor_name: "Jane Doe",
    instructor_avatar: null,
    thumbnail: "/images/thumbnail-landscape-1764451401501.png",
    duration: "6 hours",
    lessons_count: 18,
    students_count: 890,
    rating: 4.6,
    price: 79.99,
    category: "Business",
    level: "Beginner",
    featured: false,
    published: true,
    published_at: "2024-01-05T00:00:00Z",
    tags: ["dropshipping", "entrepreneurship"],
    learning_objectives: [
      "Set up a dropshipping store",
      "Find profitable products",
      "Market your business effectively"
    ],
    modules: [
      {
        id: "module_003",
        course_id: "course_002",
        title: "Dropshipping Basics",
        order_index: 0,
        duration: "2 hours",
        created_at: "2024-01-05T00:00:00Z",
        updated_at: "2024-01-05T00:00:00Z",
        chapters: [
          {
            id: "chapter_005",
            module_id: "module_003",
            title: "Introduction to Dropshipping",
            content_type: "video",
            content: {
              video_url: "https://example.com/video3.mp4",
              video_duration: "18:00"
            },
            order_index: 0,
            duration: "18:00",
            created_at: "2024-01-05T00:00:00Z",
            updated_at: "2024-01-05T00:00:00Z"
          }
        ]
      }
    ],
    created_at: "2023-12-20T00:00:00Z",
    updated_at: "2024-01-05T00:00:00Z",
  },
  {
    id: "course_003",
    title: "Advanced Marketing Strategies",
    slug: "advanced-marketing-strategies",
    description: "Master advanced marketing techniques for e-commerce",
    instructor_id: "instructor_001",
    instructor_name: "John Smith",
    instructor_avatar: null,
    thumbnail: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400",
    duration: "10 hours",
    lessons_count: 30,
    students_count: 650,
    rating: 4.9,
    price: 149.99,
    category: "Marketing",
    level: "Advanced",
    featured: true,
    published: false,
    published_at: null,
    tags: ["marketing", "advanced", "strategy"],
    learning_objectives: [
      "Master advanced SEO techniques",
      "Implement effective PPC campaigns",
      "Build a comprehensive marketing strategy"
    ],
    modules: [],
    created_at: "2023-12-10T00:00:00Z",
    updated_at: "2023-12-10T00:00:00Z",
  },
]

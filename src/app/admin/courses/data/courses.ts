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
  created_at: string
  updated_at: string
}

export const sampleCourses: Course[] = [
  {
    id: "course_001",
    title: "E-commerce Mastery",
    slug: "ecommerce-mastery",
    description: "Learn how to build and scale a successful e-commerce business",
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
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400",
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
    created_at: "2023-12-10T00:00:00Z",
    updated_at: "2023-12-10T00:00:00Z",
  },
]



"use client"

import Image from "next/image"
import { cn } from "@/lib/utils"

export interface Category {
  id: string
  name: string
  image: string
}

const categories: Category[] = [
  {
    id: "all",
    name: "All Products",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
  {
    id: "Fitness & Health",
    name: "Fitness & Health",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
  },
  {
    id: "Electronics",
    name: "Electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=100&h=100&fit=crop",
  },
  {
    id: "Home Decor",
    name: "Home Decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=100&h=100&fit=crop",
  },
  {
    id: "Audio",
    name: "Audio",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop",
  },
  {
    id: "Kitchen",
    name: "Kitchen",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=100&h=100&fit=crop",
  },
  {
    id: "Gaming",
    name: "Gaming",
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=100&h=100&fit=crop",
  },
  {
    id: "Fashion",
    name: "Fashion",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&h=100&fit=crop",
  },
  {
    id: "Smart Home",
    name: "Smart Home",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop",
  },
  {
    id: "Office Supplies",
    name: "Office Supplies",
    image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=100&h=100&fit=crop",
  },
  {
    id: "Photography",
    name: "Photography",
    image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=100&h=100&fit=crop",
  },
  {
    id: "Travel",
    name: "Travel",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100&h=100&fit=crop",
  },
  {
    id: "Pet Supplies",
    name: "Pet Supplies",
    image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=100&h=100&fit=crop",
  },
  {
    id: "Personal Care",
    name: "Personal Care",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=100&h=100&fit=crop",
  },
  {
    id: "Automotive",
    name: "Automotive",
    image: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=100&h=100&fit=crop",
  },
  {
    id: "Garden",
    name: "Garden",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=100&h=100&fit=crop",
  },
  {
    id: "Accessories",
    name: "Accessories",
    image: "https://images.unsplash.com/photo-1511707171634-5150e10a11d4?w=100&h=100&fit=crop",
  },
  {
    id: "Lifestyle",
    name: "Lifestyle",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=100&h=100&fit=crop",
  },
  {
    id: "Home & Kitchen",
    name: "Home & Kitchen",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e4?w=100&h=100&fit=crop",
  }
]

interface CategoryFilterProps {
  selectedCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  // Limit to top categories that fit in 2 lines (approximately 10-12 items)
  const displayedCategories = categories.slice(0, 12)
  
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2.5 max-h-[5.5rem] overflow-hidden">
        {displayedCategories.map((category) => {
          const isSelected = selectedCategory === category.id
          
          return (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex items-center gap-2.5 h-9 px-3.5 rounded-md text-sm font-medium transition-colors cursor-pointer",
                "border border-border bg-background",
                "hover:bg-accent hover:text-accent-foreground hover:border-accent-foreground/20",
                isSelected
                  ? "bg-accent text-accent-foreground font-medium border-primary"
                  : "text-muted-foreground"
              )}
            >
              {/* Small Thumbnail - 10% larger */}
              <div className="relative w-6 h-6 rounded overflow-hidden flex-shrink-0">
                {category.id === "all" ? (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-3.5 h-3.5 text-muted-foreground"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </div>
                ) : (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                    sizes="24px"
                  />
                )}
              </div>
              
              {/* Text */}
              <span className="whitespace-nowrap truncate">{category.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}


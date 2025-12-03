"use client"

import { useState } from "react"
import Image from "next/image"
import { Card } from "@/components/ui/card"

interface ProductImageGalleryProps {
  images: string[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <Card className="overflow-hidden p-0">
        <div className="relative aspect-square w-full bg-muted">
          <Image
            src={images[selectedImage] || images[0]}
            alt="Product"
            fill
            className="object-cover"
          />
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent hover:border-muted-foreground/50"
              }`}
            >
              <Image
                src={image}
                alt={`Product view ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


















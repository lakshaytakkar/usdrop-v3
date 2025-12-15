"use client"

import Image from "next/image"

const testimonials = [
  {
    text: "USDrop has completely transformed my dropshipping business. I found my first winning product within 24 hours and made $10K in the first month.",
    author: "Scott Boxer",
    role: "E-commerce Founder",
    avatar: "/images/review-author-1.jpg",
    metric: "$10K first month",
  },
  {
    text: "The AI Studio alone is worth the subscription. I can generate product images in minutes that used to take days and cost hundreds of dollars.",
    author: "Joel Peterson",
    role: "Dropshipping Expert",
    avatar: "/images/review-author-2.jpg",
    metric: "3x faster launches",
  },
  {
    text: "Finally, a platform that brings everything together. Product research, supplier connections, and store management all in one place. Game changer.",
    author: "Jennifer Harper",
    role: "Store Owner",
    avatar: "/images/review-author-5.jpg",
    metric: "100% automation",
  },
]

export function Testimonials() {
  return (
    <section className="w-full py-20 border-b border-gray-200 relative" style={{ backgroundColor: '#FAFAF9' }}>
      <div className="max-w-[1200px] mx-auto px-16 relative">
        {/* Left border */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200"></div>
        {/* Right border */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gray-200"></div>
        
        {/* Section Header */}
        <div className="mb-12 border-t border-gray-200 pt-12">
          <div className="mb-4 text-xs font-medium text-gray-500 uppercase tracking-[0.1em]" style={{ fontFamily: 'var(--font-geist-mono), monospace' }}>
            TESTIMONIALS
          </div>
          <h2 className="mb-3 text-4xl font-normal text-black leading-[1.1] tracking-tight" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
            Trusted by thousands of entrepreneurs
          </h2>
          <p className="text-base text-gray-600 leading-relaxed max-w-2xl" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
            See how USDrop is helping businesses scale their dropshipping operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 p-6 flex flex-col hover:border-gray-300 hover:shadow-sm transition-all"
            >
              {/* Quote Text */}
              <p className="mb-6 text-base text-gray-700 leading-relaxed flex-grow" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                "{testimonial.text}"
              </p>

              {/* Author Info */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  {testimonial.avatar ? (
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.author}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-gray-600 font-medium text-sm">
                      {testimonial.author.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    {testimonial.author}
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}>
                    {testimonial.role}
                  </div>
                </div>
              </div>

              {/* Metric */}
              {testimonial.metric && (
                <div className="pt-4 border-t border-gray-100">
                  <div className="text-lg font-normal text-gray-900" style={{ fontFamily: 'CooperLtBt, Georgia, serif' }}>
                    {testimonial.metric}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


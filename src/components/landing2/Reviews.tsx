"use client"

import { Quote } from 'lucide-react';
import Image from 'next/image';

const testimonials = [
  {
    title: "This is crazy...",
    text: "USDrop has completely transformed my dropshipping business. I found my first winning product within 24 hours and made $10K in the first month.",
    author: "Scott Boxer",
    role: "@scott_boxer",
    avatar: "/images/review-author-1.jpg",
  },
  {
    title: "Great Flexibility!",
    text: "The AI Studio alone is worth the subscription. I can generate product images in minutes that used to take days and cost hundreds of dollars.",
    author: "Joel Peterson",
    role: "Internet Surfer",
    avatar: "/images/review-author-2.jpg",
  },
  {
    title: "Simple and Useful!",
    text: "Finally, a platform that brings everything together. Product research, supplier connections, and store management all in one place. Game changer.",
    author: "Jennifer Harper",
    role: "App Developer",
    avatar: "/images/review-author-5.jpg",
  },
  {
    title: "Minimalistic & Beautiful!",
    text: "The interface is clean and intuitive. I was up and running in minutes. The profit calculator helped me identify the best products to sell.",
    author: "Evelyn Martinez",
    role: "WordPress Consultant",
    avatar: "/images/review-author-8.jpg",
  },
];

export const Reviews: React.FC = () => {
  return (
    <section id="reviews-2" className="py-24 reviews-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Loved by thousands of creators and brands
          </h2>
          <p className="text-xl text-muted-foreground">
            See what our users are saying about USDrop.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-muted rounded-xl p-8 shadow-lg relative"
            >
              {/* Quote Icon */}
              <div className="w-16 h-16 text-primary/20 mb-6">
                <Quote className="w-full h-full" />
              </div>

              {/* Text */}
              <div className="mb-6">
                <h6 className="text-lg font-bold text-foreground mb-3">
                  {testimonial.title}
                </h6>
                <p className="text-muted-foreground leading-relaxed">
                  {testimonial.text}
                </p>
              </div>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-primary font-bold text-lg">
                    {testimonial.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <h6 className="text-base font-bold text-foreground">
                    {testimonial.author}
                  </h6>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};



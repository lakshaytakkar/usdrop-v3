"use client"

import Image from 'next/image';
import { Eye } from 'lucide-react';

const projects = [
  {
    title: "Product Discovery Dashboard",
    image: "/landing/dashboard-preview.png",
    description: "Real-time product intelligence and market analysis",
  },
  {
    title: "AI Studio Interface",
    image: "/landing/ai-studio-model.png",
    description: "Generate stunning product images and ad creatives",
  },
  {
    title: "Supplier Network",
    image: "/landing/product-discovery-banner.png",
    description: "Connect with verified suppliers worldwide",
  },
  {
    title: "Store Analytics",
    image: "/landing/dashboard-preview.png",
    description: "Track performance and optimize your store",
  },
];

export const Projects: React.FC = () => {
  return (
    <section id="projects-1" className="py-24 projects-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Great Design That Works!
          </h2>
          <p className="text-xl text-muted-foreground">
            See how our platform helps you build and scale your business.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="group">
              {/* Title */}
              <h5 className="text-xl font-bold text-foreground mb-4">
                {project.title}
              </h5>

              {/* Image */}
              <div className="relative rounded-xl overflow-hidden shadow-lg group-hover:shadow-xl transition-shadow">
                <div className="aspect-video relative">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  
                  {/* Project Link */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center">
                      <Eye className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};












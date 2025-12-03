import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';

const articles = [
  {
    title: "7 Best TikTok Agency Ad Account Providers in 2025",
    date: "October 1, 2025",
    readTime: "9 min read time",
    author: "Adeel Q",
    prompt: "tiktok logo on a smartphone screen in a modern office setting, depth of field"
  },
  {
    title: "8 High-Margin Products for Dropshipping",
    date: "June 28, 2025",
    readTime: "18 min read time",
    author: "Aaron M",
    prompt: "flat lay of expensive looking consumer electronics and accessories, clean background"
  },
  {
    title: "9 Best Dropshipping Niches for 2025",
    date: "June 28, 2025",
    readTime: "24 min read time",
    author: "Rebecca G",
    prompt: "concept art of ecommerce strategy, growing charts, coins, blue theme"
  }
];

export const Blog: React.FC = () => {
  return (
    <Section className="bg-white pt-0 pb-16">
      <Container>
        <div className="flex justify-between items-end mb-10">
           <h2 className="text-3xl font-bold text-slate-900">Browse our latest articles</h2>
           <Button variant="outline" size="sm" className="rounded-lg">View Blog</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {articles.map((article, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-slate-100 mb-4 border border-slate-200">
                 <GeneratedImage 
                   prompt={article.prompt} 
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                 />
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
                 <span>{article.date}</span>
                 <span>•</span>
                 <span>{article.readTime}</span>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                 {article.title}
              </h3>
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 rounded-full bg-slate-200 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?u=${idx}`} alt={article.author} className="w-full h-full" />
                 </div>
                 <span className="text-sm font-semibold text-slate-700">{article.author}</span>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};


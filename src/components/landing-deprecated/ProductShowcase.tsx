import React from 'react';
import { Container, Section, Button, Badge } from './ui';
import { Product } from '@/types/landing';
import { TrendingUp, ArrowRight } from 'lucide-react';
import Image from 'next/image';

const products: Product[] = [
  {
    id: "1",
    name: "Smart Nursery Monitor Pro",
    margin: "65.0%",
    revenue: "$315K",
    growth: "250%",
    itemsSold: "43,000",
    image: "/images/landing/product-nursery-monitor.png"
  },
  {
    id: "2",
    name: "K-Beauty 10-Step Glow Kit",
    margin: "70.0%",
    revenue: "$298K",
    growth: "186%",
    itemsSold: "39,600",
    image: "/images/landing/product-kbeauty.png"
  },
  {
    id: "3",
    name: "Pro-ANC Studio Headphones",
    margin: "55.5%",
    revenue: "$485K",
    growth: "101%",
    itemsSold: "59,790",
    image: "/images/landing/product-headphones.png"
  },
  {
    id: "4",
    name: "Floral Summer Maxi Collection",
    margin: "48.0%",
    revenue: "$142K",
    growth: "320%",
    itemsSold: "28,560",
    image: "/images/landing/product-maxi-dress.png"
  }
];

export const ProductShowcase: React.FC = () => {
  return (
    <Section id="product-discovery" className="bg-slate-50 border-b border-slate-200">
      <Container>
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900">
              Real Winning Products. <br/>
              <span className="text-blue-600">Proven USA Data.</span>
            </h2>
            <p className="text-slate-600 text-xl">
              We analyze 50M+ products daily to find the hidden gems with high margins and low competition in the USA.
            </p>
          </div>
          <Button variant="outline" className="bg-white hover:bg-slate-50 h-14 px-8 font-bold border-slate-300">View Top 100 Winners</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:border-blue-300 transition-colors group">
              {/* Generated Product Image */}
              <div className="aspect-[4/5] w-full relative bg-slate-100">  
                {product.image && (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <Badge className="bg-amber-400 text-amber-950 border-amber-500/20 font-bold shadow-sm flex items-center gap-1">
                     <TrendingUp className="w-3 h-3" /> Trending
                  </Badge>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-5">
                <h3 className="text-lg font-bold text-slate-900 line-clamp-1" title={product.name}>{product.name}</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">
                    <div className="text-emerald-700 text-[10px] uppercase font-bold tracking-wider mb-1">Profit Margin</div>
                    <div className="text-emerald-700 font-bold text-xl">{product.margin}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100">
                    <div className="text-blue-700 text-[10px] uppercase font-bold tracking-wider mb-1">Total Sales</div>
                    <div className="text-blue-700 font-bold text-xl">{product.revenue}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-100">
                   <div className="flex items-center gap-1 text-slate-900 font-bold">
                       USA Supplier
                   </div>
                   <div className="text-slate-500 font-medium">{product.itemsSold} Sold</div>
                </div>

                <Button fullWidth variant="primary" className="h-12 font-bold shadow-lg shadow-blue-500/10 group-hover:bg-blue-700">
                  Import to Store <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-20 bg-slate-900 rounded-[2rem] p-8 md:p-12 text-center relative overflow-hidden">
           <div className="relative z-10">
              <h3 className="text-3xl font-bold text-white mb-4">Ready to find your first winner?</h3>
              <p className="text-slate-400 mb-8 max-w-xl mx-auto">Get instant access to our daily winning product drops. No inventory required.</p>
              <Button size="lg" className="px-12 h-16 text-lg rounded-full font-bold shadow-white/10 bg-white text-slate-900 hover:bg-slate-100">Get Free Access</Button>
           </div>
           {/* Abstract bg */}
           <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-slate-900" />
        </div>
      </Container>
    </Section>
  );
};

import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';

export const DeepDiveFeatures: React.FC = () => {
  return (
    <div className="bg-white space-y-24 py-24">
      
      {/* Feature 1: Store Explorer */}
      <Section className="py-0">
        <Container>
           <div className="text-center mb-16">
              <div className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3">Next-Gen Product Research</div>
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900">Discover how USDrop empowers sellers</h2>
           </div>

           <div className="bg-slate-50 border border-slate-200 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center overflow-hidden">
              <div className="w-full lg:w-1/2 space-y-6">
                 <h3 className="text-3xl font-bold text-slate-900">Store Explorer: More than just a sales tracker</h3>
                 <p className="text-lg text-slate-600 leading-relaxed">
                    Browse millions of live Shopify stores, check their traffic and sales, discover which of their products make up most of their revenue, where their customers come from, and much more.
                 </p>
                 <Button variant="outline" className="bg-white border-slate-300 h-12 px-8 font-semibold">Explore winning stores</Button>
              </div>
              <div className="w-full lg:w-1/2 relative">
                 <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                    <div className="aspect-[16/10] bg-slate-50 rounded-xl overflow-hidden relative">
                       <GeneratedImage 
                          prompt="comprehensive store analytics dashboard, list of competitor stores with revenue graphs, traffic sources pie charts, clean saas ui, blue and grey theme"
                          className="w-full h-full object-cover"
                       />
                    </div>
                 </div>
              </div>
           </div>
        </Container>
      </Section>

      {/* Feature 2: Global Bestsellers */}
      <Section className="py-0">
        <Container>
           <div className="bg-slate-900 text-white rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row-reverse gap-16 items-center overflow-hidden relative">
              {/* Abstract bg */}
              <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent pointer-events-none" />

              <div className="w-full lg:w-1/2 space-y-6 relative z-10">
                 <h3 className="text-3xl font-bold text-white">Global Bestsellers: See what the world is buying</h3>
                 <p className="text-lg text-slate-300 leading-relaxed">
                    Spotting trends is one thing. Seeing which products drive the most revenue across every Shopify store worldwide? That's what makes USDrop a complete game changer.
                 </p>
                 <Button variant="primary" className="bg-blue-600 border-none text-white h-12 px-8 font-semibold hover:bg-blue-500">Find winning products</Button>
              </div>
              
              <div className="w-full lg:w-1/2 relative z-10">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-4 shadow-lg transform translate-y-8">
                       <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
                          <GeneratedImage prompt="product photography of galaxy projector night light, dark room, stars projection" className="w-full h-full object-cover" />
                       </div>
                       <div className="h-2 w-2/3 bg-slate-200 rounded mb-2"></div>
                       <div className="h-2 w-1/2 bg-green-100 rounded"></div>
                    </div>
                    <div className="bg-white rounded-2xl p-4 shadow-lg">
                       <div className="aspect-square bg-slate-100 rounded-lg mb-3 overflow-hidden">
                          <GeneratedImage prompt="product photography of shiba inu plush toy, soft lighting, white background" className="w-full h-full object-cover" />
                       </div>
                       <div className="h-2 w-2/3 bg-slate-200 rounded mb-2"></div>
                       <div className="h-2 w-1/2 bg-blue-100 rounded"></div>
                    </div>
                 </div>
              </div>
           </div>
        </Container>
      </Section>

    </div>
  );
};
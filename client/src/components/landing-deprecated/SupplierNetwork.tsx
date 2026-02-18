import React from 'react';
import { Container, Section, Button } from './ui';
import { Plane, Package, Globe2, ShieldCheck, MapPin } from 'lucide-react';


export const SupplierNetwork: React.FC = () => {
  return (
    <Section className="bg-white border-t border-slate-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Text Content */}
          <div className="order-2 lg:order-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-100 text-green-700 text-xs font-bold uppercase tracking-wide">
               <MapPin className="w-3 h-3" />
               Warehouses in Los Angeles, NY, & Texas
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Ship from the USA. <br/>
              <span className="text-blue-600">Delivered in 2-5 Days.</span>
            </h2>
            
            <p className="text-slate-600 text-lg leading-relaxed">
              Your customers hate waiting. Stop losing sales to AliExpress shipping times. We stock winning products in our US warehouses so you can offer Amazon-level speed to your customers.
            </p>

            <div className="space-y-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 border border-blue-100">
                  <Plane className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Fast US Shipping (2-5 Days)</h4>
                  <p className="text-slate-500">Direct integration with USPS, UPS, and FedEx. Tracking numbers generated instantly.</p>
                </div>
              </div>
              
              <div className="w-full h-px bg-slate-100" />
              
              <div className="flex gap-4 items-start">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100">
                  <Package className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-lg mb-1">Automated Fulfillment</h4>
                  <p className="text-slate-500">Orders from your store are processed, packed, and shipped automatically. You don't lift a finger.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <Button size="lg" className="h-14 px-8 font-bold text-lg">View US Products</Button>
               <Button variant="outline" size="lg" className="h-14 px-8 font-bold text-lg">Check Shipping Rates</Button>
            </div>
          </div>

          {/* Visual Content */}
          <div className="order-1 lg:order-2 relative h-[600px] rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl group">
             <img 
               src="/images/landing/supplier-fulfillment.png"
               alt="USDrop Logistics Network"
              
               className="object-cover"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent pointer-events-none" />
             
             {/* Floating Stats */}
             <div className="absolute bottom-8 left-8 right-8 grid grid-cols-2 gap-4">
                <div className="bg-white/95 backdrop-blur p-5 rounded-2xl shadow-lg border border-slate-100">
                   <div className="text-3xl font-bold text-slate-900 mb-1">2.1M+</div>
                   <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Packages Shipped</div>
                </div>
                <div className="bg-blue-600/95 backdrop-blur p-5 rounded-2xl shadow-lg border border-blue-500">
                   <div className="text-3xl font-bold text-white mb-1">99.8%</div>
                   <div className="text-xs text-blue-100 font-bold uppercase tracking-wider">On-Time Delivery</div>
                </div>
             </div>
          </div>

        </div>
      </Container>
    </Section>
  );
};

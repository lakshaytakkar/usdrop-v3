"use client"

import React, { useState } from 'react';
import { Container, Section, Button, Badge } from './ui';
import Link from 'next/link';
import { Check, X } from 'lucide-react';

const plans = [
  {
    name: "Starter",
    description: "For new dropshippers testing products.",
    monthlyPrice: 29,
    yearlyPrice: 24,
    features: [
      "50 Winning Product Lookups / mo",
      "500 AI Image Generations",
      "Basic Profit Calculator",
      "Supplier Network Access",
      "Email Support"
    ],
    notIncluded: [
      "Store Spy Tool",
      "Automated Fulfillment",
      "Dedicated Success Manager"
    ],
    popular: false
  },
  {
    name: "Growth",
    description: "For scaling brands needing automation.",
    monthlyPrice: 79,
    yearlyPrice: 65,
    features: [
      "Unlimited Product Lookups",
      "Unlimited AI Generations",
      "Competitor Store Spy Tool",
      "Automated Fulfillment",
      "Priority Live Chat Support",
      "US Shipping Rates"
    ],
    notIncluded: [
      "Dedicated Success Manager"
    ],
    popular: true
  },
  {
    name: "Empire",
    description: "For high-volume 7-figure sellers.",
    monthlyPrice: 299,
    yearlyPrice: 249,
    features: [
      "Everything in Growth",
      "Dedicated Success Manager",
      "Private Agent Sourcing",
      "Custom Packaging & Branding",
      "Bulk Order Discounts",
      "API Access"
    ],
    notIncluded: [],
    popular: false
  }
];

export const Pricing: React.FC = () => {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <Section id="pricing" className="border-y border-slate-100">
      <Container>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge className="mb-4 bg-blue-50 text-blue-600 border-blue-100 px-4 py-1.5 text-sm">Transparent Pricing</Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6">Invest in Your Freedom</h2>
          <p className="text-slate-600 text-xl">
             Stop paying for 5 different tools. Get everything you need to build a dropshipping empire in one subscription.
          </p>
          
          <div className="flex items-center justify-center gap-4 mt-8">
            <span className={`text-sm font-bold ${!isYearly ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 bg-slate-200 rounded-full p-1 transition-colors relative"
            >
              <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isYearly ? 'translate-x-8' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-bold ${isYearly ? 'text-slate-900' : 'text-slate-500'}`}>
              Yearly <span className="text-emerald-500 text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
           {plans.map((plan, idx) => (
             <div 
               key={idx} 
               className={`relative p-8 rounded-[2rem] transition-all duration-300 ${
                 plan.popular 
                   ? 'bg-slate-900 text-white shadow-2xl scale-105 border-2 border-blue-500 z-10' 
                   : 'bg-white border border-slate-200 hover:border-blue-200 hover:shadow-xl text-slate-900'
               }`}
             >
               {plan.popular && (
                 <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-lg">
                   Most Popular
                 </div>
               )}

               <div className="mb-8">
                 <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                 <p className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                 <div className="mt-6 flex items-baseline gap-1">
                   <span className="text-4xl font-bold">${isYearly ? plan.yearlyPrice : plan.monthlyPrice}</span>
                   <span className={`text-sm ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>/mo</span>
                 </div>
                 {isYearly && <div className="text-xs text-emerald-500 font-bold mt-1">Billed ${plan.yearlyPrice * 12} yearly</div>}
               </div>

               <Link href="/login" className="w-full block mb-8">
                 <Button 
                   fullWidth 
                   variant={plan.popular ? 'primary' : 'outline'} 
                   className={`font-bold h-12 ${!plan.popular && 'border-slate-300'}`}
                 >
                   Start Free 7-Day Trial
                 </Button>
               </Link>

               <div className="space-y-4">
                 {plan.features.map((feature, i) => (
                   <div key={i} className="flex items-start gap-3 text-sm font-medium">
                     <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}`}>
                       <Check className="w-2.5 h-2.5" strokeWidth={3} />
                     </div>
                     <span className={plan.popular ? 'text-slate-200' : 'text-slate-700'}>{feature}</span>
                   </div>
                 ))}
                 {plan.notIncluded.map((feature, i) => (
                   <div key={i} className="flex items-start gap-3 text-sm font-medium opacity-50">
                     <div className={`mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'}`}>
                       <X className="w-2.5 h-2.5" strokeWidth={3} />
                     </div>
                     <span className={plan.popular ? 'text-slate-500' : 'text-slate-400'}>{feature}</span>
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
      </Container>
    </Section>
  );
};


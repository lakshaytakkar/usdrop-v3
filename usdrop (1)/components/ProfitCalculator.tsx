import React, { useState } from 'react';
import { Container, Section, Button } from './ui';
import { DollarSign, TrendingUp, Calculator } from 'lucide-react';

export const ProfitCalculator: React.FC = () => {
  const [sellingPrice, setSellingPrice] = useState(59.99);
  const [productCost, setProductCost] = useState(12.50);
  const [shippingCost, setShippingCost] = useState(5.00);
  const [adCost, setAdCost] = useState(15.00);
  
  // Metrics
  const totalCost = productCost + shippingCost + adCost;
  const profit = sellingPrice - totalCost;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  return (
    <Section className="bg-white border-y border-slate-100" id="calculator">
      <Container>
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left: Content & Inputs */}
            <div className="lg:col-span-7 space-y-8">
               <div className="max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Calculate Your Potential.</h2>
                  <p className="text-slate-600 text-lg">
                     Stop guessing. Use our real-time calculator to see how much profit you can make per sale with USDrop products.
                  </p>
               </div>

               <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Selling Price</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                           <input 
                              type="number" 
                              value={sellingPrice}
                              onChange={(e) => setSellingPrice(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-900 outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Product Cost</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                           <input 
                              type="number" 
                              value={productCost}
                              onChange={(e) => setProductCost(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-900 outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Shipping Cost</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                           <input 
                              type="number" 
                              value={shippingCost}
                              onChange={(e) => setShippingCost(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-900 outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Ad Cost (CPA)</label>
                        <div className="relative group">
                           <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                           <input 
                              type="number" 
                              value={adCost}
                              onChange={(e) => setAdCost(Number(e.target.value))}
                              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent font-bold text-slate-900 outline-none transition-all"
                           />
                        </div>
                     </div>
                  </div>
                  
                  {/* Visual Bar */}
                  <div className="mt-8 pt-8 border-t border-slate-200/60">
                     <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">
                        <span>Cost Breakdown</span>
                        <span>Revenue: ${sellingPrice.toFixed(2)}</span>
                     </div>
                     <div className="flex h-6 w-full rounded-full overflow-hidden shadow-inner bg-slate-100">
                        <div style={{ width: `${Math.min(100, (productCost/sellingPrice)*100)}%` }} className="bg-blue-400 transition-all duration-500" title="Product Cost" />
                        <div style={{ width: `${Math.min(100, (shippingCost/sellingPrice)*100)}%` }} className="bg-indigo-400 transition-all duration-500" title="Shipping Cost" />
                        <div style={{ width: `${Math.min(100, (adCost/sellingPrice)*100)}%` }} className="bg-purple-400 transition-all duration-500" title="Ad Cost" />
                        <div style={{ width: `${Math.max(0, (profit/sellingPrice)*100)}%` }} className={`${profit > 0 ? 'bg-emerald-500' : 'bg-red-500'} transition-all duration-500`} title="Profit" />
                     </div>
                     <div className="flex gap-4 mt-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-blue-400"/> Product</div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-indigo-400"/> Shipping</div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-600"><div className="w-2 h-2 rounded-full bg-purple-400"/> Ads</div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"/> Profit</div>
                     </div>
                  </div>
               </div>
            </div>

            {/* Right: Results Card */}
            <div className="lg:col-span-5">
                <div className="bg-slate-900 rounded-[2.5rem] p-8 md:p-10 text-white relative overflow-hidden shadow-2xl shadow-blue-900/20 group hover:-translate-y-1 transition-transform duration-500">
                   {/* Background Decor */}
                   <div className="absolute top-0 right-0 p-12 opacity-5 transform rotate-12 scale-150">
                      <Calculator className="w-64 h-64" />
                   </div>
                   <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
                   
                   <div className="relative z-10">
                      <div className="flex items-start justify-between mb-10">
                         <div>
                            <h3 className="text-3xl font-bold font-display text-white mb-2">Results</h3>
                            <p className="text-slate-400 text-sm">Based on your inputs</p>
                         </div>
                         <div className={`p-3 rounded-2xl ${profit > 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                            <TrendingUp className="w-6 h-6" />
                         </div>
                      </div>

                      <div className="space-y-8">
                         <div>
                            <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">Net Profit / Sale</div>
                            <div className={`text-6xl font-bold font-display tracking-tight ${profit > 0 ? 'text-white' : 'text-red-400'}`}>
                               ${profit.toFixed(2)}
                            </div>
                         </div>
                         
                         <div className="grid grid-cols-2 gap-4 py-6 border-t border-white/10 border-b">
                            <div>
                               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Margin</div>
                               <div className={`text-2xl font-bold ${margin >= 30 ? 'text-emerald-400' : 'text-white'}`}>{margin.toFixed(1)}%</div>
                            </div>
                            <div>
                               <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">ROI</div>
                               <div className={`text-2xl font-bold ${roi >= 100 ? 'text-emerald-400' : 'text-white'}`}>{roi.toFixed(1)}%</div>
                            </div>
                         </div>

                         <div className="pt-2">
                            <Button fullWidth size="lg" className="h-14 bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] font-bold border-none shadow-xl transition-all">
                               Start Selling Now
                            </Button>
                            <p className="text-center text-slate-500 text-xs mt-4">
                               Calculations are estimates. Actual results may vary.
                            </p>
                         </div>
                      </div>
                   </div>
                </div>
            </div>

         </div>
      </Container>
    </Section>
  );
};
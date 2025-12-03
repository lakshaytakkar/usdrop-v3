import React from 'react';
import { Container, Section, Button, GeneratedImage } from './ui';

const tools = [
  {
    title: "Competitor Research: Find stores selling your products",
    description: "Find out who's selling the products you're interested in, how much they sell, where their traffic comes from, and learn their strategies.",
    cta: "Find viral products",
    prompt: "data list of competitor ecommerce stores, showing traffic stats, social links, and top selling items, clean interface"
  },
  {
    title: "Saturation Indicator: Spot trending dropshipping products",
    description: "Identify the perfect balance between trending products and competition. Helps you discover profitable opportunities before markets become overcrowded.",
    cta: "Spot trending products",
    prompt: "gauge chart showing market saturation level, green to red gradient, analytics visualization"
  },
  {
    title: "Market Finder: See global demand for your products",
    description: "Target the right markets by tracking regional product interest. See which countries have the highest demand for your products.",
    cta: "Find products with demand",
    prompt: "world map heatmap showing sales density in different countries, data overlay, clean ui"
  },
  {
    title: "Seasonal Trend Tracker: A must-have research tool",
    description: "Discover what sells in every season. Track seasonal trends and peak buying periods to time your product launches perfectly.",
    cta: "Identify product trends",
    prompt: "line chart showing seasonal sales spikes over a year timeline, trend analysis graph"
  },
  {
    title: "Profit Calculator: Forecast your dropshipping profits",
    description: "Identify winning products by calculating real profit potential. Test prices, costs, and margins instantly to find the most profitable opportunities.",
    cta: "Calculate your profit",
    prompt: "calculator interface with input fields for product cost, shipping, ad spend, and profit breakdown chart"
  },
  {
    title: "Emerging Store Discovery: Find fast-growing new stores",
    description: "There are many successful dropshipping stores, but new ones that make hundreds of thousands of USD the first month are rare.",
    cta: "Find emerging stores",
    prompt: "grid of new shopify store logos and growth percentages, trending upward icons"
  }
];

export const AdvancedToolsGrid: React.FC = () => {
  return (
    <Section className="bg-slate-50 border-t border-slate-200">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900">Advanced Research Suite</h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">Deep dive into data with our specialized tools designed for professional dropshippers.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, idx) => (
            <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="mb-6">
                 <h3 className="text-xl font-bold text-slate-900 mb-4 min-h-[56px]">{tool.title}</h3>
                 <p className="text-slate-500 text-sm leading-relaxed mb-6">
                    {tool.description}
                 </p>
                 <Button variant="outline" size="sm" className="rounded-lg text-xs font-bold border-slate-200">{tool.cta}</Button>
              </div>
              
              <div className="mt-auto aspect-[4/3] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shadow-inner">
                 <GeneratedImage 
                   prompt={tool.prompt} 
                   className="w-full h-full object-cover opacity-90"
                 />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
};
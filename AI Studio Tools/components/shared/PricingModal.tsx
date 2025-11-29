
import React from 'react';
import { X, DollarSign, Check } from 'lucide-react';

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PlanFeature: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <li className="flex items-start gap-3">
        <Check size={18} className="text-violet-400 flex-shrink-0 mt-1" />
        <span className="text-zinc-300">{children}</span>
    </li>
);

export const PricingModal: React.FC<PricingModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-slide-up duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-zinc-925/70 backdrop-blur-2xl w-full max-w-5xl rounded-xl border border-white/10 shadow-glass shadow-black/40 text-zinc-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
                        <DollarSign size={22} className="text-violet-400" />
                        Choose Your Plan
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors" aria-label="Close pricing modal">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-8 space-y-8 max-h-[85vh] overflow-y-auto">
                    <div className="text-center">
                        <h3 className="text-3xl font-bold text-white">Find the perfect plan for your brand</h3>
                        <p className="mt-2 text-zinc-400 max-w-2xl mx-auto">From solo creators to established brands, our plans scale with your creative needs. All plans are flexible.</p>
                    </div>

                    {/* Plans Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        {/* Solo Creator Plan */}
                        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col h-full">
                            <h4 className="text-xl font-bold text-white">Solo Creator</h4>
                            <p className="mt-4 text-zinc-300"><span className="text-4xl font-bold text-white">$25</span> / month</p>
                            <p className="text-sm text-zinc-400 mt-2">For individuals and freelancers getting started.</p>
                             <ul className="space-y-4 mt-8 text-sm flex-grow">
                                <PlanFeature><strong>200</strong> image generations / month</PlanFeature>
                                <PlanFeature>Full Creative Controls</PlanFeature>
                                <PlanFeature>AI Art Director</PlanFeature>
                                <PlanFeature>Standard Support</PlanFeature>
                            </ul>
                            <button className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-zinc-700">Choose Plan</button>
                        </div>
                        
                        {/* Brand Plan (Highlighted) */}
                        <div className="relative bg-zinc-900 p-6 rounded-xl border-2 border-violet-500 flex flex-col shadow-glow-lg h-full -mt-0 md:-mt-3">
                             <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                                <span className="bg-violet-600 text-white text-xs font-semibold px-4 py-1 rounded-full uppercase tracking-wider">Most Popular</span>
                            </div>
                            <h4 className="text-xl font-bold text-white">Brand</h4>
                            <p className="mt-4 text-zinc-300"><span className="text-4xl font-bold text-white">$129</span> / month</p>
                            <p className="text-sm text-zinc-400 mt-2">For established businesses scaling their content creation.</p>
                             <ul className="space-y-4 mt-8 text-sm flex-grow">
                                <PlanFeature><strong>2,500</strong> image generations / month</PlanFeature>
                                <PlanFeature>Batch Processing Mode</PlanFeature>
                                <PlanFeature>Priority Support</PlanFeature>
                                <PlanFeature>Everything in Studio</PlanFeature>
                            </ul>
                            <button className="w-full mt-8 bg-violet-600 hover:bg-violet-500 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors">Choose Plan</button>
                        </div>

                        {/* Studio Plan */}
                         <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex flex-col h-full">
                            <h4 className="text-xl font-bold text-white">Studio</h4>
                            <p className="mt-4 text-zinc-300"><span className="text-4xl font-bold text-white">$59</span> / month</p>
                            <p className="text-sm text-zinc-400 mt-2">For small brands and agencies with regular needs.</p>
                             <ul className="space-y-4 mt-8 text-sm flex-grow">
                                <PlanFeature><strong>600</strong> image generations / month</PlanFeature>
                                <PlanFeature>E-commerce Packshots</PlanFeature>
                                <PlanFeature>AI Post-Production Suite</PlanFeature>
                                <PlanFeature>Everything in Solo Creator</PlanFeature>
                            </ul>
                            <button className="w-full mt-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-semibold py-2.5 px-4 rounded-lg transition-colors border border-zinc-700">Choose Plan</button>
                        </div>
                    </div>
                    
                    {/* Cost Analysis Section */}
                    <div className="pt-8 text-center border-t border-zinc-800">
                        <h4 className="font-semibold text-lg text-white">Cost & Value Analysis</h4>
                        <p className="text-sm text-zinc-400 max-w-2xl mx-auto mt-2">
                           Our pricing provides significant value over direct API costs. A single, high-quality image generation costs approximately <strong className="text-violet-300 font-mono">$0.02</strong> in raw AI compute. Our plans offer bulk rates, premium features, and a streamlined workflow to maximize your return on investment.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

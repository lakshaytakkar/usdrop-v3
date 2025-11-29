import React from 'react';
import { Wand2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const EmptyState: React.FC = () => {
    const { studioMode } = useStudio();
    
    const message = studioMode === 'apparel'
  ? <>Your generated images will appear here. Begin by adding a model and apparel in the left panel. This app is managed by Sahil Sangani. To create your own personalised app like this, email me at <a href="mailto:sahil@gptwala.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Sahil@gptwala.com</a>.</>
  : studioMode === 'product'
  ? <>Your generated product photos will appear here. Begin by uploading a product in the left panel. This app is managed by Sahil Sangani. To create your own personalised app like this, email me at <a href="mailto:sahil@gptwala.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Sahil@gptwala.com</a>.</>
  : <>Your generated mockups will appear here. Begin by uploading a mockup and a design in the left panel. This app is managed by Sahil Sangani. To create your own personalised app like this, email me at <a href="mailto:sahil@gptwala.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:underline">Sahil@gptwala.com</a>.</>;

    const title = studioMode === 'apparel' 
        ? "Virtual Studio Canvas" 
        : studioMode === 'product'
        ? "Product Stage Canvas"
        : "Design Canvas";

    return (
        <div className="flex flex-col items-center justify-center text-center text-zinc-500 p-8 animate-fade-in">
            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-zinc-900/80 border border-white/10 mb-6 animate-float shadow-2xl shadow-black">
                <div className="absolute inset-0 rounded-full bg-aurora opacity-60 animate-pulse-slow"></div>
                <Wand2 size={48} className="text-violet-300" style={{ filter: 'drop-shadow(0 0 10px rgba(167, 139, 250, 0.6))' }} />
            </div>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">{title}</h3>
            <p className="text-md mt-2 max-w-sm text-zinc-400">{message}</p>
        </div>
    );
};

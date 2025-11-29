import React from 'react';
import { Sparkles } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const GenerationPlaceholder: React.FC<{ message: string; }> = ({ message }) => {
    const { cancelCurrentProcess } = useStudio();

    return (
        <div className="w-full h-full flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="relative overflow-hidden w-full h-full max-w-lg aspect-[3/4] rounded-lg bg-zinc-800 shimmer-bg flex items-center justify-center">
                 <Sparkles size={64} className="text-violet-400/50 animate-pulse-slow" style={{ animationDuration: '2s' }} />
            </div>
            <div className="mt-4 flex items-center gap-2">
                <Sparkles size={20} className="text-violet-400 animate-pulse" />
                <p className="font-semibold text-zinc-200">{message || 'Generating your vision...'}</p>
            </div>
            <p className="text-sm text-zinc-400 mt-1">The AI is creating your masterpiece. This can take a moment.</p>
            <button 
                onClick={cancelCurrentProcess}
                className="mt-6 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 border border-white/10"
            >
                Cancel Generation
            </button>
        </div>
    );
};
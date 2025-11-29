import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { COLOR_GRADING_PRESETS } from '../../constants';
import { Wand2, Film } from 'lucide-react';

export const PostProductionPanel: React.FC = () => {
    const { applyColorGrade, isApplyingPost, applyRealismBoost, applyFilmGrain } = useStudio();

    return (
        <div className="flex flex-col space-y-4">
             <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1">AI Enhancements</h3>
                <p className="text-xs text-zinc-400 mb-4">Refine your generated image with one click.</p>
            </div>
             <button
                onClick={applyRealismBoost}
                disabled={isApplyingPost}
                className="w-full bg-zinc-800 border border-white/10 hover:bg-zinc-700 text-white font-semibold py-2.5 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait shadow-inner-highlight"
            >
                <Wand2 size={16} />
                Realism Boost
            </button>


             <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1 mt-4">Color Grading</h3>
                <p className="text-xs text-zinc-400 mb-4">Apply a stylistic filter to your generated image.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {COLOR_GRADING_PRESETS.map(grade => (
                    <button
                        key={grade.id}
                        onClick={() => applyColorGrade(grade)}
                        disabled={isApplyingPost}
                        className="p-3 rounded-lg text-left transition-all duration-200 border bg-zinc-800 border-white/10 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-wait shadow-inner-highlight"
                    >
                        <h4 className="font-semibold text-zinc-100 text-sm">{grade.name}</h4>
                    </button>
                ))}
            </div>

            <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-1 mt-4 flex items-center gap-2"><Film size={16}/>Film & Texture</h3>
                <p className="text-xs text-zinc-400 mb-4">Add analog texture to your image.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => applyFilmGrain('Subtle')}
                    disabled={isApplyingPost}
                    className="p-3 rounded-lg text-left transition-all duration-200 border bg-zinc-800 border-white/10 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-wait shadow-inner-highlight"
                >
                    <h4 className="font-semibold text-zinc-100 text-sm">Subtle Film Grain</h4>
                </button>
                <button
                    onClick={() => applyFilmGrain('Medium')}
                    disabled={isApplyingPost}
                    className="p-3 rounded-lg text-left transition-all duration-200 border bg-zinc-800 border-white/10 hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-wait shadow-inner-highlight"
                >
                    <h4 className="font-semibold text-zinc-100 text-sm">Medium Film Grain</h4>
                </button>
            </div>
        </div>
    );
};
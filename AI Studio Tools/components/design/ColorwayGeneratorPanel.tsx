import React, { useState } from 'react';
import { Palette, Plus, Trash2, Loader2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';

export const ColorwayGeneratorPanel: React.FC = () => {
    const [colors, setColors] = useState<string[]>(['#FFFFFF', '#18181b', '#ef4444']);
    const [newColor, setNewColor] = useState<string>('#');
    const { generateColorways, isGenerating, mockupImage, designImage } = useStudio();
    const { incrementGenerationsUsed } = useAuth();

    const handleAddColor = () => {
        const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;
        if (hexColorRegex.test(newColor) && !colors.includes(newColor)) {
            setColors([...colors, newColor]);
            setNewColor('#');
        }
    };

    const handleRemoveColor = (colorToRemove: string) => {
        setColors(colors.filter(c => c !== colorToRemove));
    };

    const handleGenerate = () => {
        if (colors.length > 0) {
            generateColorways(colors, incrementGenerationsUsed);
        }
    };
    
    const canGenerate = !!mockupImage && !!designImage && colors.length > 0 && !isGenerating;

    return (
        <div className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-4">
            <div>
                <label className="font-semibold text-zinc-100 flex items-center gap-2">
                    <Palette size={18} /> Colorway Generator
                </label>
                <p className="text-xs text-zinc-400 mt-1 mb-3">
                    Generate mockups for multiple apparel colors at once. Add hex codes below.
                </p>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newColor}
                        onChange={(e) => setNewColor(e.target.value)}
                        placeholder="#FFFFFF"
                        className="flex-1 p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft font-mono"
                        maxLength={7}
                    />
                    <button
                        onClick={handleAddColor}
                        className="bg-zinc-700 hover:bg-zinc-600 text-white font-semibold px-4 rounded-lg transition-colors"
                        aria-label="Add color"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>

            {colors.length > 0 && (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {colors.map(color => (
                        <div key={color} className="flex items-center justify-between p-2 rounded-md bg-zinc-800">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-md border border-white/20" style={{ backgroundColor: color }} />
                                <span className="text-sm font-mono text-zinc-200">{color}</span>
                            </div>
                            <button onClick={() => handleRemoveColor(color)} className="p-1 text-zinc-400 hover:text-red-400 transition-colors" aria-label={`Remove ${color}`}>
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full bg-brand-primary disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-button-glow hover:shadow-button-glow-hover hover:bg-brand-primary-hover active:scale-[0.98]"
            >
                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Palette size={16} />}
                {isGenerating ? 'Generating...' : `Generate ${colors.length} Colorways`}
            </button>
        </div>
    );
};
import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { ASPECT_RATIOS_LIBRARY } from '../../constants';

export const AspectRatioSelector = () => {
    const { aspectRatio, selectAspectRatio, isSocialMediaPack } = useStudio();

    return (
         <div className="space-y-3">
            <label className={`text-sm font-medium ${isSocialMediaPack ? 'text-zinc-500' : 'text-zinc-300'}`}>Aspect Ratio</label>
            <div className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 border border-zinc-800 shadow-inner-soft">
                {ASPECT_RATIOS_LIBRARY.map(ar => (
                    <button
                        key={ar.id}
                        onClick={() => selectAspectRatio(ar)}
                        disabled={isSocialMediaPack}
                        className={`flex-1 flex items-center justify-center gap-1.5 p-1.5 text-sm font-medium rounded-full transition-colors h-9 ${
                            aspectRatio.id === ar.id ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                        } ${isSocialMediaPack ? 'cursor-not-allowed' : ''}`}
                        title={ar.name}
                    >
                        {ar.icon}
                        <span className="hidden sm:inline">{ar.name}</span>
                        <span className="sm:hidden">{ar.value}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};
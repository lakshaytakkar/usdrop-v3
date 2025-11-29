import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import type { AIModel } from '../../types';

interface ModelCardProps {
    model: AIModel;
    isSelected: boolean;
    onSelect: () => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({ model, isSelected, onSelect }) => {
    return (
        <div 
            onClick={onSelect}
            className={`relative group transition-all duration-300 ease-in-out aspect-[2/3] hover:-translate-y-1.5 rounded-[10px] overflow-hidden ${isSelected ? '' : 'cursor-pointer'}`}
        >
            <div className={`gradient-border-wrap w-full h-full ${isSelected ? 'active' : ''}`}>
                 <div className="gradient-border">
                    <img 
                        src={model.thumbnail} 
                        alt={model.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                 </div>
            </div>
            
            {isSelected && <div className="absolute inset-0 bg-black/40 transition-colors rounded-[10px] shadow-inner-soft" />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all rounded-[10px]" />
            
            {isSelected && (
                <div className="absolute top-3 right-3 text-white bg-violet-600 rounded-full shadow-lg animate-subtle-pop">
                    <CheckCircle2 size={24} strokeWidth={2.5} />
                </div>
            )}
            
            <div className="absolute top-3 left-3">
                <span className={`text-[11px] font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-white/10 shadow
                    ${model.gender === 'Female' ? 'bg-pink-500/50 text-pink-100' : 'bg-blue-500/50 text-blue-100'}`}
                >
                    {model.gender}
                </span>
            </div>

            <div className="absolute bottom-0 left-0 p-3 w-full translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-white text-lg truncate">{model.name}</h3>
                <p className="text-sm text-zinc-300 truncate">{model.country}</p>
            </div>
        </div>
    );
};
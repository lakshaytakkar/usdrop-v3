import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { MODELS_LIBRARY, MODEL_REGIONS } from '../../constants';
import { ModelCard } from './ModelCard';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { useAuth } from '../../context/AuthContext';
import { Lock } from 'lucide-react';

export const ModelLibrary: React.FC = () => {
    const { handleModelSelection, selectedModels, isBatchMode, setIsBatchMode } = useStudio();
    const { hasPermission } = useAuth();
    const [activeFilter, setActiveFilter] = useState('All');
    
    const canUseBatchMode = hasPermission('batchProcessing');

    const filteredModels = activeFilter === 'All'
        ? MODELS_LIBRARY
        : MODELS_LIBRARY.filter(model => model.region === activeFilter);

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4 space-y-4">
                 <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 model-filter-scrollbar">
                    {MODEL_REGIONS.map(region => (
                        <button
                            key={region}
                            onClick={() => setActiveFilter(region)}
                            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap border ${
                                activeFilter === region
                                ? 'bg-violet-600 text-white border-violet-500 shadow-md shadow-violet-900/50'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border-zinc-700 hover:border-zinc-600'
                            }`}
                        >
                            {region}
                        </button>
                    ))}
                </div>

                <div 
                    className="flex items-center justify-end gap-3 px-1"
                    title={!canUseBatchMode ? 'Available on the Brand plan' : ''}
                >
                    <label 
                        htmlFor="batch-mode-toggle" 
                        className={`text-sm font-medium text-zinc-300 flex items-center ${!canUseBatchMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        Batch Mode
                        {!canUseBatchMode && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                   <ToggleSwitch
                        id="batch-mode-toggle"
                        checked={canUseBatchMode ? isBatchMode : false}
                        onChange={canUseBatchMode ? setIsBatchMode : () => {}}
                   />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                    {filteredModels.map(model => (
                       <ModelCard 
                           key={model.id}
                           model={model}
                           isSelected={selectedModels.some(m => m.id === model.id)}
                           onSelect={() => handleModelSelection(model)}
                       />
                    ))}
                </div>
            </div>
        </div>
    );
}
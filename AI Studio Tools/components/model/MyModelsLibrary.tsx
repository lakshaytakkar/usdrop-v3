import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { ModelCard } from './ModelCard';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { useAuth } from '../../context/AuthContext';
import { Lock, Star } from 'lucide-react';

export const MyModelsLibrary: React.FC = () => {
    const { myModels, handleModelSelection, selectedModels, isBatchMode, setIsBatchMode } = useStudio();
    const { hasPermission } = useAuth();
    
    const canUseBatchMode = hasPermission('batchProcessing');

    if (myModels.length === 0) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center text-zinc-500 p-8 animate-fade-in">
                 <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                    <Star size={32} className="text-zinc-400" />
                </div>
                <h3 className="font-semibold text-zinc-300">Your Agency Roster is Empty</h3>
                <p className="text-sm mt-2 max-w-xs">Generate an image, then click "Save Model" on the toolbar to sign your first virtual talent to your private agency.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 mb-4 space-y-4">
                <div 
                    className="flex items-center justify-end gap-3 px-1"
                    title={!canUseBatchMode ? 'Available on the Brand plan' : ''}
                >
                    <label 
                        htmlFor="batch-mode-toggle-my-models" 
                        className={`text-sm font-medium text-zinc-300 flex items-center ${!canUseBatchMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        Batch Mode
                        {!canUseBatchMode && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                   <ToggleSwitch
                        id="batch-mode-toggle-my-models"
                        checked={canUseBatchMode ? isBatchMode : false}
                        onChange={canUseBatchMode ? setIsBatchMode : () => {}}
                   />
                </div>
            </div>

            <div className="flex-grow overflow-y-auto pr-2 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                    {myModels.map(model => (
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
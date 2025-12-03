import React, { useCallback } from 'react';
import { Layers, Sparkles, Wand2, Loader2, PlusCircle, Trash2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useDropzone } from 'react-dropzone';
import { InteractiveStagingCanvas } from './InteractiveStagingCanvas';
import type { StagedAsset, SceneSuggestion } from '../../types';

const CompanionAssetsManager: React.FC = () => {
    const { stagedAssets, addCompanionAsset, removeCompanionAsset } = useStudio();
    const companionAssets = stagedAssets.filter((a: StagedAsset) => a.id !== 'product');

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    addCompanionAsset(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [addCompanionAsset]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    });

    return (
        <div>
            <p className="text-sm font-medium text-zinc-300 mb-2">Companion Assets</p>
             <p className="text-xs text-zinc-500 mb-3">Add packaging or other products to stage them together. Drag them on the canvas above.</p>
            <div className="flex flex-wrap gap-2">
                {companionAssets.map((asset: StagedAsset) => (
                    <div key={asset.id} className="relative group w-20 h-20 flex-shrink-0">
                        <img src={asset.base64} alt={`Companion asset`} className="w-full h-full object-cover rounded-md border border-white/10" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center">
                            <button onClick={() => removeCompanionAsset(asset.id)} className="text-white hover:text-red-400 transition-colors p-1" aria-label={`Remove companion asset`}>
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </div>
                ))}
                <div {...getRootProps()} className={`w-20 h-20 flex-shrink-0 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-zinc-500 cursor-pointer transition-colors ${isDragActive ? 'border-violet-500 bg-violet-500/10 text-violet-400' : 'border-zinc-700 hover:border-zinc-600'}`}>
                    <input {...getInputProps()} />
                    <PlusCircle size={20} />
                    <span className="text-xs leading-tight mt-1 text-center">Add Asset</span>
                </div>
            </div>
        </div>
    );
};


export const PropsPanel: React.FC = () => {
    const { productControls, updateProductControl, fetchSceneSuggestions, isSuggestingScenes, sceneSuggestions, error, stagedAssets } = useStudio();
    
    const handleApplyScene = (sceneDescription: string) => {
        const currentProps = productControls.customProps.trim();
        const newProps = currentProps ? `${currentProps}\n${sceneDescription}` : sceneDescription;
        updateProductControl('customProps', newProps);
    };

    return (
        <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-1">
            {stagedAssets.length > 0 &&
                <div>
                     <label className="flex items-center gap-2 text-base font-semibold text-zinc-100 mb-2">
                        <Layers size={20} className="text-violet-400" />
                        Interactive Staging Canvas
                    </label>
                    <InteractiveStagingCanvas />
                </div>
            }

            <div className="border-t border-zinc-800 pt-6">
                <CompanionAssetsManager />
            </div>

            <div className="border-t border-zinc-800 pt-6">
                <label htmlFor="props-prompt" className="flex items-center gap-2 text-base font-semibold text-zinc-100">
                    <Sparkles size={20} className="text-violet-400" />
                    Describe Additional Props
                </label>
                <p className="text-xs text-zinc-400 mt-1 mb-3">
                    Describe any non-product objects you want to appear in the scene.
                </p>
                <textarea
                    id="props-prompt"
                    value={productControls.customProps}
                    onChange={(e) => updateProductControl('customProps', e.target.value)}
                    placeholder="e.g., a few fresh orange slices and a sprig of mint."
                    rows={3}
                    className="w-full p-3 rounded-lg bg-zinc-925 text-zinc-300 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors duration-200 text-sm shadow-inner-soft"
                    aria-label="Describe props and staging"
                />
            </div>

            <div className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-3">
                 <h3 className="font-semibold text-zinc-100 flex items-center gap-2">
                    <Wand2 size={18} /> AI Scene Stylist
                </h3>
                 <button 
                    onClick={fetchSceneSuggestions} 
                    disabled={isSuggestingScenes}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-semibold transition-colors duration-200 border bg-violet-600/80 hover:bg-violet-600 text-white border-transparent disabled:opacity-60 disabled:cursor-wait"
                >
                    {isSuggestingScenes ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                    {isSuggestingScenes ? 'Styling scenes...' : 'Suggest Scenes'}
                </button>
                 {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                 {sceneSuggestions.length > 0 && (
                     <div className="grid grid-cols-2 gap-3 pt-2">
                        {sceneSuggestions.map((suggestion: SceneSuggestion, index: number) => (
                           <div key={index} className="flex flex-col gap-2 p-2 bg-zinc-900 rounded-lg border border-white/5">
                                <div className="aspect-square w-full rounded-md bg-zinc-800 relative overflow-hidden shimmer-bg">
                                   {suggestion.previewImageB64 && (
                                       <img src={suggestion.previewImageB64} alt={suggestion.conceptName} className="absolute inset-0 w-full h-full object-cover animate-fade-in" />
                                   )}
                                </div>
                                <h4 className="text-xs font-bold text-zinc-200 text-center">{suggestion.conceptName}</h4>
                                <button
                                    onClick={() => handleApplyScene(suggestion.sceneDescription)}
                                    className="w-full text-center py-1.5 px-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-md transition-colors"
                                >
                                    Apply Scene
                                </button>
                           </div>
                        ))}
                    </div>
                 )}
            </div>
        </div>
    );
};
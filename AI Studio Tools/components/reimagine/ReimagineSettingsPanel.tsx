import React from 'react';
import { Camera, X, Users, Image as ImageIcon, Type, Package } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { AspectRatioSelector } from '../shared/AspectRatioSelector';
import { OptionSelector } from '../shared/OptionSelector';
import { IMAGE_COUNT_OPTIONS } from '../../constants';
import { SettingSection } from '../settings/SettingSection';

interface ReimagineSettingsPanelProps {
    onClose: () => void;
}

export const ReimagineSettingsPanel: React.FC<ReimagineSettingsPanelProps> = ({ onClose }) => {
    const { 
        numberOfImages, 
        setNumberOfImages,
        reimagineControls,
        updateReimagineControl
    } = useStudio();
    
    const selectedImageCount = IMAGE_COUNT_OPTIONS.find(o => o.name === String(numberOfImages)) || IMAGE_COUNT_OPTIONS[0];

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-bold text-zinc-100">Re-imagine Settings</h2>
                <button onClick={onClose} className="p-1 -m-1 text-zinc-400 hover:text-white lg:hidden">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-grow min-h-0 overflow-y-auto p-4 space-y-2">
                <SettingSection id="reimagine-settings-prompts" title="Swap Controls" icon={<Users size={18} />} defaultOpen>
                    <div className="space-y-6 pt-4">
                        <div>
                            <label htmlFor="new-model-prompt" className="text-sm font-semibold text-zinc-300">New Model Description</label>
                            <p className="text-xs text-zinc-400 mt-1 mb-2">Describe the new model to swap in. Leave blank to keep the original.</p>
                            <textarea
                                id="new-model-prompt"
                                value={reimagineControls.newModelDescription}
                                onChange={(e) => updateReimagineControl('newModelDescription', e.target.value)}
                                placeholder="e.g., A male model in his late 20s with short, dark hair and a beard"
                                rows={4}
                                className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-pose-prompt" className="text-sm font-semibold text-zinc-300">New Pose Description</label>
                            <p className="text-xs text-zinc-400 mt-1 mb-2">Describe a new pose for the model. Leave blank to keep the original pose.</p>
                            <textarea
                                id="new-pose-prompt"
                                value={reimagineControls.newPoseDescription}
                                onChange={(e) => updateReimagineControl('newPoseDescription', e.target.value)}
                                placeholder="e.g., Sitting on a chair, arms crossed, looking at camera"
                                rows={4}
                                className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-product-prompt" className="text-sm font-semibold text-zinc-300">New Product Description</label>
                            <p className="text-xs text-zinc-400 mt-1 mb-2">Describe a new product to swap in. Leave blank to keep the original.</p>
                            <textarea
                                id="new-product-prompt"
                                value={reimagineControls.newProductDescription}
                                onChange={(e) => updateReimagineControl('newProductDescription', e.target.value)}
                                placeholder="e.g., A can of bright red soda with a white logo"
                                rows={4}
                                className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                        </div>
                        <div>
                            <label htmlFor="new-bg-prompt" className="text-sm font-semibold text-zinc-300">New Background Description</label>
                            <p className="text-xs text-zinc-400 mt-1 mb-2">Describe the new background. Leave blank to keep the original.</p>
                            <textarea
                                id="new-bg-prompt"
                                value={reimagineControls.newBackgroundDescription}
                                onChange={(e) => updateReimagineControl('newBackgroundDescription', e.target.value)}
                                placeholder="e.g., Standing on a busy street in Tokyo at night, with glowing neon signs"
                                rows={4}
                                className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                        </div>
                    </div>
                </SettingSection>

                <SettingSection id="reimagine-settings-output" title="Output" icon={<Camera size={18} />}>
                    <div className="space-y-6 pt-4">
                        <AspectRatioSelector />
                        <OptionSelector
                            label="Number of Images"
                            options={IMAGE_COUNT_OPTIONS}
                            selectedOption={selectedImageCount}
                            onSelect={(option) => setNumberOfImages(parseInt(option.name, 10))}
                            gridCols="grid-cols-3"
                        />
                    </div>
                </SettingSection>

                 <SettingSection title="Advanced Prompting" icon={<Type size={18}/>}>
                    <div className="pt-4">
                        <label htmlFor="negative-prompt" className="text-sm font-semibold text-zinc-300">Negative Prompt</label>
                        <p className="text-xs text-zinc-400 mt-1 mb-2">Describe elements to avoid in the image.</p>
                        <textarea
                            id="negative-prompt"
                            value={reimagineControls.negativePrompt}
                            onChange={(e) => updateReimagineControl('negativePrompt', e.target.value)}
                            placeholder="e.g., blurry, text, watermark"
                            rows={3}
                            className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                        />
                    </div>
                </SettingSection>
            </div>
        </div>
    );
};
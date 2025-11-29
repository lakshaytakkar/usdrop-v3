import React from 'react';
import { Camera, Palette, X, Image, Package, Brush } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { AspectRatioSelector } from '../shared/AspectRatioSelector';
import { OptionSelector } from '../shared/OptionSelector';
import { IMAGE_COUNT_OPTIONS } from '../../constants';
import { SettingSection } from '../settings/SettingSection';
import { DesignPlacementPanel } from './DesignPlacementPanel';
import { MockupStylePanel } from './MockupStylePanel';
import { MockupPhotographyPanel } from './MockupPhotographyPanel';
import { MockupPackSwitcher } from './MockupPackSwitcher';
import { ColorwayGeneratorPanel } from './ColorwayGeneratorPanel';
import { DesignSceneSelector } from './DesignSceneSelector';

interface DesignSettingsPanelProps {
    onClose: () => void;
}

export const DesignSettingsPanel: React.FC<DesignSettingsPanelProps> = ({ onClose }) => {
    const { 
        numberOfImages, 
        setNumberOfImages,
        designPlacementControls,
        backDesignImage,
    } = useStudio();
    
    const selectedImageCount = IMAGE_COUNT_OPTIONS.find(o => o.name === String(numberOfImages)) || IMAGE_COUNT_OPTIONS[0];
    const isPackMode = designPlacementControls.isMockupPackActive;
    const packImageCount = backDesignImage ? 4 : 3;

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                <h2 className="text-lg font-bold text-zinc-100">Design Settings</h2>
                <button onClick={onClose} className="p-1 -m-1 text-zinc-400 hover:text-white lg:hidden">
                    <X size={24} />
                </button>
            </div>
            
            <div className="flex-grow min-h-0 overflow-y-auto p-4 space-y-2">
                <SettingSection id="settings-panel-output" title="Output" icon={<Camera size={18} />} defaultOpen>
                    <div className="space-y-6 pt-4">
                        <AspectRatioSelector />
                        <div className="relative">
                            <fieldset disabled={isPackMode}>
                                 <OptionSelector
                                    label="Number of Images"
                                    options={IMAGE_COUNT_OPTIONS}
                                    selectedOption={selectedImageCount}
                                    onSelect={(option) => setNumberOfImages(parseInt(option.name, 10))}
                                    gridCols="grid-cols-3"
                                />
                            </fieldset>
                            {isPackMode && (
                                <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                                    <p className="text-sm text-zinc-300 font-medium">Pack generates {packImageCount} images.</p>
                                </div>
                            )}
                        </div>
                        <MockupPackSwitcher />
                    </div>
                </SettingSection>

                <SettingSection id="settings-panel-batch" title="Batch Tools" icon={<Palette size={18} />}>
                    <div className="pt-4"><ColorwayGeneratorPanel /></div>
                </SettingSection>

                <SettingSection id="settings-panel-material" title="Material Engine" icon={<Package size={18} />} defaultOpen>
                    <div className="pt-4"><MockupStylePanel /></div>
                </SettingSection>
                
                 <div className="relative">
                    <fieldset disabled={isPackMode}>
                        <SettingSection id="settings-panel-photoshoot" title="Virtual Photoshoot" icon={<Image size={18} />}>
                           <div className="pt-4"><MockupPhotographyPanel /></div>
                        </SettingSection>
                    </fieldset>
                    {isPackMode && (
                        <div className="absolute inset-0 top-0 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4 z-10">
                            <p className="text-sm text-zinc-300 font-medium">Angles & lighting are set by the pack.</p>
                        </div>
                    )}
                </div>

                <SettingSection id="settings-panel-placement" title="Design Placement" icon={<Brush size={18} />}>
                    <div className="pt-4"><DesignPlacementPanel /></div>
                </SettingSection>
                
                <SettingSection id="settings-panel-scene" title="Scene & Style" icon={<Palette size={18} />}>
                    <div className="pt-4">
                        <DesignSceneSelector />
                    </div>
                </SettingSection>
            </div>
        </div>
    );
};
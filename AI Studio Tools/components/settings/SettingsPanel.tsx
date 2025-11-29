
import React from 'react';
import { Camera, SlidersHorizontal, Palette, X, Brush, Wand2, Save } from 'lucide-react';
import { ControlPanel } from './ControlPanel';
import { SceneSelector } from './SceneSelector';
import { useStudio } from '../../context/StudioContext';
import { PostProductionPanel } from './PostProductionPanel';
import { AspectRatioSelector } from '../shared/AspectRatioSelector';
import { OptionSelector } from '../shared/OptionSelector';
import { IMAGE_COUNT_OPTIONS } from '../../constants';
import { SettingSection } from './SettingSection';
import { EcommercePackSelector } from './EcommercePackSelector';
import { useAuth } from '../../context/AuthContext';
import { ProductControlPanel } from '../product/ProductControlPanel';
import { ProductSceneSelector } from '../product/ProductSceneSelector';
import { SocialMediaPackSwitcher } from './SocialMediaPackSwitcher';
import { DesignSettingsPanel } from '../design/DesignSettingsPanel';
import { LooksPanel } from './LooksPanel';
import { FullAssetPackSwitcher } from './FullAssetPackSwitcher';
import { ProductEcommercePackSelector } from '../product/ProductEcommercePackSelector';
import { ReimagineSettingsPanel } from '../reimagine/ReimagineSettingsPanel';

interface SettingsPanelProps {
    onClose: () => void;
    isMobileView?: boolean;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({ onClose, isMobileView }) => {
    const { 
        studioMode,
        generatedImages, 
        numberOfImages, 
        setNumberOfImages, 
        ecommercePack,
        productEcommercePack,
        isSocialMediaPack,
        isCompletePack,
        designPlacementControls,
        selectedModels,
        uploadedModelImage,
    } = useStudio();
    const { hasPermission } = useAuth();

    const hasGeneratedImages = generatedImages && generatedImages.length > 0;
    const selectedImageCount = IMAGE_COUNT_OPTIONS.find(o => o.name === String(numberOfImages)) || IMAGE_COUNT_OPTIONS[0];

    const canUsePostProduction = hasPermission('postProductionSuite');
    const isApparelPackActive = ecommercePack !== 'none' || isSocialMediaPack || isCompletePack;
    
    const isModelSelectedInProductMode = studioMode === 'product' && (selectedModels.length > 0 || !!uploadedModelImage);
    const isProductPackActive = studioMode === 'product' && (isModelSelectedInProductMode ? ecommercePack !== 'none' : productEcommercePack !== 'none');

    const isMockupPackActive = studioMode === 'design' && designPlacementControls.isMockupPackActive;


    const renderCreativeControls = () => {
        if (studioMode === 'apparel') {
            return (
                 <div className="relative pt-4">
                     <fieldset disabled={isApparelPackActive}>
                        <ControlPanel />
                     </fieldset>
                     {isApparelPackActive && (
                        <div className="absolute inset-0 top-4 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                            <p className="text-sm text-zinc-300 font-medium">Poses and angles are controlled by the selected pack.</p>
                        </div>
                    )}
                </div>
            )
        }
        if (studioMode === 'product') {
            return (
                <div className="relative pt-4">
                    <fieldset disabled={isProductPackActive}>
                        <ProductControlPanel />
                    </fieldset>
                    {isProductPackActive && (
                        <div className="absolute inset-0 top-4 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                            <p className="text-sm text-zinc-300 font-medium">Angles and lenses are controlled by the selected pack.</p>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    const renderSceneSelector = () => {
        if (studioMode === 'apparel') {
            return <SceneSelector />;
        }
        if (studioMode === 'product' || studioMode === 'design') {
            return <ProductSceneSelector />;
        }
        return null;
    }

    if (studioMode === 'design') {
        return <DesignSettingsPanel onClose={onClose} />;
    }

    if (studioMode === 'reimagine') {
        return <ReimagineSettingsPanel onClose={onClose} />;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {isMobileView && (
                        <button onClick={onClose} className="p-1 -m-1 text-zinc-400 hover:text-white" aria-label="Close settings panel">
                            <X size={24} />
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-zinc-100">Settings</h2>
                </div>
            </div>
            
            <div className="flex-grow min-h-0 overflow-y-auto p-4 space-y-2">
                <SettingSection id="settings-panel-output" title="Output" icon={<Camera size={18} />} defaultOpen>
                    <div className="space-y-6 pt-4">
                        <div className="relative">
                             <fieldset disabled={isSocialMediaPack || isCompletePack}>
                                <AspectRatioSelector />
                             </fieldset>
                             {(isSocialMediaPack || isCompletePack) && (
                                <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                                    <p className="text-sm text-zinc-300 font-medium">Overridden by the selected Asset Pack.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="relative">
                            <fieldset disabled={isApparelPackActive || isProductPackActive || isMockupPackActive}>
                                <OptionSelector
                                    label="Number of Images"
                                    options={IMAGE_COUNT_OPTIONS}
                                    selectedOption={selectedImageCount}
                                    onSelect={(option) => setNumberOfImages(parseInt(option.name, 10))}
                                    gridCols="grid-cols-5"
                                />
                            </fieldset>
                            {(isApparelPackActive || isProductPackActive || isMockupPackActive) && (
                                <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                                    <p className="text-sm text-zinc-300 font-medium">Determined by selected pack.</p>
                                </div>
                            )}
                        </div>
                       
                        {studioMode === 'apparel' && (
                            <div className="space-y-4">
                                <EcommercePackSelector />
                                <SocialMediaPackSwitcher />
                                <FullAssetPackSwitcher />
                            </div>
                        )}
                        {studioMode === 'product' && (
                            <div className="space-y-4">
                                {isModelSelectedInProductMode ? <EcommercePackSelector /> : <ProductEcommercePackSelector />}
                            </div>
                        )}
                    </div>
                </SettingSection>

                {studioMode === 'apparel' && (
                    <SettingSection id="settings-panel-looks" title="Looks" icon={<Save size={18} />}>
                        <div className="pt-4">
                            <LooksPanel />
                        </div>
                    </SettingSection>
                )}
                
                <SettingSection id="settings-panel-creative" title="Creative Controls" icon={<SlidersHorizontal size={18} />} defaultOpen={studioMode === 'product'}>
                    {renderCreativeControls()}
                </SettingSection>
                
                <SettingSection id="settings-panel-scene" title="Scene & Style" icon={<Palette size={18} />}>
                    <div className="pt-4">
                        {renderSceneSelector()}
                    </div>
                </SettingSection>

                {hasGeneratedImages && canUsePostProduction && (
                    <SettingSection title="Post-Production" icon={<Wand2 size={18} />}>
                        <div className="pt-4">
                            <PostProductionPanel />
                        </div>
                    </SettingSection>
                )}
            </div>
        </div>
    );
};

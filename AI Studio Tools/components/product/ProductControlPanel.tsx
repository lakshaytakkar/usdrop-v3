import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
    APERTURES_LIBRARY, 
    FOCAL_LENGTHS_LIBRARY, 
    CAMERA_ANGLES_LIBRARY_PRODUCT,
    LIGHTING_DIRECTIONS_LIBRARY,
    LIGHT_QUALITIES_LIBRARY,
    CATCHLIGHT_STYLES_LIBRARY,
    COLOR_GRADING_PRESETS,
    PRODUCT_MATERIAL_LIBRARY,
    SHOT_TYPES_LIBRARY,
    EXPRESSIONS,
    CAMERA_ANGLES_LIBRARY,
    PRODUCT_INTERACTION_LIBRARY,
} from '../../constants';
import { OptionSelector } from '../shared/OptionSelector';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Sparkles, Film, Type, Save, Layers, Trash2, User } from 'lucide-react';
import { SettingSection } from '../settings/SettingSection';

export const ProductControlPanel: React.FC = () => {
    const { productControls, updateProductControl, sceneTemplates, saveSceneTemplate, applySceneTemplate, deleteSceneTemplate, selectedModels, uploadedModelImage } = useStudio();
    const [templateName, setTemplateName] = useState('');
    
    const isModelSelected = selectedModels.length > 0 || !!uploadedModelImage;

    const handleSave = () => {
        saveSceneTemplate(templateName);
        setTemplateName('');
    }
    
    const standardMaterials = PRODUCT_MATERIAL_LIBRARY.filter(m => m.category === 'Standard');
    const artisticMaterials = PRODUCT_MATERIAL_LIBRARY.filter(m => m.category === 'Artistic');

    return (
        <div className="flex flex-col space-y-6">
            <div className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="hyper-realism-toggle-product" className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer">
                        <Sparkles size={18} /> Hyper Realism
                    </label>
                    <ToggleSwitch
                        id="hyper-realism-toggle-product"
                        checked={productControls.isHyperRealismEnabled}
                        onChange={(checked) => updateProductControl('isHyperRealismEnabled', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="cinematic-look-toggle-product" className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer">
                        <Film size={18} /> Cinematic Look
                    </label>
                    <ToggleSwitch
                        id="cinematic-look-toggle-product"
                        checked={productControls.cinematicLook}
                        onChange={(checked) => updateProductControl('cinematicLook', checked)}
                    />
                </div>
            </div>
             <OptionSelector
                label="Color Grade"
                options={COLOR_GRADING_PRESETS}
                selectedOption={productControls.colorGrade}
                onSelect={(option) => updateProductControl('colorGrade', option)}
                gridCols="grid-cols-2"
                buttonTextSize="text-xs"
            />
            
            {!isModelSelected && (
                 <>
                    <OptionSelector
                        label="Material & Reflections"
                        options={standardMaterials}
                        selectedOption={productControls.productMaterial}
                        onSelect={(option) => updateProductControl('productMaterial', option)}
                        gridCols="grid-cols-2"
                    />
                    <OptionSelector
                        label="Artistic Transformations"
                        options={artisticMaterials}
                        selectedOption={productControls.productMaterial}
                        onSelect={(option) => updateProductControl('productMaterial', option)}
                        gridCols="grid-cols-3"
                        buttonTextSize="text-xs"
                    />
                 </>
            )}
           
             <OptionSelector
                label="Camera Angle"
                options={isModelSelected ? CAMERA_ANGLES_LIBRARY : CAMERA_ANGLES_LIBRARY_PRODUCT}
                selectedOption={productControls.cameraAngle}
                onSelect={(option) => updateProductControl('cameraAngle', option)}
                gridCols="grid-cols-2"
            />
            <OptionSelector
                label="Focal Length"
                options={FOCAL_LENGTHS_LIBRARY}
                selectedOption={productControls.focalLength}
                onSelect={(option) => updateProductControl('focalLength', option)}
                gridCols="grid-cols-3"
            />
            <OptionSelector
                label="Aperture (Depth of Field)"
                options={APERTURES_LIBRARY}
                selectedOption={productControls.aperture}
                onSelect={(option) => updateProductControl('aperture', option)}
                gridCols="grid-cols-3"
            />
            
             {isModelSelected && (
                 <SettingSection title="On-Model Photoshoot" icon={<User size={18} />} defaultOpen>
                    <div className="space-y-6 pt-4">
                        <OptionSelector
                            label="Shot Type / Pose"
                            options={SHOT_TYPES_LIBRARY}
                            selectedOption={productControls.shotType}
                            onSelect={(option) => updateProductControl('shotType', option)}
                            gridCols="grid-cols-2"
                            buttonTextSize="text-xs"
                        />
                        <OptionSelector
                            label="Model Expression"
                            options={EXPRESSIONS}
                            selectedOption={productControls.expression}
                            onSelect={(option) => updateProductControl('expression', option)}
                            gridCols="grid-cols-2"
                        />
                        <OptionSelector
                            label="Product Interaction"
                            options={PRODUCT_INTERACTION_LIBRARY}
                            selectedOption={productControls.modelInteractionType}
                            onSelect={(option) => updateProductControl('modelInteractionType', option)}
                            gridCols="grid-cols-2"
                            buttonTextSize="text-xs"
                        />
                        {productControls.modelInteractionType.id === 'custom' && (
                            <div className="animate-fade-in">
                                <label htmlFor="model-interaction" className="text-sm font-semibold text-zinc-300">Custom Interaction</label>
                                <p className="text-xs text-zinc-400 mt-1 mb-2">Describe exactly how the model should interact with the product.</p>
                                <textarea
                                    id="model-interaction"
                                    value={productControls.customModelInteraction}
                                    onChange={(e) => updateProductControl('customModelInteraction', e.target.value)}
                                    placeholder="e.g., wearing the watch on their left wrist"
                                    rows={3}
                                    className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                                />
                            </div>
                        )}
                    </div>
                </SettingSection>
            )}


            <SettingSection title="Scene Templates" icon={<Save size={18} />}>
                <div className="space-y-4 pt-4">
                    <div>
                        <label htmlFor="template-name" className="text-sm font-semibold text-zinc-300">Save Current Scene</label>
                        <p className="text-xs text-zinc-400 mt-1 mb-2">Save all current creative and scene settings as a reusable template.</p>
                        <div className="flex gap-2">
                            <input
                                id="template-name"
                                value={templateName}
                                onChange={(e) => setTemplateName(e.target.value)}
                                placeholder="e.g., 'Dark & Moody Look'"
                                className="flex-1 p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                            <button
                                onClick={handleSave}
                                disabled={!templateName.trim()}
                                className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Save
                            </button>
                        </div>
                    </div>

                    {sceneTemplates.length > 0 && (
                        <div className="border-t border-zinc-700 pt-4">
                             <h4 className="text-sm font-semibold text-zinc-300 mb-2">My Templates</h4>
                             <div className="space-y-2">
                                {sceneTemplates.map(template => (
                                    <div key={template.id} className="flex items-center justify-between p-2 rounded-md bg-zinc-800">
                                        <p className="text-sm text-zinc-200">{template.name}</p>
                                        <div className="flex items-center gap-1">
                                             <button onClick={() => applySceneTemplate(template.id)} className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors" title="Apply Template">
                                                <Layers size={16} />
                                            </button>
                                            <button onClick={() => deleteSceneTemplate(template.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-md transition-colors" title="Delete Template">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>
            </SettingSection>

            <SettingSection title="Advanced Lighting" icon={<Sparkles size={18} />}>
                <div className="space-y-6 pt-4">
                     <OptionSelector
                        label="Light Direction"
                        options={LIGHTING_DIRECTIONS_LIBRARY}
                        selectedOption={productControls.lightingDirection}
                        onSelect={(option) => updateProductControl('lightingDirection', option)}
                        gridCols="grid-cols-2"
                    />
                     <OptionSelector
                        label="Light Quality"
                        options={LIGHT_QUALITIES_LIBRARY}
                        selectedOption={productControls.lightQuality}
                        onSelect={(option) => updateProductControl('lightQuality', option)}
                        gridCols="grid-cols-2"
                    />
                     <OptionSelector
                        label="Surface Catchlight"
                        options={CATCHLIGHT_STYLES_LIBRARY}
                        selectedOption={productControls.catchlightStyle}
                        onSelect={(option) => updateProductControl('catchlightStyle', option)}
                        gridCols="grid-cols-3"
                    />
                </div>
            </SettingSection>

            <SettingSection title="Advanced Prompting" icon={<Type size={18}/>}>
                <div className="pt-4">
                    <label htmlFor="negative-prompt-product" className="text-sm font-semibold text-zinc-300">Negative Prompt</label>
                    <p className="text-xs text-zinc-400 mt-1 mb-2">Describe elements to avoid in the image.</p>
                    <textarea
                        id="negative-prompt-product"
                        value={productControls.negativePrompt}
                        onChange={(e) => updateProductControl('negativePrompt', e.target.value)}
                        placeholder="e.g., blurry, text, watermark"
                        rows={3}
                        className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft mb-6"
                    />
                
                    <label htmlFor="custom-prompt-product" className="text-sm font-semibold text-zinc-300">Custom Prompt Override</label>
                    <p className="text-xs text-zinc-400 mt-1 mb-2">
                        For advanced users. If filled, this prompt will be used INSTEAD of the settings above. You must still provide a product image.
                    </p>
                    <textarea
                        id="custom-prompt-product"
                        value={productControls.customPrompt}
                        onChange={(e) => updateProductControl('customPrompt', e.target.value)}
                        placeholder="e.g., A watch on a marble slab, surrounded by coffee beans, dramatic side lighting..."
                        rows={5}
                        className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                    />
                </div>
            </SettingSection>
        </div>
    );
};
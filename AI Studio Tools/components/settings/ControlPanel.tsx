import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { 
    SHOT_TYPES_LIBRARY, 
    EXPRESSIONS, 
    APERTURES_LIBRARY, 
    FOCAL_LENGTHS_LIBRARY, 
    FABRIC_TYPES_LIBRARY, 
    CAMERA_ANGLES_LIBRARY,
    LIGHTING_DIRECTIONS_LIBRARY,
    LIGHT_QUALITIES_LIBRARY,
    CATCHLIGHT_STYLES_LIBRARY,
    COLOR_GRADING_PRESETS
} from '../../constants';
import { OptionSelector } from '../shared/OptionSelector';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { Sparkles, Film, Type, User, Shirt } from 'lucide-react';
import { SettingSection } from './SettingSection';

export const ControlPanel: React.FC = () => {
    const { apparelControls, updateApparelControl } = useStudio();

    return (
        <div className="flex flex-col space-y-2">
            <div className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-4">
                <div className="flex items-center justify-between">
                    <label htmlFor="hyper-realism-toggle" className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer">
                        <Sparkles size={18} /> Hyper Realism
                    </label>
                    <ToggleSwitch
                        id="hyper-realism-toggle"
                        checked={apparelControls.isHyperRealismEnabled}
                        onChange={(checked) => updateApparelControl('isHyperRealismEnabled', checked)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <label htmlFor="cinematic-look-toggle" className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer">
                        <Film size={18} /> Cinematic Look
                    </label>
                    <ToggleSwitch
                        id="cinematic-look-toggle"
                        checked={apparelControls.cinematicLook}
                        onChange={(checked) => updateApparelControl('cinematicLook', checked)}
                    />
                </div>
            </div>

            <div className="space-y-6 pt-4">
                <OptionSelector
                    label="Color Grade"
                    options={COLOR_GRADING_PRESETS}
                    selectedOption={apparelControls.colorGrade}
                    onSelect={(option) => updateApparelControl('colorGrade', option)}
                    gridCols="grid-cols-2"
                    buttonTextSize="text-xs"
                />
                <OptionSelector
                    label="Shot Type / Pose"
                    options={SHOT_TYPES_LIBRARY}
                    selectedOption={apparelControls.shotType}
                    onSelect={(option) => updateApparelControl('shotType', option)}
                    gridCols="grid-cols-2"
                    buttonTextSize="text-xs"
                />
                <OptionSelector
                    label="Model Expression"
                    options={EXPRESSIONS}
                    selectedOption={apparelControls.expression}
                    onSelect={(option) => updateApparelControl('expression', option)}
                    gridCols="grid-cols-2"
                />
                <OptionSelector
                    label="Camera Angle"
                    options={CAMERA_ANGLES_LIBRARY}
                    selectedOption={apparelControls.cameraAngle}
                    onSelect={(option) => updateApparelControl('cameraAngle', option)}
                    gridCols="grid-cols-2"
                />
                <OptionSelector
                    label="Focal Length"
                    options={FOCAL_LENGTHS_LIBRARY}
                    selectedOption={apparelControls.focalLength}
                    onSelect={(option) => updateApparelControl('focalLength', option)}
                    gridCols="grid-cols-3"
                />
                <OptionSelector
                    label="Aperture (Depth of Field)"
                    options={APERTURES_LIBRARY}
                    selectedOption={apparelControls.aperture}
                    onSelect={(option) => updateApparelControl('aperture', option)}
                    gridCols="grid-cols-3"
                />
                 <OptionSelector
                    label="Fabric Simulation"
                    options={FABRIC_TYPES_LIBRARY}
                    selectedOption={apparelControls.fabric}
                    onSelect={(option) => updateApparelControl('fabric', option)}
                    gridCols="grid-cols-2"
                />
            </div>

            <SettingSection title="Model Styling" icon={<User size={18}/>}>
                <div className="space-y-4 pt-4">
                    <div>
                        <label htmlFor="hair-style" className="text-sm font-semibold text-zinc-300">Hair Style</label>
                        <p className="text-xs text-zinc-400 mt-1 mb-2">Describe the model's hair.</p>
                        <textarea
                            id="hair-style"
                            value={apparelControls.hairStyle}
                            onChange={(e) => updateApparelControl('hairStyle', e.target.value)}
                            placeholder="e.g., sleek high ponytail, wavy bob, short braids"
                            rows={2}
                            className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                        />
                    </div>
                     <div>
                        <label htmlFor="makeup-style" className="text-sm font-semibold text-zinc-300">Makeup Style</label>
                        <p className="text-xs text-zinc-400 mt-1 mb-2">Describe the model's makeup.</p>
                        <textarea
                            id="makeup-style"
                            value={apparelControls.makeupStyle}
                            onChange={(e) => updateApparelControl('makeupStyle', e.target.value)}
                            placeholder="e.g., natural look, bold red lip, smoky eye"
                            rows={2}
                            className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                        />
                    </div>
                </div>
            </SettingSection>

            <SettingSection title="Garment Styling" icon={<Shirt size={18}/>}>
                 <div className="space-y-4 pt-4">
                    <div>
                        <label htmlFor="garment-styling" className="text-sm font-semibold text-zinc-300">Styling Details</label>
                        <p className="text-xs text-zinc-400 mt-1 mb-2">Describe how the apparel is worn.</p>
                        <textarea
                            id="garment-styling"
                            value={apparelControls.garmentStyling}
                            onChange={(e) => updateApparelControl('garmentStyling', e.target.value)}
                            placeholder="e.g., sleeves rolled up, shirt half-tucked, collar popped"
                            rows={3}
                            className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                        />
                    </div>
                </div>
            </SettingSection>

            <SettingSection title="Advanced Lighting" icon={<Sparkles size={18}/>}>
                <div className="space-y-6 pt-4">
                     <OptionSelector
                        label="Light Direction"
                        options={LIGHTING_DIRECTIONS_LIBRARY}
                        selectedOption={apparelControls.lightingDirection}
                        onSelect={(option) => updateApparelControl('lightingDirection', option)}
                        gridCols="grid-cols-2"
                    />
                     <OptionSelector
                        label="Light Quality"
                        options={LIGHT_QUALITIES_LIBRARY}
                        selectedOption={apparelControls.lightQuality}
                        onSelect={(option) => updateApparelControl('lightQuality', option)}
                        gridCols="grid-cols-2"
                    />
                     <OptionSelector
                        label="Eye Catchlight"
                        options={CATCHLIGHT_STYLES_LIBRARY}
                        selectedOption={apparelControls.catchlightStyle}
                        onSelect={(option) => updateApparelControl('catchlightStyle', option)}
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
                        value={apparelControls.negativePrompt}
                        onChange={(e) => updateApparelControl('negativePrompt', e.target.value)}
                        placeholder="e.g., blurry, text, watermark"
                        rows={3}
                        className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft mb-6"
                    />
                
                    <label htmlFor="custom-prompt" className="text-sm font-semibold text-zinc-300">Custom Prompt Override</label>
                    <p className="text-xs text-zinc-400 mt-1 mb-2">
                        For advanced users. If filled, this prompt will be used INSTEAD of the settings above. You must still provide model and apparel images.
                    </p>
                    <textarea
                        id="custom-prompt"
                        value={apparelControls.customPrompt}
                        onChange={(e) => updateApparelControl('customPrompt', e.target.value)}
                        placeholder="e.g., A fashion model wearing a blue t-shirt, standing on a beach at sunset, dramatic lighting, 85mm portrait lens..."
                        rows={5}
                        className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                    />
                </div>
            </SettingSection>
        </div>
    );
};
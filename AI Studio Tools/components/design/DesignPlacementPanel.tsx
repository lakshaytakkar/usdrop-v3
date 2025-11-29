import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { DESIGN_PLACEMENT_OPTIONS, PRINT_STYLE_OPTIONS } from '../../constants';
import { OptionSelector } from '../shared/OptionSelector';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { SlidersHorizontal, Layers, Wand2, Loader2 } from 'lucide-react';
import type { DesignPlacement } from '../../types';
import { useAuth } from '../../context/AuthContext';

const SliderControl: React.FC<{label: string, value: number, onChange: (value: number) => void, min: number, max: number, step: number, unit?: string}> = 
({ label, value, onChange, min, max, step, unit = '' }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-zinc-300">{label}</label>
                <span className="text-sm font-semibold text-zinc-100">{value}{unit}</span>
            </div>
            <input 
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={e => onChange(parseInt(e.target.value, 10))}
                className="w-full"
            />
        </div>
    );
};

export const DesignPlacementPanel: React.FC = () => {
    const { 
        designPlacementControls, 
        updateDesignSideControl, 
        backDesignImage, 
        updateDesignPlacementControl,
        generateBackView,
        isGenerating
    } = useStudio();
    const { user, incrementGenerationsUsed } = useAuth();
    const [activeEditor, setActiveEditor] = useState<'front' | 'back'>('front');
    
    const activeControls = designPlacementControls[activeEditor];

    const handlePlacementSelect = (option: { id: DesignPlacement; name: string; defaultScale: number; }) => {
        updateDesignSideControl(activeEditor, 'placement', option.id);
        updateDesignSideControl(activeEditor, 'scale', option.defaultScale);
    };

    const handleGenerateBack = () => {
        if (user) {
            generateBackView(incrementGenerationsUsed);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
             <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                    <SlidersHorizontal size={16}/> Fine-Tuning Controls
                </h3>

                {/* Front/Back Switcher */}
                <div className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 border border-zinc-800 shadow-inner-soft mb-4">
                    <button onClick={() => setActiveEditor('front')} className={`flex-1 text-center py-1.5 text-sm font-medium rounded-full transition-colors ${activeEditor === 'front' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}>
                        Front Design
                    </button>
                    <button onClick={() => setActiveEditor('back')} disabled={!backDesignImage} className={`flex-1 text-center py-1.5 text-sm font-medium rounded-full transition-colors ${activeEditor === 'back' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800'} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        Back Design
                    </button>
                </div>

                <div className="space-y-4 p-3 rounded-lg bg-zinc-800/50 border border-white/10">
                    <OptionSelector
                        label="Placement Preset"
                        options={DESIGN_PLACEMENT_OPTIONS}
                        selectedOption={DESIGN_PLACEMENT_OPTIONS.find(o => o.id === activeControls.placement)!}
                        onSelect={handlePlacementSelect}
                        gridCols="grid-cols-2"
                        buttonTextSize="text-xs"
                    />
                    <SliderControl label="Scale" value={activeControls.scale} onChange={(v) => updateDesignSideControl(activeEditor, 'scale', v)} min={5} max={200} step={1} unit="%"/>
                    <SliderControl label="Rotation" value={activeControls.rotation} onChange={(v) => updateDesignSideControl(activeEditor, 'rotation', v)} min={-180} max={180} step={1} unit="°"/>
                    <SliderControl label="Horizontal Offset" value={activeControls.offsetX} onChange={(v) => updateDesignSideControl(activeEditor, 'offsetX', v)} min={-50} max={50} step={1} unit="%"/>
                    <SliderControl label="Vertical Offset" value={activeControls.offsetY} onChange={(v) => updateDesignSideControl(activeEditor, 'offsetY', v)} min={-50} max={50} step={1} unit="%"/>
                    
                    {activeEditor === 'back' && (
                        <div className="border-t border-zinc-700/50 pt-4 mt-4">
                            <button
                                onClick={handleGenerateBack}
                                disabled={!backDesignImage || isGenerating}
                                className="w-full bg-brand-primary disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all duration-200 flex items-center justify-center gap-2 shadow-button-glow hover:shadow-button-glow-hover hover:bg-brand-primary-hover active:scale-[0.98]"
                            >
                                {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Wand2 size={16} />}
                                {isGenerating ? 'Generating...' : 'Generate Back View'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-zinc-100 mb-4 border-t border-zinc-800 pt-6 flex items-center gap-2">
                    <Layers size={16} /> Realism Engine
                </h3>
                <div className="space-y-6 p-3 rounded-lg bg-zinc-800/50 border border-white/10">
                    <OptionSelector
                        label="Print Style"
                        options={PRINT_STYLE_OPTIONS}
                        selectedOption={PRINT_STYLE_OPTIONS.find(o => o.id === designPlacementControls.printStyle)!}
                        onSelect={(option) => updateDesignPlacementControl('printStyle', option.id)}
                        gridCols="grid-cols-2"
                        buttonTextSize="text-xs"
                    />
                    <SliderControl label="Fabric Blend" value={designPlacementControls.fabricBlend} onChange={(v) => updateDesignPlacementControl('fabricBlend', v)} min={0} max={100} step={1} unit="%"/>
                    <div className="flex items-center justify-between pt-2">
                        <label htmlFor="wrinkle-conform-toggle" className="font-medium text-zinc-300 text-sm cursor-pointer">
                            Wrinkle Conforming
                        </label>
                        <ToggleSwitch
                            id="wrinkle-conform-toggle"
                            checked={designPlacementControls.wrinkleConform}
                            onChange={(checked) => updateDesignPlacementControl('wrinkleConform', checked)}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};
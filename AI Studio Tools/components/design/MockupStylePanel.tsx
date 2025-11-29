import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { MOCKUP_STYLE_OPTIONS, FABRIC_STYLE_OPTIONS } from '../../constants';
import { OptionSelector } from '../shared/OptionSelector';

export const MockupStylePanel: React.FC = () => {
    const { designPlacementControls, updateDesignPlacementControl } = useStudio();

    const selectedMockupStyle = MOCKUP_STYLE_OPTIONS.find(o => o.id === designPlacementControls.mockupStyle)!;
    const selectedFabricStyle = FABRIC_STYLE_OPTIONS.find(o => o.id === designPlacementControls.fabricStyle)!;

    return (
        <div className="flex flex-col space-y-6">
            <div>
                 <label htmlFor="apparel-type" className="text-sm font-semibold text-zinc-300 mb-2 block">Apparel Style Description</label>
                 <textarea
                    id="apparel-type"
                    value={designPlacementControls.apparelType}
                    onChange={(e) => updateDesignPlacementControl('apparelType', e.target.value)}
                    placeholder="e.g., Oversized black t-shirt with yellow sleeves and side panels"
                    rows={3}
                    className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                 />
                 <p className="text-xs text-zinc-400 mt-2">
                    Be descriptive! Mention style (oversized), fabric (heavy cotton), and color patterns (black with yellow sleeves).
                </p>
            </div>
            <OptionSelector
                label="Mockup Style"
                options={MOCKUP_STYLE_OPTIONS}
                selectedOption={selectedMockupStyle}
                onSelect={(option) => updateDesignPlacementControl('mockupStyle', option.id)}
                gridCols="grid-cols-3"
                buttonTextSize="text-xs"
            />
            <OptionSelector
                label="Fabric Type"
                options={FABRIC_STYLE_OPTIONS}
                selectedOption={selectedFabricStyle}
                onSelect={(option) => updateDesignPlacementControl('fabricStyle', option.id)}
                gridCols="grid-cols-2"
                buttonTextSize="text-xs"
            />
            <div>
                 <label htmlFor="shirt-color" className="text-sm font-semibold text-zinc-300 mb-2 block">Base Color</label>
                 <div className="flex items-center gap-3 p-2 bg-zinc-850 rounded-lg border border-white/10">
                     <input 
                        id="shirt-color"
                        type="color"
                        value={designPlacementControls.shirtColor}
                        onChange={(e) => updateDesignPlacementControl('shirtColor', e.target.value)}
                        className="w-10 h-10 rounded-md cursor-pointer bg-transparent border-none appearance-none p-0 [&::-webkit-color-swatch-wrapper]:p-0 [&::-webkit-color-swatch]:rounded-md [&::-webkit-color-swatch]:border-none"
                        title="Select Base Color"
                     />
                     <div className="flex-1">
                        <span className="font-mono text-zinc-200">{designPlacementControls.shirtColor}</span>
                        <p className="text-xs text-zinc-400">Used as the primary color unless specified in the description above.</p>
                     </div>
                 </div>
            </div>
        </div>
    );
};
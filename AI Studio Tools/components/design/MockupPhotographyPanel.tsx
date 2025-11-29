import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { DESIGN_LIGHTING_STYLE_OPTIONS, DESIGN_CAMERA_ANGLE_OPTIONS } from '../../constants';
import { OptionSelector } from '../shared/OptionSelector';

export const MockupPhotographyPanel: React.FC = () => {
    const { designPlacementControls, updateDesignPlacementControl } = useStudio();

    const selectedLighting = DESIGN_LIGHTING_STYLE_OPTIONS.find(o => o.id === designPlacementControls.lightingStyle)!;
    const selectedAngle = DESIGN_CAMERA_ANGLE_OPTIONS.find(o => o.id === designPlacementControls.cameraAngle)!;

    return (
        <div className="flex flex-col space-y-6">
            <OptionSelector
                label="Studio Lighting Style"
                options={DESIGN_LIGHTING_STYLE_OPTIONS}
                selectedOption={selectedLighting}
                onSelect={(option) => updateDesignPlacementControl('lightingStyle', option.id)}
                gridCols="grid-cols-3"
                buttonTextSize="text-xs"
            />
            <OptionSelector
                label="Product Camera Angle"
                options={DESIGN_CAMERA_ANGLE_OPTIONS}
                selectedOption={selectedAngle}
                onSelect={(option) => updateDesignPlacementControl('cameraAngle', option.id)}
                gridCols="grid-cols-2"
                buttonTextSize="text-xs"
            />
        </div>
    );
};
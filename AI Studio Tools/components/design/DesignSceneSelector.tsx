import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { DESIGN_SCENE_TEMPLATES } from '../../constants';
import { Layers } from 'lucide-react';

export const DesignSceneSelector: React.FC = () => {
    const { updateScene, updateDesignPlacementControl } = useStudio();

    const applySceneTemplate = (templateId: string) => {
        const template = DESIGN_SCENE_TEMPLATES.find(t => t.id === templateId);
        if (template) {
            updateScene(template.scene);
            updateDesignPlacementControl('lightingStyle', template.photography.lightingStyle);
            updateDesignPlacementControl('cameraAngle', template.photography.cameraAngle);
        }
    };

    return (
        <div className="flex flex-col space-y-6">
            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Themed Scenes</h3>
                <p className="text-xs text-zinc-400 mb-3">Choose a pre-defined environment for your mockup. This will set the background, lighting, and camera angle.</p>
                <div className="space-y-2">
                    {DESIGN_SCENE_TEMPLATES.map(template => (
                        <button
                            key={template.id}
                            onClick={() => applySceneTemplate(template.id)}
                            className="w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200 border flex flex-col justify-center min-h-[74px] bg-zinc-850/80 border-white/10 hover:bg-zinc-800 hover:border-white/20"
                        >
                            <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
                                <Layers size={16} className="text-violet-400" />
                                {template.name}
                            </h4>
                            <p className="text-sm text-zinc-400">{template.description}</p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

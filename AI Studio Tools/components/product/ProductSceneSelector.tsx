import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, Trash2, CheckCircle2, UploadCloud, Layers } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { LIGHTING_PRESETS_PRODUCT, TIME_OF_DAY_OPTIONS, SURFACE_LIBRARY, THEMED_SCENE_TEMPLATES } from '../../constants';
import type { Background, Lighting } from '../../types';
import { OptionSelector } from '../shared/OptionSelector';

export const ProductSceneSelector: React.FC = () => {
    const { 
        scene, 
        updateScene, 
        styleReferenceImage, 
        setStyleReferenceImage, 
        productControls,
        updateProductControl,
        suggestedBackgroundColor,
        applySceneTemplate
    } = useStudio();

    const onStyleDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setStyleReferenceImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setStyleReferenceImage]);

    const { getRootProps: getStyleRootProps, getInputProps: getStyleInputProps, isDragActive: isStyleDragActive } = useDropzone({
        onDrop: onStyleDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false
    });
    
    const handleSuggestedColorClick = () => {
        if (suggestedBackgroundColor) {
            const suggestedBg: Background = {
                id: 'suggested',
                name: 'Suggested Color',
                type: 'color',
                value: suggestedBackgroundColor,
                category: 'Suggested'
            };
            updateScene({ background: suggestedBg });
        }
    };
    
    return (
        <div className="flex flex-col space-y-6">
            <OptionSelector
                label="Surface"
                options={SURFACE_LIBRARY}
                selectedOption={productControls.surface}
                onSelect={(option) => updateProductControl('surface', option)}
                gridCols="grid-cols-2"
                buttonTextSize="text-xs"
            />
            
            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Themed Scenes</h3>
                 <div className="space-y-2">
                    {THEMED_SCENE_TEMPLATES.map(template => (
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

            {suggestedBackgroundColor && (
                <div>
                     <h4 className="text-xs font-bold uppercase text-zinc-500 mb-2">Suggested Background</h4>
                     <div
                        onClick={handleSuggestedColorClick}
                        className={`relative h-20 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-center text-xs p-1 group
                            ${scene.background.id === 'suggested' ? 'ring-2 ring-offset-2 ring-violet-500 ring-offset-zinc-925' : 'hover:scale-105'}`}
                        style={{ backgroundColor: suggestedBackgroundColor }}
                    >
                         {scene.background.id === 'suggested' && (
                            <div className="absolute top-1 right-1 z-10 text-white bg-violet-600 rounded-full shadow-lg">
                                <CheckCircle2 size={18} />
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 group-hover:bg-black/30 transition-colors rounded-lg" />
                        <span className="relative z-10 bg-black/50 text-white px-2 py-1 rounded-full">AI Suggestion</span>
                    </div>
                </div>
            )}


            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-3">Lighting</h3>
                 <OptionSelector
                    label="Time of Day"
                    options={TIME_OF_DAY_OPTIONS}
                    selectedOption={TIME_OF_DAY_OPTIONS.find(o => o.name === (scene.timeOfDay || 'None')) || TIME_OF_DAY_OPTIONS[0]}
                    onSelect={(option) => updateScene({ timeOfDay: option.name === 'None' ? null : option.name })}
                    gridCols="grid-cols-3"
                    className="mb-6"
                    buttonTextSize="text-xs"
                />

                <div className="relative">
                    <fieldset disabled={!!scene.timeOfDay}>
                         <h4 className="text-sm font-semibold text-zinc-300 mb-3">Lighting Presets</h4>
                        <div className="space-y-2">
                            {LIGHTING_PRESETS_PRODUCT.map(light => {
                                const isSelected = scene.lighting.id === light.id;
                                const handleClick = () => updateScene({ lighting: light });

                                return (
                                    <button
                                        key={light.id}
                                        onClick={handleClick}
                                        className={`w-full text-left p-3 rounded-lg cursor-pointer transition-all duration-200 border flex flex-col justify-center min-h-[74px]
                                        ${isSelected ? 'bg-violet-600/20 border-violet-500/80' : 'bg-zinc-850/80 border-white/10 hover:bg-zinc-800 hover:border-white/20'}`}
                                    >
                                        <h4 className="font-semibold text-zinc-200 flex items-center gap-2">
                                            {light.name}
                                        </h4>
                                        <p className="text-sm text-zinc-400">
                                            {light.description}
                                        </p>
                                    </button>
                                )
                            })}
                        </div>
                    </fieldset>
                     {!!scene.timeOfDay && (
                        <div className="absolute inset-0 bg-zinc-925/70 backdrop-blur-[2px] rounded-lg flex items-center justify-center text-center p-4">
                            <p className="text-sm text-zinc-300 font-medium">Overridden by Time of Day selection.</p>
                        </div>
                    )}
                </div>
            </div>

            <div>
                <h3 className="text-sm font-semibold text-zinc-300 mb-1">Style Reference</h3>
                <p className="text-xs text-zinc-400 mb-3">Upload an image to guide the aesthetic, color palette, and mood.</p>
                {styleReferenceImage ? (
                     <div className="relative group w-full">
                        <img src={styleReferenceImage} alt="Style reference preview" className="w-full object-contain rounded-lg border border-white/10" />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                            <button 
                                onClick={() => setStyleReferenceImage(null)}
                                className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2"
                            >
                                <Trash2 size={16} />
                                Remove
                            </button>
                        </div>
                     </div>
                ) : (
                    <div {...getStyleRootProps()} className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-colors duration-200 ${isStyleDragActive ? 'border-violet-500 bg-violet-500/10' : 'border-zinc-700 hover:border-zinc-600'}`}>
                        <input {...getStyleInputProps()} />
                        <ImageIcon className="text-zinc-400 mb-2" size={32} />
                        <p className="text-zinc-300 text-center text-sm">
                            {isStyleDragActive ? "Drop image here" : "Add style reference"}
                        </p>
                        <p className="text-xs text-zinc-500 mt-1">PNG or JPG</p>
                    </div>
                )}
                {styleReferenceImage && (
                    <div className="space-y-2 mt-4 p-3 rounded-lg bg-zinc-800/50 border border-white/10">
                        <div className="flex justify-between items-center">
                            <label htmlFor="style-strength" className="text-sm font-medium text-zinc-300">Style Strength</label>
                            <span className="text-sm font-semibold text-zinc-100">{productControls.styleStrength}%</span>
                        </div>
                        <input 
                            id="style-strength"
                            type="range"
                            min="10"
                            max="100"
                            step="5"
                            value={productControls.styleStrength}
                            onChange={e => updateProductControl('styleStrength', parseInt(e.target.value, 10))}
                            className="w-full appearance-none cursor-pointer range-thumb"
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
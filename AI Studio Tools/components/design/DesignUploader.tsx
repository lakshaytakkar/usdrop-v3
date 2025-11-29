import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Sparkles, X, Loader2, Wand2, Lock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';

const AIGraphicDesigner: React.FC = () => {
    const { generateAIDesign, isGeneratingDesign } = useStudio();
    const { hasPermission } = useAuth();
    const [prompt, setPrompt] = useState('');
    const canGenerate = hasPermission('imagenGeneration');

    const handleGenerate = () => {
        if (canGenerate && prompt.trim()) {
            generateAIDesign(prompt);
        }
    };

    return (
        <div 
            className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-3 relative"
            title={!canGenerate ? 'Available on Studio and Brand plans' : ''}
        >
             <fieldset disabled={!canGenerate} className={`${!canGenerate ? 'opacity-50' : ''}`}>
                <label className="font-semibold text-zinc-100 flex items-center gap-2">
                    <Sparkles size={18} /> AI Graphic Designer
                    {!canGenerate && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                </label>
                <p className="text-xs text-zinc-400 mt-1 mb-3">
                    Describe the design you want to create. Best for logos and typography.
                </p>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g., A vintage, distressed logo for 'Nomad Supply Co.' with a mountain range."
                    rows={3}
                    className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                />
                <button
                    onClick={handleGenerate}
                    disabled={isGeneratingDesign || !prompt.trim()}
                    className="w-full bg-brand-primary disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-2 px-4 rounded-lg text-sm transition-colors duration-200 flex items-center justify-center gap-2 mt-2"
                >
                    {isGeneratingDesign ? <Loader2 size={16} className="animate-spin" /> : <Wand2 size={16} />}
                    {isGeneratingDesign ? 'Generating Design...' : 'Generate with AI'}
                </button>
             </fieldset>
             {!canGenerate && <div className="absolute inset-0 rounded-lg cursor-not-allowed"></div>}
        </div>
    );
};

const Uploader: React.FC<{
    title: string;
    description: string;
    image: { base64: string } | null;
    onDrop: (acceptedFiles: File[]) => void;
    onRemove: () => void;
}> = ({ title, description, image, onDrop, onRemove }) => {
    
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.png'] },
        multiple: false
    });

    if (image) {
        return (
            <div className="w-full animate-fade-in flex flex-col">
                <p className="text-sm font-medium text-zinc-300 mb-2 flex-shrink-0">{title}</p>
                 <div className="relative group flex-grow rounded-lg overflow-hidden border-2 border-violet-500/50 shadow-lg shadow-violet-900/30 bg-zinc-900 min-h-[150px]">
                    <img src={image.base64} alt="Design preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                            onClick={onRemove}
                            className="bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100"
                            aria-label={`Remove ${title}`}
                        >
                            <X size={24} />
                        </button>
                    </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div {...getRootProps()} className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${isDragActive ? 'border-violet-500 bg-violet-500/10 shadow-glow-md' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input {...getInputProps()} />
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-violet-500/20' : 'bg-zinc-800'}`}>
                    <Sparkles className={`transition-colors ${isDragActive ? 'text-violet-300' : 'text-zinc-400'}`} size={32} />
                </div>
                <p className="text-zinc-100 font-semibold text-center">
                    {isDragActive ? "Drop the design here" : title}
                </p>
                <p className="text-sm text-zinc-400 mt-1">{description}</p>
            </div>
        </div>
    );
}


export const DesignUploader: React.FC = () => {
    const { designImage, setDesignImage, backDesignImage, setBackDesignImage } = useStudio();

    const onFrontDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setDesignImage({
                        id: file.name,
                        name: file.name,
                        base64: event.target.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setDesignImage]);
    
     const onBackDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setBackDesignImage({
                        id: file.name,
                        name: file.name,
                        base64: event.target.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setBackDesignImage]);


    return (
        <div className="h-full flex flex-col space-y-4 overflow-y-auto pr-1">
            <div className="flex-1 min-h-[200px]">
                <Uploader 
                    title="Upload Front Design"
                    description=".png with transparency recommended"
                    image={designImage}
                    onDrop={onFrontDrop}
                    onRemove={() => setDesignImage(null)}
                />
            </div>
            
            <div className="flex-shrink-0 text-center text-sm text-zinc-500 font-semibold">OR</div>
            
            <div className="flex-shrink-0">
                <AIGraphicDesigner />
            </div>
            
            {designImage && (
                <div className="flex-1 min-h-[200px] animate-fade-in border-t border-zinc-800 pt-4">
                    <Uploader 
                        title="Upload Back Design (Optional)"
                        description="Adds a back view to the Mockup Pack"
                        image={backDesignImage}
                        onDrop={onBackDrop}
                        onRemove={() => setBackDesignImage(null)}
                    />
                </div>
            )}
        </div>
    );
};
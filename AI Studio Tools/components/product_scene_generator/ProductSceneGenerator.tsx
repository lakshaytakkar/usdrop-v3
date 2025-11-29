/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, DragEvent, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { geminiService } from '../../services/geminiService';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

type View = 'config' | 'result';
interface GeneratedImageState {
    status: 'pending' | 'done' | 'error';
    url?: string;
    error?: string;
}

const ANGLE_OPTIONS = [
    { id: 'front', label: 'Front', prompt: "Generate a photorealistic image of the product from a direct front view angle. Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'back', label: 'Back', prompt: "Generate a photorealistic image of the product from a direct back view angle. Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'side_left', label: 'Side Left', prompt: "Use the uploaded image as the base and keep every object, prop, background, and light exactly as in the original. Do not remove, add, resize, or reposition anything. Move only the virtual camera to a side left view of the product, with a camera yaw of −25 degrees, pitch 0, roll 0, keeping the same focal length and depth of field. Preserve parallax and occlusions so that the left-to-right order of objects matches the original scene when viewed from the left. Do not mirror, do not simplify, and do not rebuild a studio background. The result must feel like the same real scene captured from a new camera position." },
    { id: 'side_right', label: 'Side Right', prompt: "Generate a photorealistic image of the product from the right side view. Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'top', label: 'Top', prompt: "Generate a photorealistic image of the product from a top-down angle (bird's-eye view). Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'bottom', label: 'Bottom', prompt: "Generate a photorealistic image of the product from a bottom-up angle (worm's-eye view). Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'three_quarter', label: '3/4 View', prompt: "Generate a photorealistic image of the product from a three-quarter angle, showing the front and one side. Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'close_up', label: 'Close-up', prompt: "Generate a close-up detail shot of the product, focusing on its texture, material, or a key feature. Maintain the exact same background, lighting, and overall style as the original image." },
    { id: 'in_context', label: 'In Context', prompt: "Generate a photorealistic lifestyle image showing the product in a relevant, natural context (e.g., a shoe on a street, a mug on a table). Maintain the exact same background, lighting, and overall style as the original image." },
    { id: '45_left', label: '45° Left Angle', prompt: "Use the original image as the base. Do not remove, add, or alter any objects, props, background elements, lighting, or color tone. Only adjust the virtual camera to a 45 degree left angled view, showing both the front and left side subtly. Maintain the same focal length, depth of field, shadows, and reflections. The result must look like the same real-world scene captured from a slightly rotated camera position." },
    { id: '45_right', label: '45° Right Angle', prompt: "Use the original image as the base without altering any elements in the scene. Rotate only the virtual camera to a 45 degree right-side angle, showing both the front and right side naturally. Maintain the same lighting, parallax, object scale, and spatial relationships. The output must look like the same environment captured from a new camera viewpoint." },
    { id: 'macro_detail', label: 'Macro Detail', prompt: "Generate a macro close-up of a key detail or material texture of the product. Do not change the background, lighting, props, or composition style. Keep the depth of field shallow and realistic, preserving the same visual mood and color accuracy." },
    { id: 'tilt_up', label: 'Tilted Up View', prompt: "Keep the entire scene unchanged and move only the camera slightly below the product, pointing upward. Maintain original lighting, shadows, and material reflections. The result should feel like the real product being viewed from a lower perspective." },
    { id: 'tilt_down', label: 'Tilted Down View', prompt: "Maintain the exact scene setup and shift the camera slightly above the product, pointing downward. Do not modify the product or props. Preserve original shadows, lighting, and scale. The result should look like the same real scene shot from a slightly higher position." },
    { id: 'wide_frame', label: 'Wide Frame Shot', prompt: "Generate a wider field of view while keeping every object in the exact same spatial arrangement. Do not reposition or resize anything. Only increase framing so more of the surroundings are visible. Maintain lighting, depth of field, and style consistency." },
    { id: 'product_only_isolated_view', label: 'Isolation Real Scene View', prompt: "Do not create a plain or white background. Keep the real background and props exactly as they are. Only subtly adjust the visual emphasis so the product becomes the primary focal point, using natural depth of field and framing. No removal or repositioning of objects." }
];

const Uploader = ({ onImageUpload }: { onImageUpload: (file: File) => void }) => {
    const [isDragOver, setIsDragOver] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) onImageUpload(e.target.files[0]);
    };
    const handleDrop = (e: DragEvent<HTMLElement>) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) onImageUpload(e.dataTransfer.files[0]);
    };
    const handleDragEvents = (e: DragEvent<HTMLElement>, enter: boolean) => {
        e.preventDefault(); e.stopPropagation(); setIsDragOver(enter);
    };

    return (
        <label htmlFor="product-upload" className={cn("cursor-pointer aspect-[4/5] w-full max-w-md flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors", isDragOver ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600")} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onDragEnter={(e) => handleDragEvents(e, true)} onDragLeave={(e) => handleDragEvents(e, false)}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-zinc-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-zinc-400 font-semibold">Drop your image here</span>
            <span className="text-zinc-500 text-sm mt-1">or click to upload</span>
            <input id="product-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleFileChange} />
        </label>
    );
};

interface ResultCardProps {
    title: string;
    imageUrl?: string;
    status: GeneratedImageState['status'];
    error?: string;
    onRetry: () => void;
    onDownload: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ title, imageUrl, status, error, onRetry, onDownload }) => {
    return (
        <div className="flex flex-col w-full">
            <h3 className="font-semibold text-base text-zinc-100 mb-2 text-center">{title}</h3>
            <div className="aspect-[4/5] w-full bg-zinc-925 rounded-lg border border-white/10 flex items-center justify-center text-zinc-500 text-center relative overflow-hidden group shadow-lg">
                {status === 'pending' && <Loader2 className="animate-spin h-10 w-10 text-violet-400" />}
                {status === 'error' && <div className="p-4 text-red-400"><p className="font-semibold mb-2">Generation Failed</p><p className="text-xs text-zinc-400 mb-4">{error}</p><button onClick={onRetry} className="text-sm bg-red-600/20 text-red-300 px-3 py-1 rounded-md hover:bg-red-600/40">Retry</button></div>}
                {status === 'done' && imageUrl && <img src={imageUrl} alt={title} className="w-full h-full object-contain" />}
                {status === 'done' && imageUrl && (
                    <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={onDownload} className="p-2 bg-zinc-800/80 rounded-full text-zinc-200 hover:bg-zinc-700" aria-label="Download"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg></button>
                        <button onClick={onRetry} className="p-2 bg-zinc-800/80 rounded-full text-zinc-200 hover:bg-zinc-700" aria-label="Regenerate"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.42.71a5.002 5.002 0 00-8.479-1.554H10a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm12 14a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.42-.71a5.002 5.002 0 008.479 1.554H10a1 1 0 110-2h6a1 1 0 011 1v6a1 1 0 01-1 1z" clipRule="evenodd" /></svg></button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default function ProductSceneGenerator({ onBack }: { onBack: () => void }) {
    const [view, setView] = useState<View>('config');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedAngles, setSelectedAngles] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImageState>>({});
    const [isGenerating, setIsGenerating] = useState(false);

    const handleImageUpload = (file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setUploadedImage(reader.result as string);
            setGeneratedImages({});
        };
        reader.readAsDataURL(file);
    };

    const toggleAngle = (angleId: string) => {
        setSelectedAngles(prev =>
            prev.includes(angleId) ? prev.filter(id => id !== angleId) : [...prev, angleId]
        );
    };

    const handleGenerateSingle = async (angleId: string) => {
        if (!uploadedImage) return;
        const angle = ANGLE_OPTIONS.find(a => a.id === angleId);
        if (!angle) return;

        setGeneratedImages(prev => ({ ...prev, [angleId]: { status: 'pending' } }));

        try {
            const basePrompt = `Using the provided image of a product, generate a new, photorealistic image of the **exact same product**. The product's unique details, materials, colors, and branding MUST be perfectly preserved. Place it on a clean, solid, light grey studio background.`;
            const finalPrompt = `${basePrompt}\n\n**Angle Instruction:** ${angle.prompt}`;
            const resultUrl = await geminiService.generateStyledImage(finalPrompt, [uploadedImage]);
            setGeneratedImages(prev => ({ ...prev, [angleId]: { status: 'done', url: resultUrl } }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            setGeneratedImages(prev => ({ ...prev, [angleId]: { status: 'error', error: message } }));
        }
    };

    const handleGenerateAll = async () => {
        if (!uploadedImage || selectedAngles.length === 0) return;
        setIsGenerating(true);
        setView('result');

        const initialStates: Record<string, GeneratedImageState> = {};
        selectedAngles.forEach(id => {
            initialStates[id] = { status: 'pending' };
        });
        setGeneratedImages(initialStates);

        const concurrencyLimit = 3;
        const queue = [...selectedAngles];

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (queue.length > 0) {
                const angleId = queue.shift();
                if (angleId) {
                    await handleGenerateSingle(angleId);
                }
            }
        });

        await Promise.all(workers);
        setIsGenerating(false);
    };

    const handleStartOver = () => {
        setUploadedImage(null);
        setSelectedAngles([]);
        setGeneratedImages({});
        setView('config');
    };

    const handleDownload = (url: string | undefined, filename: string) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = `virtual-studio-${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const generateButtonText = isGenerating ? "Generating..." : `Generate (${selectedAngles.length})`;

    const renderConfigView = () => (
        <div className="w-full grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
                <h3 className="font-bold text-xl text-zinc-200 mb-1">1. Upload Your Product</h3>
                {uploadedImage ? (
                    <div className="relative group aspect-[4/5] w-full max-w-sm rounded-md overflow-hidden"><img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" /><button onClick={() => setUploadedImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100" aria-label="Remove image"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg></button></div>
                ) : <Uploader onImageUpload={handleImageUpload} />}
            </div>
            <div className="bg-zinc-900/70 border border-white/10 rounded-xl p-6 shadow-lg flex flex-col gap-4">
                <div className={cn(!uploadedImage && "opacity-50 pointer-events-none")}>
                    <h3 className="font-bold text-xl text-zinc-200 mb-2">2. Select Angles</h3>
                    <p className="text-zinc-400 text-sm mb-4">Choose one or more angles to generate.</p>
                    <div className="flex flex-wrap gap-2">
                        {ANGLE_OPTIONS.map(angle => <button key={angle.id} onClick={() => toggleAngle(angle.id)} className={cn('px-3 py-2 text-sm rounded-md transition-colors font-medium', selectedAngles.includes(angle.id) ? 'bg-violet-600 text-white' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700')}>{angle.label}</button>)}
                    </div>
                </div>
                <button onClick={handleGenerateAll} disabled={!uploadedImage || selectedAngles.length === 0 || isGenerating} className="w-full mt-4 flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-button-glow">{generateButtonText}</button>
            </div>
        </div>
    );

    const renderResultView = () => (
        <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                 <ResultCard title="Original" imageUrl={uploadedImage!} status='done' onRetry={() => {}} onDownload={() => handleDownload(uploadedImage, 'original')} />
                 {Object.entries(generatedImages).map(([angleId, state]: [string, GeneratedImageState]) => {
                     const angle = ANGLE_OPTIONS.find(a => a.id === angleId);
                     if (!angle) return null;
                     return <ResultCard key={angleId} title={angle.label} imageUrl={state.url} status={state.status} error={state.error} onRetry={() => handleGenerateSingle(angleId)} onDownload={() => handleDownload(state.url, angleId)} />
                 })}
            </div>
            <button onClick={handleStartOver} className="font-semibold text-sm text-center text-zinc-200 bg-zinc-800 hover:bg-zinc-700 border border-white/10 py-2.5 px-6 rounded-lg transition-all duration-300 hover:scale-105 mt-8">Start Over</button>
        </div>
    );
    
    return (
        <main className="bg-zinc-950 text-zinc-200 min-h-screen w-full flex flex-col items-center p-4 relative noise-overlay font-sans">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-7xl mx-auto flex flex-col items-center z-10">
                <header className="w-full flex justify-between items-center py-4 mb-6">
                    <button onClick={view === 'config' ? onBack : handleStartOver} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" /></svg>{view === 'config' ? 'Back to Tools' : 'Start Over'}</button>
                    <div className="flex items-center gap-4"></div>
                </header>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 mb-2 flex items-center justify-center gap-4 tracking-tight">
                        <span className="text-zinc-300"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 14L8 12V20L3 18V14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M8 12L15 9V17L8 20V12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 9L21 7V15L15 17V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 9L8 6L3 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                        One to Many
                    </h2>
                    <p className="text-lg text-zinc-400 mt-2">Generate multiple photorealistic views of your product/apparel.</p>
                </div>
                {view === 'config' ? renderConfigView() : renderResultView()}
            </motion.div>
        </main>
    );
}
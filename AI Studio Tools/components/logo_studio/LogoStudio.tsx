import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { ArrowLeft, UploadCloud, Image as ImageIcon, Wand2, Loader2, Download, Trash2, Scaling, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';
import JSZip from 'jszip';

interface LogoStudioProps {
    onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

const LogoStudio: React.FC<LogoStudioProps> = ({ onBack }) => {
    const [logo, setLogo] = useState<string | null>(null);
    const [targetImages, setTargetImages] = useState<{ id: string, base64: string, name: string }[]>([]);
    const [scale, setScale] = useState(20); // as percentage
    const [opacity, setOpacity] = useState(80); // as percentage
    const [position, setPosition] = useState({ x: 50, y: 50 }); // as percentage of container for center
    
    const [isProcessing, setIsProcessing] = useState(false);
    const [processingProgress, setProcessingProgress] = useState(0);

    const previewContainerRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);

    const interaction = useRef({
        type: null as 'drag' | 'resize' | null,
        startX: 0,
        startY: 0,
        startLeft: 0,
        startTop: 0,
        startWidth: 0,
        startHeight: 0,
    });

    const onLogoDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const base64 = await fileToBase64(acceptedFiles[0]);
            setLogo(base64);
        }
    }, []);

    const onTargetImagesDrop = useCallback(async (acceptedFiles: File[]) => {
        const newImages = await Promise.all(
            acceptedFiles.map(async (file) => ({
                id: `${file.name}-${Date.now()}`,
                base64: await fileToBase64(file),
                name: file.name,
            }))
        );
        setTargetImages((prev) => [...prev, ...newImages]);
    }, []);
    
    const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({ onDrop: onLogoDrop, accept: { 'image/*': [] }, multiple: false });
    const { getRootProps: getTargetRootProps, getInputProps: getTargetInputProps, isDragActive: isTargetDragActive } = useDropzone({ onDrop: onTargetImagesDrop, accept: { 'image/*': [] }, multiple: true });

    const removeTargetImage = (id: string) => {
        setTargetImages(prev => prev.filter(img => img.id !== id));
    };

    const handleInteractionStart = (e: React.MouseEvent<HTMLDivElement>, type: 'drag' | 'resize') => {
        e.preventDefault();
        e.stopPropagation();

        if (!logoRef.current || !previewContainerRef.current) return;

        const logoRect = logoRef.current.getBoundingClientRect();
        
        interaction.current = {
            type,
            startX: e.clientX,
            startY: e.clientY,
            startLeft: logoRect.left,
            startTop: logoRect.top,
            startWidth: logoRect.width,
            startHeight: logoRect.height,
        };

        window.addEventListener('mousemove', handleInteractionMove);
        window.addEventListener('mouseup', handleInteractionEnd);
    };

    const handleInteractionMove = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!interaction.current.type || !previewContainerRef.current || !logoRef.current) return;

        const dx = e.clientX - interaction.current.startX;
        const dy = e.clientY - interaction.current.startY;
        const previewRect = previewContainerRef.current.getBoundingClientRect();

        if (interaction.current.type === 'drag') {
            const newLeft = interaction.current.startLeft + dx;
            const newTop = interaction.current.startTop + dy;

            const xPercent = ((newLeft - previewRect.left) / previewRect.width) * 100;
            const yPercent = ((newTop - previewRect.top) / previewRect.height) * 100;
            
            setPosition({
                x: Math.max(0, Math.min(100 - (logoRef.current.offsetWidth / previewRect.width * 100), xPercent)),
                y: Math.max(0, Math.min(100 - (logoRef.current.offsetHeight / previewRect.height * 100), yPercent))
            });

        } else if (interaction.current.type === 'resize') {
            const newWidth = Math.max(20, interaction.current.startWidth + dx);
            const aspectRatio = interaction.current.startWidth / interaction.current.startHeight;
            const newHeight = newWidth / aspectRatio;

            const newScale = (newWidth / previewRect.width) * 100;
            setScale(Math.round(newScale));
            
            // Adjust position to keep it within bounds when resizing from bottom-right
            const xPercent = (logoRef.current.offsetLeft / previewRect.width) * 100;
            const yPercent = (logoRef.current.offsetTop / previewRect.height) * 100;
             setPosition({
                x: Math.max(0, Math.min(100 - newScale, xPercent)),
                y: Math.max(0, Math.min(100 - (newHeight / previewRect.height * 100), yPercent))
            });
        }
    }, []);

    const handleInteractionEnd = useCallback(() => {
        interaction.current.type = null;
        window.removeEventListener('mousemove', handleInteractionMove);
        window.removeEventListener('mouseup', handleInteractionEnd);
    }, [handleInteractionMove]);

    useEffect(() => {
        return () => {
            window.removeEventListener('mousemove', handleInteractionMove);
            window.removeEventListener('mouseup', handleInteractionEnd);
        };
    }, [handleInteractionMove, handleInteractionEnd]);


    const processAndDownload = async () => {
        if (!logo || targetImages.length === 0) return;

        setIsProcessing(true);
        setProcessingProgress(0);

        const zip = new JSZip();

        for (let i = 0; i < targetImages.length; i++) {
            const target = targetImages[i];
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) continue;

            const targetImg = new Image();
            targetImg.src = target.base64;
            await new Promise(resolve => targetImg.onload = resolve);
            
            const logoImg = new Image();
            logoImg.src = logo;
            await new Promise(resolve => logoImg.onload = resolve);
            
            canvas.width = targetImg.width;
            canvas.height = targetImg.height;
            
            ctx.drawImage(targetImg, 0, 0);

            const logoAspectRatio = logoImg.width / logoImg.height;
            const logoWidth = canvas.width * (scale / 100);
            const logoHeight = logoWidth / logoAspectRatio;
            
            const logoX = canvas.width * (position.x / 100);
            const logoY = canvas.height * (position.y / 100);

            ctx.globalAlpha = opacity / 100;
            ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight);
            
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
            if (blob) {
                zip.file(target.name, blob);
            }
            setProcessingProgress(((i + 1) / targetImages.length) * 100);
        }

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipBlob);
        link.download = 'watermarked-images.zip';
        link.click();
        URL.revokeObjectURL(link.href);

        setIsProcessing(false);
    };

    const previewImage = targetImages[0]?.base64;

    return (
        <main className="bg-zinc-950 text-zinc-200 min-h-screen w-full flex flex-col items-center p-4 relative noise-overlay font-sans">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-7xl mx-auto flex flex-col z-10 flex-grow">
                <header className="w-full flex justify-between items-center py-4 mb-6">
                    <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800">
                        <ArrowLeft size={16} /> Back to Tools
                    </button>
                </header>
                <div className="text-center mb-10">
                    <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 mb-2 flex items-center justify-center gap-4 tracking-tight">
                        Logo Studio
                    </h2>
                    <p className="text-lg text-zinc-400 mt-2">Apply your logo to images in bulk.</p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-grow">
                    {/* Controls Panel */}
                    <div className="lg:col-span-1 bg-zinc-900/50 border border-white/10 rounded-xl p-6 flex flex-col gap-6 h-fit">
                        <div>
                            <h3 className="font-bold text-lg text-zinc-100 mb-3">1. Your Logo</h3>
                            <div {...getLogoRootProps()} className={`cursor-pointer aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors ${isLogoDragActive ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}>
                                <input {...getLogoInputProps()} />
                                {logo ? (
                                    <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-4" />
                                ) : (
                                    <>
                                        <UploadCloud className="h-8 w-8 text-zinc-500 mb-2" />
                                        <span className="text-zinc-400 font-semibold">Upload Logo</span>
                                        <span className="text-zinc-500 text-sm mt-1">PNG with transparency recommended</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-zinc-100 mb-3">2. Placement</h3>
                             <p className="text-sm text-zinc-400 mb-4 flex items-center gap-2"><MousePointer2 size={16}/> Drag and resize the logo in the preview window.</p>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="scale" className="text-sm font-medium">Scale</label>
                                        <span className="text-sm font-mono">{Math.round(scale)}%</span>
                                    </div>
                                    <input type="range" id="scale" min="1" max="100" value={scale} onChange={(e) => setScale(Number(e.target.value))} className="w-full" />
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label htmlFor="opacity" className="text-sm font-medium">Opacity</label>
                                        <span className="text-sm font-mono">{opacity}%</span>
                                    </div>
                                    <input type="range" id="opacity" min="0" max="100" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-full" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Main Area */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6">
                             <h3 className="font-bold text-lg text-zinc-100 mb-3">3. Target Images</h3>
                             <div {...getTargetRootProps()} className={`cursor-pointer p-8 flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors mb-4 ${isTargetDragActive ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 hover:border-zinc-600"}`}>
                                <input {...getTargetInputProps()} />
                                <UploadCloud className="h-8 w-8 text-zinc-500 mb-2" />
                                <span className="text-zinc-400 font-semibold">Drop images here or click to upload</span>
                            </div>
                            {targetImages.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 max-h-40 overflow-y-auto pr-2">
                                    {targetImages.map(img => (
                                        <div key={img.id} className="relative group aspect-square">
                                            <img src={img.base64} alt="Target" className="w-full h-full object-cover rounded-md" />
                                            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-md">
                                                <button onClick={() => removeTargetImage(img.id)} className="p-2 text-white hover:text-red-400"><Trash2 size={18} /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 flex-grow flex flex-col">
                             <h3 className="font-bold text-lg text-zinc-100 mb-3">Preview</h3>
                             <div className="flex-grow bg-black rounded-lg relative flex items-center justify-center overflow-hidden">
                                {previewImage ? (
                                    <div ref={previewContainerRef} className="relative inline-block" style={{lineHeight: 0}}>
                                        <img src={previewImage} alt="Preview" className="max-w-full max-h-full object-contain block" />
                                        {logo && (
                                            <div
                                                ref={logoRef}
                                                className="absolute cursor-move group select-none"
                                                style={{
                                                    top: `${position.y}%`,
                                                    left: `${position.x}%`,
                                                    width: `${scale}%`,
                                                    opacity: opacity / 100,
                                                }}
                                                onMouseDown={(e) => handleInteractionStart(e, 'drag')}
                                            >
                                                <img src={logo} alt="Logo" className="w-full h-full object-contain pointer-events-none" />
                                                <div 
                                                    className="absolute -right-1 -bottom-1 w-4 h-4 bg-violet-500 rounded-full border-2 border-zinc-900 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    onMouseDown={(e) => handleInteractionStart(e, 'resize')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-zinc-500 flex flex-col items-center">
                                        <ImageIcon size={48} />
                                        <p className="mt-2">Upload a target image to see a preview</p>
                                    </div>
                                )}
                             </div>
                        </div>
                        
                        <div className="mt-auto pt-6">
                            <button
                                onClick={processAndDownload}
                                disabled={isProcessing || !logo || targetImages.length === 0}
                                className="w-full flex items-center justify-center gap-2 text-white font-semibold text-base py-3 px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-button-glow"
                            >
                                {isProcessing ? <Loader2 className="animate-spin" /> : <Download size={18} />}
                                {isProcessing ? `Processing... (${Math.round(processingProgress)}%)` : `Process & Download ${targetImages.length} Images`}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    );
};

export default LogoStudio;
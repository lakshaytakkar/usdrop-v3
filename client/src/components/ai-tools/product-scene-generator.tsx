

import React, { useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Loader2, Download, RotateCcw, Wand2 } from 'lucide-react';
import { geminiService } from '@/lib/services/gemini-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import JSZip from 'jszip';
import AILoadingState from '@/components/kokonutui/ai-loading';

type ViewState = 'idle' | 'generating' | 'results';

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
        e.preventDefault(); 
        e.stopPropagation(); 
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) onImageUpload(e.dataTransfer.files[0]);
    };
    const handleDragEvents = (e: DragEvent<HTMLElement>, enter: boolean) => {
        e.preventDefault(); 
        e.stopPropagation(); 
        setIsDragOver(enter);
    };

    return (
        <label 
            htmlFor="product-upload" 
            className={cn(
                "cursor-pointer aspect-[4/5] w-full max-w-md flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors",
                isDragOver ? "border-primary bg-primary/10" : "border-border hover:border-foreground/20 bg-muted"
            )} 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()} 
            onDragEnter={(e) => handleDragEvents(e, true)} 
            onDragLeave={(e) => handleDragEvents(e, false)}
        >
            <UploadCloud className="h-6 w-6 text-foreground mb-2" />
            <span className="text-xs font-medium text-foreground">Drop your image here</span>
            <span className="text-xs text-muted-foreground mt-1">or click to upload</span>
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
        <Card className="bg-card border-border">
            <CardContent className="p-4">
                <h3 className="font-semibold text-sm mb-2 text-center text-foreground">{title}</h3>
                <div className="aspect-[4/5] w-full bg-muted rounded-lg border border-border flex items-center justify-center text-muted-foreground text-center relative overflow-hidden group">
                    {status === 'pending' && <Loader2 className="animate-spin h-8 w-8 text-foreground" />}
                    {status === 'error' && (
                        <div className="p-4 text-center">
                            <p className="text-sm text-destructive mb-2 font-semibold">Error</p>
                            <p className="text-xs text-muted-foreground mb-4">{error}</p>
                            <Button onClick={onRetry} variant="destructive" size="sm" className="text-xs">Retry</Button>
                        </div>
                    )}
                    {status === 'done' && imageUrl && (
                        <>
                            <img src={imageUrl} alt={title} className="w-full h-full object-cover rounded-lg" />
                            <Button
                                size="icon"
                                variant="secondary"
                                className="absolute top-2 right-2 bg-background hover:bg-muted border border-border transition-all duration-200 opacity-0 group-hover:opacity-100"
                                onClick={onDownload}
                            >
                                <Download className="h-4 w-4 text-foreground" />
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function ProductSceneGenerator() {
    const [viewState, setViewState] = useState<ViewState>('idle');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [selectedAngles, setSelectedAngles] = useState<string[]>([]);
    const [generatedImages, setGeneratedImages] = useState<Record<string, GeneratedImageState>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<string>('');
    const [loadingProgress, setLoadingProgress] = useState<number>(0);

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

        setViewState('generating');
        setIsGenerating(true);
        setLoadingStep('Preparing images...');
        setLoadingProgress(10);

        const initialStates: Record<string, GeneratedImageState> = {};
        selectedAngles.forEach(id => {
            initialStates[id] = { status: 'pending' };
        });
        setGeneratedImages(initialStates);

        // Simulate progress update
        setTimeout(() => {
            setLoadingStep('Generating product images...');
            setLoadingProgress(30);
        }, 500);

        const concurrencyLimit = 3;
        const queue = [...selectedAngles];
        let completed = 0;
        const totalImages = selectedAngles.length;

        const processAngle = async (angleId: string) => {
            try {
                setLoadingStep(`Generating product images (${completed + 1}/${totalImages})...`);
                setLoadingProgress(30 + (completed / totalImages) * 50);
                
                await handleGenerateSingle(angleId);
                completed++;

                if (completed === totalImages) {
                    setLoadingStep('Processing results...');
                    setLoadingProgress(85);
                    setTimeout(() => {
                        setLoadingStep('Almost done...');
                        setLoadingProgress(95);
                        setTimeout(() => {
                            setLoadingProgress(100);
                            setIsGenerating(false);
                            setViewState('results');
                        }, 300);
                    }, 500);
                }
            } catch (err) {
                completed++;
                if (completed === totalImages) {
                    setIsGenerating(false);
                    setViewState('results');
                }
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (queue.length > 0) {
                const angleId = queue.shift();
                if (angleId) {
                    await processAngle(angleId);
                }
            }
        });

        await Promise.all(workers);
    };

    const handleStartOver = () => {
        setViewState('idle');
        setUploadedImage(null);
        setSelectedAngles([]);
        setGeneratedImages({});
        setLoadingStep('');
        setLoadingProgress(0);
    };

    const handleDownload = (url: string | undefined, filename: string) => {
        if (!url) return;
        const link = document.createElement('a');
        link.href = url;
        link.download = `product-scene-${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            const imagesToZip: Array<{ url: string; filename: string }> = [];
            
            // Add original image if available
            if (uploadedImage) {
                imagesToZip.push({ url: uploadedImage, filename: 'original' });
            }

            // Add all generated images
            Object.entries(generatedImages).forEach(([angleId, state]) => {
                if (state.status === 'done' && state.url) {
                    const angle = ANGLE_OPTIONS.find(a => a.id === angleId);
                    imagesToZip.push({ 
                        url: state.url, 
                        filename: angle ? angle.label.toLowerCase().replace(/\s+/g, '-') : angleId 
                    });
                }
            });

            if (imagesToZip.length === 0) {
                alert('No images to download.');
                setIsDownloading(false);
                return;
            }

            const zip = new JSZip();

            for (let i = 0; i < imagesToZip.length; i++) {
                const { url, filename } = imagesToZip[i];
                const match = url.match(/^data:(image\/(?:png|jpeg|webp));base64,(.*)$/);
                if (match) {
                    const mimeType = match[1];
                    const base64Data = match[2];
                    const extension = mimeType.split('/')[1] || 'jpg';
                    zip.file(`product-scene-${filename}-${i + 1}.${extension}`, base64Data, { base64: true });
                } else {
                    // If URL is not base64, fetch it
                    try {
                        const response = await fetch(url);
                        const blob = await response.blob();
                        const extension = blob.type.split('/')[1] || 'jpg';
                        zip.file(`product-scene-${filename}-${i + 1}.${extension}`, blob);
                    } catch (error) {
                        console.error(`Failed to fetch image ${filename}:`, error);
                    }
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'product-scene-images.zip';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Failed to create or download ZIP:", error);
            alert('Failed to create ZIP file.');
        } finally {
            setIsDownloading(false);
        }
    };

    // Loading screen - contained in content area
    if (viewState === 'generating') {
        return (
            <div className="w-full max-w-7xl mx-auto flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <AILoadingState />
            </div>
        );
    }

    // Results view - full viewport
    if (viewState === 'results') {
        return (
            <div className="h-screen flex flex-col bg-background">
                {/* Action buttons header */}
                <div className="flex-shrink-0 border-b border-border bg-card p-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-foreground">Generated Results</h2>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleStartOver}
                                className={cn(
                                    "group relative h-10 px-4 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer",
                                    "flex items-center justify-center gap-2"
                                )}
                            >
                                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                                <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                                <span className="relative flex items-center justify-center gap-2 z-10">
                                    <RotateCcw className="h-4 w-4 text-white" />
                                    Start Over
                                </span>
                            </button>
                            <button
                                onClick={handleDownloadAll}
                                disabled={isDownloading || Object.values(generatedImages).filter(img => img.status === 'done').length === 0}
                                className={cn(
                                    "group relative h-10 px-4 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer",
                                    "flex items-center justify-center gap-2",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                                <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                                <span className="relative flex items-center justify-center gap-2 z-10">
                                    {isDownloading ? (
                                        <>
                                            <Loader2 className="animate-spin h-4 w-4 text-white" />
                                            Creating ZIP...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 text-white" />
                                            Download ({Object.values(generatedImages).filter(img => img.status === 'done').length + (uploadedImage ? 1 : 0)})
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results grid - scrollable */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {uploadedImage && (
                                <ResultCard 
                                    title="Original" 
                                    imageUrl={uploadedImage} 
                                    status='done' 
                                    onRetry={() => {}} 
                                    onDownload={() => handleDownload(uploadedImage, 'original')} 
                                />
                            )}
                            {Object.entries(generatedImages).map(([angleId, state]: [string, GeneratedImageState]) => {
                                const angle = ANGLE_OPTIONS.find(a => a.id === angleId);
                                if (!angle) return null;
                                return (
                                    <ResultCard 
                                        key={angleId} 
                                        title={angle.label} 
                                        imageUrl={state.url} 
                                        status={state.status} 
                                        error={state.error} 
                                        onRetry={() => handleGenerateSingle(angleId)} 
                                        onDownload={() => handleDownload(state.url, angleId)} 
                                    />
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Idle view - Main layout
    const renderConfigView = () => (
        <div className="w-full grid md:grid-cols-2 gap-4 h-[calc(100vh-280px)] max-h-[calc(100vh-280px)]">
            <Card className="bg-card border-border h-full flex flex-col max-h-full overflow-hidden">
                <CardContent className="p-4 h-full flex flex-col overflow-hidden">
                    <h3 className="font-bold text-sm mb-3 text-foreground flex-shrink-0">1. Upload Your Product</h3>
                    <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
                        {uploadedImage ? (
                            <div className="relative group w-full h-full max-h-full flex items-center justify-center">
                                <div className="relative w-full max-w-sm aspect-[4/5] max-h-full rounded-md overflow-hidden border border-border">
                                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                    <Button 
                                        onClick={() => setUploadedImage(null)} 
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                        aria-label="Remove image"
                                    >
                                        ×
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Uploader onImageUpload={handleImageUpload} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <Card className="bg-card border-border h-full flex flex-col max-h-full overflow-hidden">
                <CardContent className="p-4 h-full flex flex-col overflow-hidden">
                    <h3 className="font-bold text-sm mb-2 text-foreground flex-shrink-0">2. Select Angles</h3>
                    <p className="text-muted-foreground text-xs mb-2 flex-shrink-0">Choose one or more angles to generate.</p>
                    <div className="flex flex-wrap gap-1.5 flex-1 min-h-0 overflow-y-auto pb-2">
                        {ANGLE_OPTIONS.map(angle => (
                            <Button
                                key={angle.id} 
                                onClick={() => toggleAngle(angle.id)} 
                                variant={selectedAngles.includes(angle.id) ? "default" : "outline"}
                                size="sm"
                                className="text-xs"
                                disabled={!uploadedImage}
                            >
                                {angle.label}
                            </Button>
                        ))}
                    </div>
                    <button
                        onClick={handleGenerateAll} 
                        disabled={!uploadedImage || selectedAngles.length === 0 || isGenerating}
                        className={cn(
                            "group relative w-full h-10 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer mt-3 flex-shrink-0",
                            "flex items-center justify-center gap-2",
                            "disabled:opacity-50 disabled:cursor-not-allowed"
                        )}
                    >
                        <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                        <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                        <span className="relative flex items-center justify-center gap-2 z-10">
                            <Wand2 className="h-4 w-4 text-white" />
                            {isGenerating ? "Generating..." : `Generate (${selectedAngles.length})`}
                        </span>
                    </button>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
            {renderConfigView()}
        </div>
    );
}


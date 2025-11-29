"use client"

import React, { useState, DragEvent, ChangeEvent } from 'react';
import { UploadCloud, Loader2, Download, RotateCcw } from 'lucide-react';
import { geminiService } from '@/lib/services/gemini-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

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
                isDragOver ? "border-primary bg-primary/10" : "border-muted bg-muted/50 hover:border-primary/50"
            )} 
            onDrop={handleDrop} 
            onDragOver={(e) => e.preventDefault()} 
            onDragEnter={(e) => handleDragEvents(e, true)} 
            onDragLeave={(e) => handleDragEvents(e, false)}
        >
            <UploadCloud className="h-10 w-10 text-muted-foreground mb-4" />
            <span className="text-sm font-medium">Drop your image here</span>
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
        <Card>
            <CardContent className="p-4">
                <h3 className="font-semibold text-base mb-2 text-center">{title}</h3>
                <div className="aspect-[4/5] w-full bg-muted rounded-lg border flex items-center justify-center text-muted-foreground text-center relative overflow-hidden group">
                    {status === 'pending' && <Loader2 className="animate-spin h-10 w-10 text-primary" />}
                    {status === 'error' && (
                        <div className="p-4 text-destructive">
                            <p className="font-semibold mb-2">Generation Failed</p>
                            <p className="text-xs text-muted-foreground mb-4">{error}</p>
                            <Button onClick={onRetry} variant="destructive" size="sm">Retry</Button>
                        </div>
                    )}
                    {status === 'done' && imageUrl && (
                        <>
                            <img src={imageUrl} alt={title} className="w-full h-full object-contain" />
                            <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button onClick={onDownload} size="icon" variant="secondary" aria-label="Download">
                                    <Download className="h-4 w-4" />
                                </Button>
                                <Button onClick={onRetry} size="icon" variant="secondary" aria-label="Regenerate">
                                    <RotateCcw className="h-4 w-4" />
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export function ProductSceneGenerator() {
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
        link.download = `product-scene-${filename}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    const generateButtonText = isGenerating ? "Generating..." : `Generate (${selectedAngles.length})`;

    const renderConfigView = () => (
        <div className="w-full grid md:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col items-center gap-4">
                <h3 className="font-bold text-xl mb-1">1. Upload Your Product</h3>
                {uploadedImage ? (
                    <div className="relative group aspect-[4/5] w-full max-w-sm rounded-md overflow-hidden">
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
                ) : (
                    <Uploader onImageUpload={handleImageUpload} />
                )}
            </div>
            <Card>
                <CardContent className="p-6">
                    <div className={cn(!uploadedImage && "opacity-50 pointer-events-none")}>
                        <h3 className="font-bold text-xl mb-2">2. Select Angles</h3>
                        <p className="text-muted-foreground text-sm mb-4">Choose one or more angles to generate.</p>
                        <div className="flex flex-wrap gap-2">
                            {ANGLE_OPTIONS.map(angle => (
                                <Button
                                    key={angle.id} 
                                    onClick={() => toggleAngle(angle.id)} 
                                    variant={selectedAngles.includes(angle.id) ? "default" : "outline"}
                                    size="sm"
                                >
                                    {angle.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <Button 
                        onClick={handleGenerateAll} 
                        disabled={!uploadedImage || selectedAngles.length === 0 || isGenerating} 
                        className="w-full mt-4"
                        size="lg"
                    >
                        {generateButtonText}
                    </Button>
                </CardContent>
            </Card>
        </div>
    );

    const renderResultView = () => (
        <div className="w-full flex flex-col items-center gap-8">
            <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                <ResultCard 
                    title="Original" 
                    imageUrl={uploadedImage!} 
                    status='done' 
                    onRetry={() => {}} 
                    onDownload={() => handleDownload(uploadedImage, 'original')} 
                />
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
            <Button onClick={handleStartOver} variant="outline" size="lg">
                Start Over
            </Button>
        </div>
    );
    
    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col items-center">
            {view === 'config' ? renderConfigView() : renderResultView()}
        </div>
    );
}


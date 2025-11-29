"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Download, X, Wand2, User, Shirt, Image as ImageIcon, Hash, Sparkles, RotateCcw, Smartphone, Square, Monitor, Tv } from 'lucide-react';
import { geminiService } from '@/lib/services/gemini-service';
import { resizeImageToAspectRatio } from '@/lib/utils/image-resizer';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MODELS_LIBRARY } from '../../../AI Studio Tools/constants/apparel';
import type { AIModel } from '../../../AI Studio Tools/types';

const ASPECT_RATIOS = [
    { id: '4:5', label: 'Portrait', icon: Smartphone },
    { id: '1:1', label: 'Square', icon: Square },
    { id: '16:9', label: 'Landscape', icon: Monitor },
    { id: '9:16', label: 'Stories', icon: Tv },
];

const NUMBER_OF_IMAGES = [1, 2, 4, 6, 8];

const ECOMMERCE_PACK_OPTIONS = [
    { id: 'off', label: 'Off' },
    { id: 'essential', label: 'Essential' },
    { id: 'plus', label: 'Plus' },
    { id: 'dynamic', label: 'Dynamic' },
    { id: 'editorial', label: 'Editorial' },
    { id: 'pov', label: 'POV' },
];

type ImageStatus = 'pending' | 'done' | 'error';
type ViewState = 'idle' | 'generating' | 'results';

interface GeneratedImage {
    status: ImageStatus;
    url?: string;
    error?: string;
}

const MAX_MODEL_IMAGES = 30;

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};


export function ModelStudio() {
    const [uploadedModel, setUploadedModel] = useState<string | null>(null);
    const [apparelImages, setApparelImages] = useState<string[]>([]);
    const [viewState, setViewState] = useState<ViewState>('idle');
    
    // Load user-created models from localStorage
    const loadUserModels = (): AIModel[] => {
        try {
            const saved = localStorage.getItem('aiStudioMyModels');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (error) {
            console.error("Failed to load user models from localStorage", error);
        }
        return [];
    };

    // Initialize with empty array, will be populated by useEffect
    const [localLibrary, setLocalLibrary] = useState<string[]>([]);

    // Configuration settings
    const [aspectRatio, setAspectRatio] = useState<string>('4:5');
    const [numberOfImages, setNumberOfImages] = useState<number>(1);
    const [ecommercePack, setEcommercePack] = useState<string>('off');

    // Generation state
    const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<string>('');
    const [loadingProgress, setLoadingProgress] = useState<number>(0);

    // Helper to get model info by thumbnail URL
    const getModelByThumbnail = (thumbnail: string): AIModel | null => {
        // First check user-created models
        const userModels = loadUserModels();
        const userModel = userModels.find(m => m.thumbnail === thumbnail);
        if (userModel) return userModel;
        
        // Then check library models
        const libraryModel = MODELS_LIBRARY.find(m => m.thumbnail === thumbnail);
        if (libraryModel) return libraryModel;
        
        return null;
    };

    // Load and sync user models - keep only last 12
    const updateModelLibrary = useCallback(() => {
        try {
            const userModels = loadUserModels();
            if (userModels.length === 0) {
                setLocalLibrary([]);
                return;
            }
            // Sort by ID (timestamp) to get most recent first
            const sortedModels = [...userModels].sort((a, b) => {
                const aTime = parseInt(a.id.split('-').pop() || '0');
                const bTime = parseInt(b.id.split('-').pop() || '0');
                return bTime - aTime; // Most recent first
            });
            // Take only the last 12 user-created models
            const last12Models = sortedModels.slice(0, 12);
            const last12Thumbnails = last12Models.map(m => m.thumbnail);
            setLocalLibrary(last12Thumbnails);
        } catch (error) {
            console.error("Error loading models:", error);
            setLocalLibrary([]);
        }
    }, []);

    // Load models on mount
    useEffect(() => {
        updateModelLibrary();
    }, [updateModelLibrary]);

    // Listen for changes to user models
    useEffect(() => {
        // Listen for storage events (from other tabs/components)
        const handleStorageChange = () => {
            updateModelLibrary();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // Also check periodically for same-tab updates
        const interval = setInterval(updateModelLibrary, 2000);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, [updateModelLibrary]);

    const onModelDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const base64 = await fileToBase64(acceptedFiles[0]);
            setUploadedModel(base64);
            setLocalLibrary(prev => {
                const filtered = prev.filter(img => img !== base64);
                const newLibrary = [base64, ...filtered];
                return newLibrary.slice(0, MAX_MODEL_IMAGES);
            });
        }
    }, []);

    const onApparelDrop = useCallback(async (acceptedFiles: File[]) => {
        const newImages = await Promise.all(
            acceptedFiles.map(file => fileToBase64(file))
        );
        setApparelImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps: getApparelRootProps, getInputProps: getApparelInputProps, isDragActive: isApparelDragActive } = useDropzone({
        onDrop: onApparelDrop,
        accept: { 'image/*': [] },
        multiple: true
    });

    const handleSelectFromLibrary = (imageUrl: string) => {
        // If clicking the same model, deselect it (single selection only)
        if (uploadedModel === imageUrl) {
            setUploadedModel(null);
        } else {
            // Select the new model (this automatically deselects the previous one)
            setUploadedModel(imageUrl);
        }
    };

    const handleDeleteFromLibrary = (imageUrlToDelete: string, event: React.MouseEvent) => {
        event.stopPropagation();
        setLocalLibrary(prev => prev.filter(img => img !== imageUrlToDelete));
        if (uploadedModel === imageUrlToDelete) {
            setUploadedModel(null);
        }
    };

    const removeApparelImage = (index: number) => {
        setApparelImages(prev => prev.filter((_, i) => i !== index));
    };

    const constructApiPayload = async (): Promise<{ finalPrompt: string, imageUrls: string[] }> => {
        if (!uploadedModel || apparelImages.length === 0) {
            throw new Error("Model and apparel images are required.");
        }

        const resizedModelImage = await resizeImageToAspectRatio(uploadedModel, aspectRatio as '1:1' | '4:5' | '16:9' | '9:16' | '3:4');
        const imageUrls: string[] = [resizedModelImage];

        // Add apparel images
        for (const apparelImg of apparelImages) {
            const resizedApparel = await resizeImageToAspectRatio(apparelImg, aspectRatio as '1:1' | '4:5' | '16:9' | '9:16' | '3:4');
            imageUrls.push(resizedApparel);
        }

        const identityLockRule = `
**PRIMARY DIRECTIVE: ABSOLUTE IDENTITY PRESERVATION (NON-NEGOTIABLE)**
Your single most important, critical, and unbreakable task is to perfectly preserve the identity of the person from the first image. The final generated face MUST be a photorealistic, 100% identical replica. Do not change their facial features, age, or structure. This rule overrides all other instructions.
`;

        const basePrompt = `A photorealistic fashion photograph of the person from the first image wearing the apparel items from the subsequent images. The person should be standing in a confident, natural pose. The clothing should fit perfectly and look realistic with proper fabric drape, wrinkles, and shadows. Maintain professional studio lighting and a clean background.`;

        const promptFragments: string[] = [];

        let aspectRatioDescription = '';
        switch (aspectRatio) {
            case '9:16': aspectRatioDescription = 'a tall, vertical portrait (9:16)'; break;
            case '16:9': aspectRatioDescription = 'a wide, horizontal landscape (16:9)'; break;
            case '4:5': aspectRatioDescription = 'a standard portrait (4:5)'; break;
            default: aspectRatioDescription = 'a square (1:1)'; break;
        }
        promptFragments.push(`The final output MUST be ${aspectRatioDescription} aspect ratio.`);

        const finalPrompt = identityLockRule + promptFragments.join(' ') + ' ' + basePrompt;

        return { finalPrompt, imageUrls };
    };

    const handleGenerate = async () => {
        if (!uploadedModel || apparelImages.length === 0) return;

        setViewState('generating');
        setIsGenerating(true);
        setLoadingStep('Preparing images...');
        setLoadingProgress(10);

        const imagesToGenerate = numberOfImages;
        const initialImages: GeneratedImage[] = Array(imagesToGenerate).fill(null).map(() => ({ status: 'pending' }));
        setGeneratedImages(initialImages);

        // Simulate progress updates
        setTimeout(() => {
            setLoadingStep('Generating model photos...');
            setLoadingProgress(30);
        }, 500);

        const concurrencyLimit = 2;
        const queue = Array.from({ length: imagesToGenerate }, (_, i) => i);
        let completed = 0;

        const processImage = async (index: number) => {
            try {
                const { finalPrompt, imageUrls } = await constructApiPayload();
                setLoadingStep(`Generating model photos (${completed + 1}/${imagesToGenerate})...`);
                setLoadingProgress(30 + (completed / imagesToGenerate) * 50);
                
                const resultUrl = await geminiService.generateStyledImage(finalPrompt, imageUrls);
                completed++;
                
                setGeneratedImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = { status: 'done', url: resultUrl };
                    return newImages;
                });

                if (completed === imagesToGenerate) {
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
                const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
                completed++;
                setGeneratedImages(prev => {
                    const newImages = [...prev];
                    newImages[index] = { status: 'error', error: errorMessage };
                    return newImages;
                });

                if (completed === imagesToGenerate) {
                    setIsGenerating(false);
                    setViewState('results');
                }
            }
        };

        const workers = Array(concurrencyLimit).fill(null).map(async () => {
            while (queue.length > 0) {
                const index = queue.shift();
                if (index !== undefined) {
                    await processImage(index);
                }
            }
        });

        await Promise.all(workers);
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            const imagesToZip = generatedImages.filter(img => img.status === 'done' && img.url);

            if (imagesToZip.length === 0) {
                alert('No images generated yet.');
                setIsDownloading(false);
                return;
            }

            const zip = new JSZip();

            for (let i = 0; i < imagesToZip.length; i++) {
                const image = imagesToZip[i];
                if (image.url) {
                    const match = image.url.match(/^data:(image\/(?:png|jpeg|webp));base64,(.*)$/);
                    if (match) {
                        const mimeType = match[1];
                        const base64Data = match[2];
                        const extension = mimeType.split('/')[1] || 'jpg';
                        zip.file(`model-studio-${i + 1}.${extension}`, base64Data, { base64: true });
                    }
                }
            }

            const content = await zip.generateAsync({ type: "blob" });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(content);
            link.download = 'model-studio-photos.zip';
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

    const handleStartOver = () => {
        setViewState('idle');
        setGeneratedImages([]);
        setUploadedModel(null);
        setApparelImages([]);
        setLoadingStep('');
        setLoadingProgress(0);
    };

    // Loading overlay
    if (viewState === 'generating') {
        return (
            <div className="w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
                <div className="relative">
                    {/* Dimmed main content */}
                    <div className="opacity-30 pointer-events-none">
                        <div className="grid grid-cols-[2fr_2fr_1fr] gap-4 mb-4">
                            {/* Section 1: Select Model */}
                            <Card className="bg-white border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <User className="h-4 w-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-foreground">Select Model</h3>
                                    </div>
                                    {localLibrary.length > 0 ? (
                                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5">
                                            {localLibrary.slice(0, 3).map((imgUrl, index) => (
                                                <div key={index} className="aspect-[2/3] rounded-lg overflow-hidden bg-gray-100" />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="h-[200px] bg-gray-50 rounded" />
                                    )}
                                </CardContent>
                            </Card>

                            {/* Section 2: Upload Apparel */}
                            <Card className="bg-white border-gray-200">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-2 mb-3">
                                        <Shirt className="h-4 w-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-foreground">Upload Apparel</h3>
                                    </div>
                                    <div className="h-[200px] bg-gray-50 rounded-lg border-2 border-dashed border-gray-300" />
                                </CardContent>
                            </Card>

                            {/* Section 3: Generate Button */}
                            <Card className="bg-white border-gray-200">
                                <CardContent className="p-4 flex items-center justify-center h-full">
                                    <Button
                                        size="lg"
                                        disabled
                                        className="w-full bg-primary hover:bg-primary/90 text-white"
                                    >
                                        <Wand2 className="mr-2" />
                                        Generate
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Loading overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
                        <div className="text-center space-y-4 p-8">
                            <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                            <div className="space-y-2">
                                <p className="text-lg font-semibold text-foreground">{loadingStep}</p>
                                <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-300 ease-in-out"
                                        style={{ width: `${loadingProgress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-muted-foreground">{Math.round(loadingProgress)}%</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Results view
    if (viewState === 'results') {
        return (
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 transition-all duration-300 ease-in-out">
                <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
                    {/* Results grid spans first two columns */}
                    <div className="col-span-2">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {generatedImages.map((image, index) => (
                                <Card key={index} className="bg-white border-gray-200 transition-all duration-300 ease-in-out hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className="aspect-[4/5] w-full bg-gray-50 rounded-lg flex items-center justify-center relative">
                                            {image.status === 'pending' && <Loader2 className="animate-spin h-8 w-8 text-primary" />}
                                            {image.status === 'error' && (
                                                <div className="text-center p-4">
                                                    <p className="text-sm text-destructive mb-2">Error</p>
                                                    <p className="text-xs text-muted-foreground">{image.error}</p>
                                                </div>
                                            )}
                                            {image.status === 'done' && image.url && (
                                                <>
                                                    <img src={image.url} alt={`Generated ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                                    <Button
                                                        size="icon"
                                                        variant="secondary"
                                                        className="absolute top-2 right-2 bg-white hover:bg-gray-100 border border-gray-300 transition-all duration-200"
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = image.url!;
                                                            link.download = `model-studio-${index + 1}.png`;
                                                            link.click();
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Start Over button in same position as Generate */}
                    <Card className="bg-white border-gray-200">
                        <CardContent className="p-4 flex flex-col gap-3 h-full">
                            <Button
                                onClick={handleStartOver}
                                size="lg"
                                variant="outline"
                                className="w-full bg-white hover:bg-gray-50 text-foreground border-gray-300 transition-all duration-200"
                            >
                                <RotateCcw className="mr-2" />
                                Start Over
                            </Button>
                            <Button
                                onClick={handleDownloadAll}
                                disabled={isDownloading || generatedImages.filter(img => img.status === 'done').length === 0}
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2" />
                                        Creating ZIP...
                                    </>
                                ) : (
                                    <>
                                        <Download className="mr-2" />
                                        Download ({generatedImages.filter(img => img.status === 'done').length})
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Configuration settings below results - Right side */}
                <Card className="bg-white border-gray-200 transition-all duration-300 ease-in-out">
                    <CardContent className="p-4">
                        <div className="space-y-4">
                            {/* Aspect Ratio - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
                                </div>
                                <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map(ratio => {
                                        const IconComponent = ratio.icon;
                                        return (
                                            <div key={ratio.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={ratio.id} id={ratio.id} className="text-primary border-primary" />
                                                <Label htmlFor={ratio.id} className="text-xs cursor-pointer flex items-center gap-1">
                                                    <IconComponent className="h-3 w-3" />
                                                    <span>{ratio.label}</span>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>

                            {/* Number of Images - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Hash className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">Number of Images</Label>
                                </div>
                                <RadioGroup value={numberOfImages.toString()} onValueChange={(val) => setNumberOfImages(parseInt(val))} className="flex gap-2">
                                    {NUMBER_OF_IMAGES.map(num => (
                                        <div key={num} className="flex items-center space-x-2 flex-1">
                                            <RadioGroupItem value={num.toString()} id={`num-${num}`} className="text-primary border-primary" />
                                            <Label htmlFor={`num-${num}`} className="text-xs cursor-pointer flex-1 text-center">
                                                {num}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* E-commerce Pack - Dropdown */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">E-commerce Pack</Label>
                                </div>
                                <Select value={ecommercePack} onValueChange={setEcommercePack}>
                                    <SelectTrigger className="w-full bg-white border-gray-300 text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ECOMMERCE_PACK_OPTIONS.map(option => (
                                            <SelectItem key={option.id} value={option.id} className="text-foreground">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Idle view - Main layout with 2:2:1 ratio
    return (
        <div className="w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
                {/* Section 1 (40%): Select Model */}
                <Card className="bg-white border-gray-200 transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <User className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Select Model</h3>
                        </div>
                        {localLibrary.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-5 flex-1 overflow-y-auto pb-2">
                                {localLibrary.map((imgUrl, index) => {
                                    const model = getModelByThumbnail(imgUrl);
                                    const isSelected = uploadedModel === imgUrl;
                                    return (
                                        <div
                                            key={index}
                                            onClick={() => handleSelectFromLibrary(imgUrl)}
                                            className={cn(
                                                "relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer border-2",
                                                isSelected
                                                    ? "border-primary"
                                                    : "border-transparent hover:border-gray-300"
                                            )}
                                        >
                                            <img 
                                                src={imgUrl} 
                                                className="w-full h-full object-cover" 
                                                alt={model?.name || `Model ${index + 1}`}
                                                loading="lazy"
                                            />
                                            
                                            {/* Minimal selection indicator */}
                                            {isSelected && (
                                                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1.5">
                                                    <User className="h-3 w-3" />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No models in library</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Section 2 (40%): Upload Apparel */}
                <Card className="bg-white border-gray-200 transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <Shirt className="h-4 w-4 text-primary" />
                            <h3 className="text-sm font-semibold text-foreground">Upload Apparel</h3>
                        </div>

                        <div
                            {...getApparelRootProps()}
                            className={cn(
                                "cursor-pointer flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out p-4",
                                isApparelDragActive
                                    ? "border-primary bg-primary/10"
                                    : "border-gray-300 hover:border-gray-400 bg-gray-50"
                            )}
                        >
                            <input {...getApparelInputProps()} />
                            <Shirt className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-xs font-medium text-foreground">Drag &apos;n&apos; drop or click to browse</span>
                        </div>

                        {apparelImages.length > 0 && (
                            <div className="mt-3 grid grid-cols-4 gap-2 max-h-[150px] overflow-y-auto flex-shrink-0">
                                {apparelImages.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary">
                                        <img src={img} className="w-full h-full object-cover" alt={`Apparel ${index + 1}`} />
                                        <Button
                                            onClick={() => removeApparelImage(index)}
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Section 3 (20%): Generate Button + Configuration Settings */}
                <Card className="bg-white border-gray-200 transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
                        <div className="space-y-4">
                            {/* Generate Button */}
                            <Button
                                onClick={handleGenerate}
                                disabled={!uploadedModel || apparelImages.length === 0}
                                size="lg"
                                className="w-full bg-primary hover:bg-primary/90 text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Wand2 className="mr-2" />
                                Generate
                            </Button>

                            {/* Configuration Settings */}
                            {/* Aspect Ratio - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ImageIcon className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
                                </div>
                                <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map(ratio => {
                                        const IconComponent = ratio.icon;
                                        return (
                                            <div key={ratio.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={ratio.id} id={ratio.id} className="text-primary border-primary" />
                                                <Label htmlFor={ratio.id} className="text-xs cursor-pointer flex items-center gap-1">
                                                    <IconComponent className="h-3 w-3" />
                                                    <span>{ratio.label}</span>
                                                </Label>
                                            </div>
                                        );
                                    })}
                                </RadioGroup>
                            </div>

                            {/* Number of Images - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Hash className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">Number of Images</Label>
                                </div>
                                <RadioGroup value={numberOfImages.toString()} onValueChange={(val) => setNumberOfImages(parseInt(val))} className="flex gap-2">
                                    {NUMBER_OF_IMAGES.map(num => (
                                        <div key={num} className="flex items-center space-x-2 flex-1">
                                            <RadioGroupItem value={num.toString()} id={`num-${num}`} className="text-primary border-primary" />
                                            <Label htmlFor={`num-${num}`} className="text-xs cursor-pointer flex-1 text-center">
                                                {num}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* E-commerce Pack - Dropdown */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-primary" />
                                    <Label className="text-sm font-medium text-foreground">E-commerce Pack</Label>
                                </div>
                                <Select value={ecommercePack} onValueChange={setEcommercePack}>
                                    <SelectTrigger className="w-full bg-white border-gray-300 text-foreground">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ECOMMERCE_PACK_OPTIONS.map(option => (
                                            <SelectItem key={option.id} value={option.id} className="text-foreground">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

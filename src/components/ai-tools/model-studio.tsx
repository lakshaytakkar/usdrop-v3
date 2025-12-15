"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Download, X, Wand2, User, Shirt, Image as ImageIcon, Hash, Sparkles, RotateCcw, Smartphone, Square, Monitor, Tv, RefreshCw } from 'lucide-react';
import { geminiService } from '@/lib/services/gemini-service';
import { resizeImageToAspectRatio } from '@/lib/utils/image-resizer';
import JSZip from 'jszip';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MODELS_LIBRARY } from '@/data/models-library';
import type { AIModel } from '@/types/ai-models';
import AILoadingState from '@/components/kokonutui/ai-loading';

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
    // Checks modelStudioLibrary first (thumbnail URLs), then aiStudioMyModels (full objects)
    const loadUserModels = useCallback((): AIModel[] => {
        try {
            // Check if we're on the client side
            if (typeof window === 'undefined') {
                return [];
            }
            
            // First check modelStudioLibrary (array of thumbnail URL strings)
            const thumbnailLibrary = localStorage.getItem('modelStudioLibrary');
            let thumbnailUrls: string[] = [];
            if (thumbnailLibrary) {
                try {
                    const parsed = JSON.parse(thumbnailLibrary);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        thumbnailUrls = parsed.filter((url): url is string => typeof url === 'string');
                        console.log('Found thumbnail URLs in modelStudioLibrary:', thumbnailUrls.length);
                    }
                } catch (e) {
                    console.error('Failed to parse modelStudioLibrary:', e);
                }
            }
            
            // Then check aiStudioMyModels (full AIModel objects)
            const fullModels = localStorage.getItem('aiStudioMyModels');
            let modelObjects: AIModel[] = [];
            if (fullModels) {
                try {
                    const parsed = JSON.parse(fullModels);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        modelObjects = parsed.filter((m): m is AIModel => m && typeof m === 'object' && m.thumbnail);
                        console.log('Found full model objects in aiStudioMyModels:', modelObjects.length);
                    }
                } catch (e) {
                    console.error('Failed to parse aiStudioMyModels:', e);
                }
            }
            
            // Merge: if we have thumbnail URLs, match them with full objects or create minimal objects
            if (thumbnailUrls.length > 0) {
                const matchedModels: AIModel[] = thumbnailUrls.map(url => {
                    // Try to find full model object for this thumbnail
                    const fullModel = modelObjects.find(m => m.thumbnail === url);
                    if (fullModel) {
                        return fullModel;
                    }
                    // Create minimal model object from thumbnail URL
                    return {
                        id: `model-${url.slice(0, 20)}-${Date.now()}`,
                        name: 'Custom Model',
                        thumbnail: url,
                        description: '',
                        gender: 'Male' as const,
                        region: 'Custom',
                        country: 'Custom',
                        source: 'user-saved' as const,
                    };
                });
                console.log('Merged models from both sources:', matchedModels.length);
                return matchedModels;
            }
            
            // If no thumbnails, return full model objects if available
            if (modelObjects.length > 0) {
                console.log('Using full model objects:', modelObjects.length);
                return modelObjects;
            }
            
            console.log('No models found in either localStorage key');
            return [];
        } catch (error) {
            console.error("Failed to load user models:", error);
            return [];
        }
    }, []);

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

    // Load only the 12 library models from MODELS_LIBRARY
    const updateModelLibrary = useCallback(() => {
        try {
            // Check if we're on the client side
            if (typeof window === 'undefined') {
                return;
            }
            
            // Only use library models from MODELS_LIBRARY (the 12 models from public/models folder)
            const libraryModels: AIModel[] = MODELS_LIBRARY.map(model => ({
                ...model,
                source: 'library' as const
            }));
            
            console.log('updateModelLibrary called, loading library models:', libraryModels.length);
            
            // Validate models have thumbnails
            const validModels = libraryModels.filter(m => {
                if (!m || !m.thumbnail) {
                    return false;
                }
                return true;
            });
            
            if (validModels.length === 0) {
                console.log('No valid models with thumbnails found');
                setLocalLibrary([]);
                return;
            }
            
            // Get thumbnails from library models only
            const libraryThumbnails = validModels.map(m => m.thumbnail).filter(Boolean) as string[];
            
            console.log('Setting library with thumbnails:', libraryThumbnails.length);
            setLocalLibrary(libraryThumbnails);
        } catch (error) {
            console.error("Error loading models:", error);
            setLocalLibrary([]);
        }
    }, []);

    // Load models once on mount
    useEffect(() => {
        updateModelLibrary();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Only run once on mount, updateModelLibrary is stable with empty deps

    // Listen for changes to user models (only storage events, no polling)
    useEffect(() => {
        // Listen for storage events (from other tabs/components)
        const handleStorageChange = (e: StorageEvent) => {
            // Only react to changes in model-related keys
            if (e.key === 'modelStudioLibrary' || e.key === 'aiStudioMyModels') {
                updateModelLibrary();
            }
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
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
                
                const resultUrl = await geminiService.generateStyledImage(finalPrompt, imageUrls, aspectRatio);
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
        // Calculate aspect ratio class based on selected aspect ratio
        const getAspectRatioClass = () => {
            switch (aspectRatio) {
                case '1:1': return 'aspect-square';
                case '4:5': return 'aspect-[4/5]';
                case '16:9': return 'aspect-video';
                case '9:16': return 'aspect-[9/16]';
                default: return 'aspect-[4/5]';
            }
        };

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
                                disabled={isDownloading || generatedImages.filter(img => img.status === 'done').length === 0}
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
                                            Download ({generatedImages.filter(img => img.status === 'done').length})
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
                            {generatedImages.map((image, index) => (
                                <Card key={index} className="bg-card border-border transition-all duration-300 ease-in-out hover:shadow-md">
                                    <CardContent className="p-4">
                                        <div className={`${getAspectRatioClass()} w-full bg-muted rounded-lg flex items-center justify-center relative`}>
                                            {image.status === 'pending' && <Loader2 className="animate-spin h-8 w-8 text-foreground" />}
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
                                                        className="absolute top-2 right-2 bg-background hover:bg-muted border border-border transition-all duration-200"
                                                        onClick={() => {
                                                            const link = document.createElement('a');
                                                            link.href = image.url!;
                                                            link.download = `model-studio-${index + 1}.png`;
                                                            link.click();
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4 text-foreground" />
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Idle view - Main layout with 2:2:1 ratio
    return (
        <div className="w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
                {/* Section 1 (40%): Select Model */}
                <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center justify-between mb-3 flex-shrink-0">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-foreground" />
                                <h3 className="text-sm font-semibold text-foreground">Select Model</h3>
                            </div>
                            <Button
                                onClick={() => updateModelLibrary()}
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                title="Refresh models"
                            >
                                <RefreshCw className="h-3 w-3 text-foreground" />
                            </Button>
                        </div>
                        {localLibrary.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-1.5 flex-1 overflow-y-auto pb-2">
                                {localLibrary.map((imgUrl, index) => {
                                    const model = getModelByThumbnail(imgUrl);
                                    const isSelected = uploadedModel === imgUrl;
                                    return (
                                        <div
                                            key={`${imgUrl}-${index}`}
                                            className="w-full min-w-0 flex justify-center"
                                        >
                                            <div
                                                onClick={() => handleSelectFromLibrary(imgUrl)}
                                                className={cn(
                                                    "relative rounded-lg overflow-hidden cursor-pointer border-2 group",
                                                    "aspect-[2/3] w-[86%]",
                                                    isSelected
                                                        ? "border-primary"
                                                        : "border-transparent hover:border-gray-300"
                                                )}
                                            >
                                                <img 
                                                    src={imgUrl} 
                                                    className="w-full h-full object-cover pointer-events-none" 
                                                    alt={model?.name || `Model ${index + 1}`}
                                                    loading="lazy"
                                                />
                                                
                                                {/* Hover overlay with name, age, and city */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-end pointer-events-none">
                                                    <div className="w-full p-3 text-white">
                                                        <div className="text-sm font-semibold">{model?.name || 'Model'}</div>
                                                        {model?.age && (
                                                            <div className="text-xs text-white/90">{model.age} years old</div>
                                                        )}
                                                        {model?.country && (
                                                            <div className="text-xs text-white/90">{model.country}</div>
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Minimal selection indicator */}
                                                {isSelected && (
                                                    <div className="absolute top-2 right-2 bg-foreground text-background rounded-full p-1.5 z-10 pointer-events-none">
                                                        <User className="h-3 w-3 text-background" />
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="text-center text-muted-foreground py-8">
                                <User className="h-8 w-8 mx-auto mb-2 opacity-50 text-foreground" />
                                <p className="text-sm mb-3">No models in library</p>
                                <button
                                    onClick={() => updateModelLibrary()}
                                    className={cn(
                                        "group relative h-9 px-3 rounded-md text-xs font-medium text-white transition-all duration-300 cursor-pointer",
                                        "flex items-center justify-center gap-2"
                                    )}
                                >
                                    <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                                    <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                                    <span className="relative flex items-center justify-center gap-2 z-10">
                                        Refresh
                                    </span>
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Section 2 (40%): Upload Apparel */}
                <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <Shirt className="h-4 w-4 text-foreground" />
                            <h3 className="text-sm font-semibold text-foreground">Upload Apparel</h3>
                        </div>

                        <div
                            {...getApparelRootProps()}
                            className={cn(
                                "cursor-pointer flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out p-4",
                                isApparelDragActive
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-foreground/20 bg-muted"
                            )}
                        >
                            <input {...getApparelInputProps()} />
                            <Shirt className="h-8 w-8 text-foreground mb-2" />
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
                <Card className="bg-card border-border transition-all duration-200 ease-in-out hover:shadow-md h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
                        <div className="space-y-4">
                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!uploadedModel || apparelImages.length === 0}
                                className={cn(
                                    "group relative w-full h-10 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer",
                                    "flex items-center justify-center gap-2",
                                    "disabled:opacity-50 disabled:cursor-not-allowed"
                                )}
                            >
                                <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
                                <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
                                <span className="relative flex items-center justify-center gap-2 z-10">
                                    <Wand2 className="h-4 w-4 text-white" />
                                    Generate
                                </span>
                            </button>

                            {/* Configuration Settings */}
                            {/* Aspect Ratio - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <ImageIcon className="h-4 w-4 text-foreground" />
                                    <Label className="text-sm font-medium text-foreground">Aspect Ratio</Label>
                                </div>
                                <RadioGroup value={aspectRatio} onValueChange={setAspectRatio} className="grid grid-cols-2 gap-2">
                                    {ASPECT_RATIOS.map(ratio => {
                                        const IconComponent = ratio.icon;
                                        return (
                                            <div key={ratio.id} className="flex items-center space-x-2">
                                                <RadioGroupItem value={ratio.id} id={ratio.id} className="border-foreground text-foreground data-[state=checked]:border-foreground [&[data-state=checked]>span>svg]:fill-foreground [&[data-state=checked]>span>svg]:text-foreground" />
                                                <Label htmlFor={ratio.id} className="text-xs cursor-pointer flex items-center gap-1 text-foreground">
                                                    <IconComponent className="h-3 w-3 text-foreground" />
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
                                    <Hash className="h-4 w-4 text-foreground" />
                                    <Label className="text-sm font-medium text-foreground">Number of Images</Label>
                                </div>
                                <RadioGroup value={numberOfImages.toString()} onValueChange={(val) => setNumberOfImages(parseInt(val))} className="flex gap-2">
                                    {NUMBER_OF_IMAGES.map(num => (
                                        <div key={num} className="flex items-center space-x-2 flex-1">
                                            <RadioGroupItem value={num.toString()} id={`num-${num}`} className="border-foreground text-foreground data-[state=checked]:border-foreground [&[data-state=checked]>span>svg]:fill-foreground [&[data-state=checked]>span>svg]:text-foreground" />
                                            <Label htmlFor={`num-${num}`} className="text-xs cursor-pointer flex-1 text-center text-foreground">
                                                {num}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>

                            {/* E-commerce Pack - Dropdown */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Sparkles className="h-4 w-4 text-foreground" />
                                    <Label className="text-sm font-medium text-foreground">E-commerce Pack</Label>
                                </div>
                                <Select value={ecommercePack} onValueChange={setEcommercePack}>
                                    <SelectTrigger className="w-full bg-background border-border text-foreground hover:bg-muted">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border">
                                        {ECOMMERCE_PACK_OPTIONS.map(option => (
                                            <SelectItem key={option.id} value={option.id} className="text-foreground focus:bg-muted">
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

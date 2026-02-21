

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, Image as ImageIcon, Download, MousePointer2, RotateCcw, Wand2, Package } from 'lucide-react';
import { ButtonSpinner } from '@/components/ui/blue-spinner';
import { geminiService } from '@/lib/services/gemini-service';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import AILoadingState from '@/components/kokonutui/ai-loading';

type ViewState = 'idle' | 'processing' | 'results';

interface ProcessedImage {
    url: string;
    name: string;
}

/**
 * Convert an SVG file to a PNG data URL so it can be used with
 * image-generation models that do not support image/svg+xml.
 */
const svgFileToPngDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            try {
                const svgText = reader.result as string;
                const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        // Preserve the intrinsic size of the SVG if available
                        const width = img.naturalWidth || img.width || 1024;
                        const height = img.naturalHeight || img.height || 1024;
                        canvas.width = width;
                        canvas.height = height;

                        const ctx = canvas.getContext('2d');
                        if (!ctx) {
                            URL.revokeObjectURL(url);
                            reject(new Error('Failed to get canvas context'));
                            return;
                        }

                        ctx.drawImage(img, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/png');
                        URL.revokeObjectURL(url);
                        resolve(dataUrl);
                    } catch (err) {
                        URL.revokeObjectURL(url);
                        reject(err);
                    }
                };

                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG for conversion'));
                };

                img.src = url;
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = (error) => reject(error);
        reader.readAsText(file);
    });
};

/**
 * Reads a File and returns a base64 data URL. If the file is an SVG, it is
 * first rasterized to PNG so downstream consumers only see supported formats.
 */
const fileToBase64 = (file: File): Promise<string> => {
    if (file.type === 'image/svg+xml') {
        // Gemini image models do not support SVG; convert to PNG first.
        return svgFileToPngDataUrl(file);
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export function LogoStudio() {
    const [logo, setLogo] = useState<string | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [productName, setProductName] = useState<string>('');
    const [scale, setScale] = useState(20); // as percentage
    const [opacity, setOpacity] = useState(80); // as percentage
    const [position, setPosition] = useState({ x: 50, y: 50 }); // as percentage of container for center
    
    const [viewState, setViewState] = useState<ViewState>('idle');
    const [processingProgress, setProcessingProgress] = useState(0);
    const [loadingStep, setLoadingStep] = useState<string>('');
    const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

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

    const onProductDrop = useCallback(async (acceptedFiles: File[]) => {
        if (acceptedFiles[0]) {
            const base64 = await fileToBase64(acceptedFiles[0]);
            setProductImage(base64);
            setProductName(acceptedFiles[0].name);
        }
    }, []);
    
    const { getRootProps: getLogoRootProps, getInputProps: getLogoInputProps, isDragActive: isLogoDragActive } = useDropzone({ 
        onDrop: onLogoDrop, 
        accept: { 'image/*': [] }, 
        multiple: false 
    });
    
    const { getRootProps: getProductRootProps, getInputProps: getProductInputProps, isDragActive: isProductDragActive } = useDropzone({ 
        onDrop: onProductDrop, 
        accept: { 'image/*': [] }, 
        multiple: false 
    });

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

    const processAndGenerate = async () => {
        if (!logo || !productImage) return;

        setViewState('processing');
        setProcessingProgress(0);
        setLoadingStep('Preparing images...');
        setProcessedImage(null);

        try {
            setProcessingProgress(10);
            setLoadingStep('Embedding logo into product...');

            // Construct prompt for realistic logo embedding (same approach as model-studio)
            const positionDescription = position.x < 33 ? 'left' : position.x > 66 ? 'right' : 'center';
            const verticalPosition = position.y < 33 ? 'top' : position.y > 66 ? 'bottom' : 'middle';
            
            const prompt = `You are a professional product photographer and graphic designer. Your task is to realistically embed the logo from the second image onto the product in the first image.

CRITICAL REQUIREMENTS:
1. The logo must be placed at approximately ${positionDescription}-${verticalPosition} position (${Math.round(position.x)}% horizontal, ${Math.round(position.y)}% vertical)
2. The logo should be ${Math.round(scale)}% of the product image size
3. The logo opacity should be ${Math.round(opacity)}%
4. The logo must look naturally integrated into the product - as if it was printed, embroidered, or applied to the product surface
5. Maintain proper perspective, lighting, shadows, and texture matching
6. The logo should follow the product's surface curvature and material properties
7. Ensure the logo blends seamlessly with the product's lighting conditions
8. Preserve all original product details and quality

Generate a photorealistic image where the logo appears naturally embedded on the product. The final output should maintain the original product image's aspect ratio.`;

            setProcessingProgress(30);
            setLoadingStep('Using AI to realistically embed logo...');

            // Use the same method as model-studio: generateStyledImage
            // First image is product, second image is logo
            const resultUrl = await geminiService.generateStyledImage(
                prompt,
                [productImage, logo],
                '4:5' // Default aspect ratio, can be adjusted if needed
            );

            setProcessingProgress(90);
            setLoadingStep('Finalizing...');

            setTimeout(() => {
                setProcessedImage({
                    url: resultUrl,
                    name: productName || 'logo-embedded-product.png'
                });
                setProcessingProgress(100);
                setViewState('results');
            }, 300);
        } catch (error) {
            console.error('Error processing image:', error);
            setLoadingStep(`Error: ${error instanceof Error ? error.message : 'Failed to process image'}`);
            // Still show error in UI, but don't crash
            setTimeout(() => {
                setViewState('idle');
            }, 2000);
        }
    };

    const handleDownload = () => {
        if (!processedImage) return;
        
        const link = document.createElement('a');
        link.href = processedImage.url;
        link.download = processedImage.name || 'logo-embedded-product.png';
        link.click();
    };

    const handleStartOver = () => {
        setViewState('idle');
        setProcessedImage(null);
        setProcessingProgress(0);
        setLoadingStep('');
    };

    // Loading screen - contained in content area
    if (viewState === 'processing') {
        return (
            <div className="w-full max-w-7xl mx-auto flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <AILoadingState />
            </div>
        );
    }

    // Results view - full viewport
    if (viewState === 'results' && processedImage) {
        return (
            <div className="h-[calc(100vh-181px)] flex flex-col bg-background">
                {/* Action buttons header */}
                <div className="flex-shrink-0 border-b border-border bg-card p-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-foreground">Processed Result</h2>
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
                                onClick={handleDownload}
                                disabled={isDownloading || !processedImage}
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
                                            <ButtonSpinner className="text-white" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 text-white" />
                                            Download
                                        </>
                                    )}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results display - no scrolling, fits viewport */}
                <div className="flex-1 overflow-hidden p-4">
                    <div className="max-w-7xl mx-auto h-full">
                        <Card className="bg-card border-border h-full">
                            <CardContent className="p-4 h-full flex items-center justify-center">
                                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center relative">
                                    <img src={processedImage.url} alt="Processed product" className="w-full h-full object-contain rounded-lg" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    // Idle view - Main layout with 2:2:1 ratio
    return (
        <div className="w-full max-w-7xl mx-auto transition-all duration-300 ease-in-out">
            <div className="grid grid-cols-[2fr_2fr_1fr] gap-4">
                {/* Section 1 (40%): Logo Upload & Controls */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
                        <div className="space-y-4">
                            {/* Logo Upload */}
                            <div>
                                <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                                    <ImageIcon className="h-4 w-4 text-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">1. Your Logo</h3>
                                </div>
                                <div 
                                    {...getLogoRootProps()} 
                                    className={cn(
                                        "cursor-pointer aspect-square w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out",
                                        isLogoDragActive 
                                            ? "border-primary bg-primary/10" 
                                            : "border-border hover:border-foreground/20 bg-muted"
                                    )}
                                >
                                    <input {...getLogoInputProps()} />
                                    {logo ? (
                                        <img src={logo} alt="Logo preview" className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <>
                                            <UploadCloud className="h-6 w-6 text-foreground mb-2" />
                                            <span className="text-xs font-medium text-foreground">Upload Logo</span>
                                            <span className="text-xs text-muted-foreground mt-1 text-center px-2">PNG with transparency</span>
                                        </>
                                    )}
                                </div>
                            </div>
                            
                            {/* Placement Controls */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <MousePointer2 className="h-4 w-4 text-foreground" />
                                    <h3 className="text-sm font-semibold text-foreground">Placement</h3>
                                </div>
                                <p className="text-xs text-muted-foreground mb-3">
                                    Drag and resize the logo in the preview window.
                                </p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label htmlFor="scale" className="text-xs font-medium text-foreground">Scale</label>
                                            <span className="text-xs font-mono text-foreground">{Math.round(scale)}%</span>
                                        </div>
                                        <Slider
                                            id="scale"
                                            min={1}
                                            max={100}
                                            value={[scale]}
                                            onValueChange={(value) => setScale(value[0])}
                                        />
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-center mb-2">
                                            <label htmlFor="opacity" className="text-xs font-medium text-foreground">Opacity</label>
                                            <span className="text-xs font-mono text-foreground">{opacity}%</span>
                                        </div>
                                        <Slider
                                            id="opacity"
                                            min={0}
                                            max={100}
                                            value={[opacity]}
                                            onValueChange={(value) => setOpacity(value[0])}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                
                {/* Section 2 (40%): Product Upload & Preview */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <Package className="h-4 w-4 text-foreground" />
                            <h3 className="text-sm font-semibold text-foreground">2. Your Product</h3>
                        </div>

                        {!productImage ? (
                            <div
                                {...getProductRootProps()}
                                className={cn(
                                    "cursor-pointer flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out p-4",
                                    isProductDragActive
                                        ? "border-primary bg-primary/10"
                                        : "border-border hover:border-foreground/20 bg-muted"
                                )}
                            >
                                <input {...getProductInputProps()} />
                                <Package className="h-8 w-8 text-foreground mb-2" />
                                <span className="text-xs font-medium text-foreground">Drag &apos;n&apos; drop or click to browse</span>
                                <span className="text-xs text-muted-foreground mt-1">Upload your product image</span>
                            </div>
                        ) : (
                            <>
                                {/* Preview with logo overlay */}
                                <div className="flex-1 bg-muted rounded-lg relative flex items-center justify-center overflow-hidden min-h-[300px] mb-3">
                                    <div ref={previewContainerRef} className="relative inline-block w-full h-full flex items-center justify-center" style={{lineHeight: 0}}>
                                        <img src={productImage} alt="Product preview" className="max-w-full max-h-full object-contain block" />
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
                                                    className="absolute -right-1 -bottom-1 w-4 h-4 bg-primary rounded-full border-2 border-background cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                    onMouseDown={(e) => handleInteractionStart(e, 'resize')}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Remove product button */}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        setProductImage(null);
                                        setProductName('');
                                    }}
                                    className="w-full"
                                >
                                    Remove Product
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>

                {/* Section 3 (20%): Generate Button */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="space-y-4">
                            {/* Generate Button */}
                            <button
                                onClick={processAndGenerate}
                                disabled={!logo || !productImage}
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

                            {/* Info */}
                            <div className="text-xs text-muted-foreground space-y-2">
                                <p>• Upload your logo and product image</p>
                                <p>• Adjust placement, scale, and opacity</p>
                                <p>• AI will realistically embed the logo</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

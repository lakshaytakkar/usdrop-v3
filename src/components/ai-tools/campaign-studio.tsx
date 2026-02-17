"use client"

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, Download, X, Wand2, Target, Image as ImageIcon, RotateCcw, Globe, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import AILoadingState from '@/components/kokonutui/ai-loading';

type ViewState = 'idle' | 'generating' | 'results';

interface CampaignResult {
    id: string;
    platform: string;
    format: string;
    preview: string;
    status: 'done' | 'error';
    error?: string;
}

const PLATFORMS = [
    { id: 'meta', label: 'Meta (Facebook/Instagram)' },
    { id: 'google', label: 'Google Ads' },
    { id: 'tiktok', label: 'TikTok Ads' },
    { id: 'pinterest', label: 'Pinterest Ads' },
];

const AD_FORMATS = [
    { id: 'image', label: 'Image Ad' },
    { id: 'video', label: 'Video Ad' },
    { id: 'carousel', label: 'Carousel' },
    { id: 'story', label: 'Story' },
];

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

export function CampaignStudio() {
    const [viewState, setViewState] = useState<ViewState>('idle');
    
    // Campaign Details
    const [campaignName, setCampaignName] = useState('');
    const [budget, setBudget] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [targetAudience, setTargetAudience] = useState('');
    
    // Ad Creative & Assets
    const [productImages, setProductImages] = useState<string[]>([]);
    const [adCopy, setAdCopy] = useState('');
    
    // Settings
    const [platform, setPlatform] = useState<string>('meta');
    const [adFormat, setAdFormat] = useState<string>('image');
    
    // Generation state
    const [campaignResults, setCampaignResults] = useState<CampaignResult[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [loadingStep, setLoadingStep] = useState<string>('');
    const [loadingProgress, setLoadingProgress] = useState<number>(0);

    const onProductImagesDrop = useCallback(async (acceptedFiles: File[]) => {
        const newImages = await Promise.all(
            acceptedFiles.map(file => fileToBase64(file))
        );
        setProductImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps: getProductImagesRootProps, getInputProps: getProductImagesInputProps, isDragActive: isProductImagesDragActive } = useDropzone({
        onDrop: onProductImagesDrop,
        accept: { 'image/*': [] },
        multiple: true
    });

    const removeProductImage = (index: number) => {
        setProductImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleGenerate = async () => {
        if (!campaignName || !budget || !startDate || !endDate || productImages.length === 0) return;

        setViewState('generating');
        setIsGenerating(true);
        setLoadingStep('Preparing campaign...');
        setLoadingProgress(10);

        // Simulate campaign generation
        const platformsToGenerate = [platform];
        const initialResults: CampaignResult[] = platformsToGenerate.map((plat, index) => ({
            id: `campaign-${index}`,
            platform: plat,
            format: adFormat,
            preview: '',
            status: 'done'
        }));

        setTimeout(() => {
            setLoadingStep('Generating ad creatives...');
            setLoadingProgress(30);
        }, 500);

        setTimeout(() => {
            setLoadingStep('Optimizing campaign settings...');
            setLoadingProgress(60);
        }, 1500);

        setTimeout(() => {
            setLoadingStep('Finalizing campaign...');
            setLoadingProgress(85);
        }, 2500);

        setTimeout(() => {
            // Generate preview URLs (mock for now)
            const resultsWithPreviews = initialResults.map(result => ({
                ...result,
                preview: productImages[0] || '' // Use first product image as preview
            }));
            
            setCampaignResults(resultsWithPreviews);
            setLoadingProgress(100);
            setIsGenerating(false);
            setViewState('results');
        }, 3500);
    };

    const handleDownloadAll = async () => {
        setIsDownloading(true);
        try {
            // Mock download functionality
            await new Promise(resolve => setTimeout(resolve, 1000));
            alert('Campaign exported successfully!');
        } catch (error) {
            console.error("Failed to export campaign:", error);
            alert('Failed to export campaign.');
        } finally {
            setIsDownloading(false);
        }
    };

    const handleStartOver = () => {
        setViewState('idle');
        setCampaignResults([]);
        setCampaignName('');
        setBudget('');
        setStartDate('');
        setEndDate('');
        setTargetAudience('');
        setProductImages([]);
        setAdCopy('');
        setLoadingStep('');
        setLoadingProgress(0);
    };

    // Loading screen
    if (viewState === 'generating') {
        return (
            <div className="w-full max-w-7xl mx-auto flex items-center justify-center" style={{ minHeight: 'calc(100vh - 300px)' }}>
                <AILoadingState />
            </div>
        );
    }

    // Results view
    if (viewState === 'results') {
        return (
            <div className="h-screen flex flex-col bg-background">
                {/* Action buttons header */}
                <div className="flex-shrink-0 border-b border-border bg-card p-4">
                    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-foreground">Campaign Results</h2>
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
                                disabled={isDownloading || campaignResults.length === 0}
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
                                            Exporting...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="h-4 w-4 text-white" />
                                            Export Campaign
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {campaignResults.map((result, index) => (
                                <Card key={result.id} className="bg-card border-border">
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Globe className="h-4 w-4 text-foreground" />
                                                    <span className="text-sm font-semibold text-foreground capitalize">{result.platform}</span>
                                                </div>
                                                <span className="text-xs text-muted-foreground capitalize">{result.format}</span>
                                            </div>
                                            {result.preview && (
                                                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center relative overflow-hidden">
                                                    <img src={result.preview} alt={`Campaign ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <p className="text-xs text-muted-foreground">Campaign: {campaignName}</p>
                                                <p className="text-xs text-muted-foreground">Budget: ${budget}</p>
                                            </div>
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
                {/* Section 1 (40%): Campaign Details */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <Target className="h-4 w-4 text-foreground" />
                            <h3 className="text-sm font-semibold text-foreground">Campaign Details</h3>
                        </div>
                        <div className="space-y-4 flex-1">
                            <div>
                                <Label className="text-xs font-medium text-foreground mb-2 block">Campaign Name</Label>
                                <Input 
                                    value={campaignName}
                                    onChange={(e) => setCampaignName(e.target.value)}
                                    placeholder="Enter campaign name"
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-foreground mb-2 block">Budget ($)</Label>
                                <Input 
                                    type="number"
                                    value={budget}
                                    onChange={(e) => setBudget(e.target.value)}
                                    placeholder="0.00"
                                    className="bg-background border-border text-foreground"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <Label className="text-xs font-medium text-foreground mb-2 block">Start Date</Label>
                                    <Input 
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                                <div>
                                    <Label className="text-xs font-medium text-foreground mb-2 block">End Date</Label>
                                    <Input 
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="bg-background border-border text-foreground"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label className="text-xs font-medium text-foreground mb-2 block">Target Audience</Label>
                                <Textarea 
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value)}
                                    placeholder="Describe your target audience..."
                                    className="bg-background border-border text-foreground min-h-[80px]"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Section 2 (40%): Ad Creative & Assets */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-3 flex-shrink-0">
                            <ImageIcon className="h-4 w-4 text-foreground" />
                            <h3 className="text-sm font-semibold text-foreground">Ad Creative & Assets</h3>
                        </div>

                        <div
                            {...getProductImagesRootProps()}
                            className={cn(
                                "cursor-pointer flex-1 w-full flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out p-4 mb-3",
                                isProductImagesDragActive
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-foreground/20 bg-muted"
                            )}
                        >
                            <input {...getProductImagesInputProps()} />
                            <ImageIcon className="h-8 w-8 text-foreground mb-2" />
                            <span className="text-xs font-medium text-foreground">Drag &apos;n&apos; drop or click to browse</span>
                        </div>

                        {productImages.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 max-h-[150px] overflow-y-auto flex-shrink-0 mb-3">
                                {productImages.map((img, index) => (
                                    <div key={index} className="relative group aspect-square rounded-md overflow-hidden transition-all duration-200 ease-in-out hover:ring-2 hover:ring-primary">
                                        <img src={img} className="w-full h-full object-cover" alt={`Product ${index + 1}`} />
                                        <Button
                                            onClick={() => removeProductImage(index)}
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

                        <div className="flex-shrink-0">
                            <Label className="text-xs font-medium text-foreground mb-2 block">Ad Copy</Label>
                            <Textarea 
                                value={adCopy}
                                onChange={(e) => setAdCopy(e.target.value)}
                                placeholder="Write your ad copy..."
                                className="bg-background border-border text-foreground min-h-[80px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Section 3 (20%): Settings & Generate */}
                <Card className="bg-card border-border h-[calc(100vh-200px)]">
                    <CardContent className="p-4 h-full flex flex-col overflow-y-auto">
                        <div className="space-y-4">
                            {/* Generate Button */}
                            <button
                                onClick={handleGenerate}
                                disabled={!campaignName || !budget || !startDate || !endDate || productImages.length === 0}
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
                                    Generate Campaign
                                </span>
                            </button>

                            {/* Platform Selection */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="h-4 w-4 text-foreground" />
                                    <Label className="text-sm font-medium text-foreground">Platform</Label>
                                </div>
                                <Select value={platform} onValueChange={setPlatform}>
                                    <SelectTrigger className="w-full bg-background border-border text-foreground hover:bg-muted">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-background border-border">
                                        {PLATFORMS.map(option => (
                                            <SelectItem key={option.id} value={option.id} className="text-foreground focus:bg-muted">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Ad Format - Radio Group */}
                            <div>
                                <div className="flex items-center gap-2 mb-3">
                                    <Radio className="h-4 w-4 text-foreground" />
                                    <Label className="text-sm font-medium text-foreground">Ad Format</Label>
                                </div>
                                <RadioGroup value={adFormat} onValueChange={setAdFormat} className="space-y-2">
                                    {AD_FORMATS.map(format => (
                                        <div key={format.id} className="flex items-center space-x-2">
                                            <RadioGroupItem value={format.id} id={format.id} className="border-foreground text-foreground data-[state=checked]:border-foreground [&[data-state=checked]>span>svg]:fill-foreground [&[data-state=checked]>span>svg]:text-foreground" />
                                            <Label htmlFor={format.id} className="text-xs cursor-pointer text-foreground">
                                                {format.label}
                                            </Label>
                                        </div>
                                    ))}
                                </RadioGroup>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


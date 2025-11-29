import React from 'react';
import { useStudio } from '../../context/StudioContext';
import { LoadingOverlay } from './LoadingOverlay';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { ImageEditor } from './ImageEditor';
import { ImageToolbar } from './ImageToolbar';
import { GenerationPlaceholder } from './GenerationPlaceholder';
import { ECOMMERCE_PACKS } from '../../constants';
import { DesignPreview } from '../design/DesignPreview';
import { BookOpen } from 'lucide-react';

const GroundingSources: React.FC<{ sources: { web: { uri: string; title: string; } }[] }> = ({ sources }) => {
    if (!sources || sources.length === 0) return null;
    return (
        <div className="absolute bottom-2 left-2 right-2 bg-black/50 backdrop-blur-sm p-2 rounded-md text-xs text-zinc-300 z-10 animate-fade-in">
            <p className="font-bold text-zinc-100 mb-1 flex items-center gap-1.5"><BookOpen size={14}/> Sources:</p>
            <div className="flex flex-wrap gap-x-3 gap-y-1">
                 {sources.map((source, index) => (
                    <a 
                        key={index} 
                        href={source.web.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:text-violet-300 underline"
                        title={source.web.title}
                    >
                        {new URL(source.web.uri).hostname}
                    </a>
                ))}
            </div>
        </div>
    );
};


export const StudioView: React.FC = () => {
  const { 
    generatedImages, 
    isGenerating, 
    isApplyingPost, 
    error, 
    uploadedModelImage, 
    loadingMessage, 
    activeImageIndex, 
    setActiveImageIndex, 
    isEditing, 
    isApplyingEdit,
    generationCount,
    ecommercePack,
    isSocialMediaPack,
    numberOfImages,
    studioMode,
    productImage,
    mockupImage,
    designImage,
    selectedModels,
    activeImageSources
  } = useStudio();

  const previewImage = studioMode === 'apparel' ? uploadedModelImage : productImage;
  const showDesignPreview = studioMode === 'design' && mockupImage && designImage && (!generatedImages || generatedImages.length === 0);
  const showEmptyState = !isGenerating && (!generatedImages || generatedImages.length === 0) && !previewImage && !showDesignPreview;
  const showPreview = !isGenerating && (!generatedImages || generatedImages.length === 0) && previewImage && !showDesignPreview;

  const activeImage = activeImageIndex !== null && generatedImages ? generatedImages[activeImageIndex] : null;

  const getPlaceholderCount = () => {
      const modelCount = Math.max(1, selectedModels.length);
      if (studioMode !== 'apparel') return numberOfImages * modelCount;
      if (isSocialMediaPack) return 4 * modelCount;
      if (ecommercePack !== 'none') {
          return ECOMMERCE_PACKS[ecommercePack].shots.length * modelCount;
      }
      return numberOfImages * modelCount;
  };

  const imagesToDisplay = isGenerating && (!generatedImages || generatedImages.length === 0) 
    ? Array.from({ length: getPlaceholderCount() }).map(() => null)
    : generatedImages;

  return (
    <div className="relative w-full h-full flex flex-col gap-3">
        <div className="relative flex-1 bg-zinc-925/50 backdrop-blur-sm rounded-lg flex items-center justify-center p-2 sm:p-4 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
             {(() => {
                if (error && !isEditing) return <ErrorState />;
                
                if (isGenerating && (!generatedImages || generatedImages.every(img => img === null))) {
                    return <GenerationPlaceholder message={loadingMessage} />;
                }
                
                if (activeImage) {
                    return (
                        <>
                            <img 
                                key={generationCount + '-' + (activeImageIndex || 0)}
                                src={activeImage} 
                                alt={`Generated image ${activeImageIndex !== null ? activeImageIndex + 1 : ''}`} 
                                className="object-contain w-full h-full rounded-lg animate-reveal" 
                            />
                            {activeImageSources && <GroundingSources sources={activeImageSources} />}
                        </>
                    );
                }
                
                if (showDesignPreview) return <DesignPreview />;
                
                if (showPreview) {
                     return <img src={previewImage} alt="Input preview" className="object-contain w-full h-full max-h-[calc(100vh-200px)] rounded-lg animate-fade-in" />;
                }

                if (showEmptyState) return <EmptyState />;

                return null;
            })()}

            {(isApplyingPost || isApplyingEdit) && <LoadingOverlay message={loadingMessage} />}
            {isEditing && <ImageEditor />}
        </div>
        
        {(imagesToDisplay && imagesToDisplay.length > 0) && !error && (
            <div className="flex-shrink-0 flex flex-col gap-3 animate-fade-in">
                {/* Toolbar Bar */}
                {(activeImage && !isGenerating && !isEditing) && (
                    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-lg border border-white/10 p-2 flex justify-center">
                        <ImageToolbar />
                    </div>
                )}
                
                {/* Thumbnails Bar */}
                <div className="h-32 bg-zinc-900/60 backdrop-blur-xl rounded-lg border border-white/10 p-3 flex items-center gap-3 overflow-x-auto model-filter-scrollbar">
                    {imagesToDisplay && imagesToDisplay.map((imageB64, index) => (
                        imageB64 ? (
                            <div 
                                key={index} 
                                className={`relative group h-full aspect-[3/4] rounded-md cursor-pointer transition-all duration-200 overflow-hidden flex-shrink-0 ${index === activeImageIndex ? 'ring-2 ring-offset-2 ring-violet-500 ring-offset-zinc-925 shadow-lg shadow-violet-700/30' : 'hover:opacity-80'}`}
                                onClick={() => setActiveImageIndex(index)}
                            >
                                <img src={imageB64} alt={`Thumbnail ${index + 1}`} className="object-cover w-full h-full" />
                            </div>
                        ) : (
                             <div 
                                key={`placeholder-${index}`} 
                                className="relative h-full aspect-[3/4] rounded-md overflow-hidden flex-shrink-0 bg-zinc-800 shimmer-bg"
                            />
                        )
                    ))}
                </div>
            </div>
        )}
    </div>
  );
};
import React from 'react';
import { Download, Edit, Lock, Save, Loader2, Bot, Package } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';

export const ImageToolbar: React.FC = () => {
    const { 
        generatedImages, 
        activeImageIndex, 
        startEditing, 
        studioMode, 
        isGenerating,
        isApplyingPost,
        saveModel,
        isSavingModel,
        applyHologramEffect,
        generatePackFromReference,
        ecommercePack,
        productEcommercePack,
    } = useStudio();
    const { hasPermission, incrementGenerationsUsed } = useAuth();

    const activeImage = activeImageIndex !== null && generatedImages ? generatedImages[activeImageIndex] : null;
    const canUseGenerativeEdit = hasPermission('generativeEdit');

    const handleEdit = () => {
        if (activeImageIndex !== null && canUseGenerativeEdit) {
            startEditing(activeImageIndex);
        }
    };
    
    const handleSaveModel = () => {
        if (activeImage) {
            saveModel(activeImage);
        }
    };

    const handleHologram = () => {
        if(activeImage) {
            applyHologramEffect();
        }
    };
    
    const handleGeneratePack = () => {
        generatePackFromReference(incrementGenerationsUsed);
    };

    const handleDownload = () => {
        const link = document.createElement('a');
        if (activeImage) {
            link.href = activeImage;
            link.download = `virtual-photoshoot-${activeImageIndex + 1}.jpg`;
        }
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Shared classes for secondary buttons for consistency
    const secondaryButtonClass = "w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-zinc-100 bg-zinc-800 hover:bg-zinc-700 h-10 px-4 rounded-lg transition-colors border border-white/10 disabled:opacity-60 disabled:cursor-not-allowed";
    
    // In product mode, either the on-model pack ('ecommercePack') or the product-only pack ('productEcommercePack') might be selected.
    // The button should be enabled if either is active to reflect the user's selection, even if the generation function only supports one type.
    const isPackSelected =
      studioMode === 'apparel'
        ? ecommercePack !== 'none'
        : studioMode === 'product'
        ? ecommercePack !== 'none' || productEcommercePack !== 'none'
        : false;

    return (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center sm:justify-end gap-2 w-full">
            {activeImage && studioMode === 'apparel' && (
                <button
                    onClick={handleSaveModel}
                    disabled={isSavingModel}
                    title={'Save this model to "My Agency" for consistent reuse'}
                    className={secondaryButtonClass}
                >
                    {isSavingModel ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span className="hidden lg:inline">Save Model</span>
                </button>
            )}
            {activeImage && (studioMode === 'apparel' || studioMode === 'product') && (
                <button
                    onClick={handleGeneratePack}
                    disabled={isGenerating || !isPackSelected}
                    title={!isPackSelected ? 'Select an E-commerce Pack in Settings to enable' : 'Generate pack with this model'}
                    className={secondaryButtonClass}
                >
                    {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Package size={16} />}
                    <span className="hidden lg:inline">Generate Pack</span>
                </button>
            )}
            {activeImage && studioMode === 'product' && (
                 <button
                    onClick={handleHologram}
                    disabled={!canUseGenerativeEdit || isApplyingPost}
                    title={!canUseGenerativeEdit ? 'This feature is available on Studio and Brand plans' : 'Hologram Effect'}
                    className={secondaryButtonClass}
                >
                    <Bot size={16} />
                    <span className="hidden lg:inline">Hologram FX</span>
                    {!canUseGenerativeEdit && <Lock size={12} className="ml-1 text-violet-400" />}
                </button>
            )}
             {activeImage && (
                <button
                    onClick={handleEdit}
                    disabled={!canUseGenerativeEdit}
                    title={!canUseGenerativeEdit ? 'Generative Edit is available on Studio and Brand plans' : 'Edit Image'}
                    className={secondaryButtonClass}
                >
                    <Edit size={16} />
                    <span className="hidden lg:inline">Edit</span>
                    {!canUseGenerativeEdit && <Lock size={12} className="ml-1 text-violet-400" />}
                </button>
            )}

            {/* Primary Action */}
            <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex items-center justify-center gap-2 text-sm font-semibold text-white bg-brand-primary hover:bg-brand-primary-hover h-10 px-5 rounded-lg transition-all duration-300 shadow-lg shadow-brand-glow/40 hover:shadow-xl hover:shadow-brand-glow/60"
            >
                <Download size={16} />
                <span>Download</span>
            </button>
        </div>
    );
};
import type { PhotoshootConcept, GeneratedPhotoshootImage } from '../types';
import { geminiService } from '../services/geminiService';
import type { StudioStoreSlice, StudioStore } from './StudioContext';
import { withRetry } from '../utils/colorUtils';
import { resizeImage } from '../utils/imageResizer';

export interface PhotoshootState {
    sourceImage: string | null;
    sourceImagePreview: string | null;
    concepts: PhotoshootConcept[];
    isGeneratingConcepts: boolean;
    selectedConceptIds: string[];
    generatedPhotoshootImages: GeneratedPhotoshootImage[];
    isGeneratingPhotoshoot: boolean;
}

export interface PhotoshootActions {
    setSourceImage: (base64: string | null) => Promise<void>;
    generatePhotoshootConcepts: () => Promise<void>;
    toggleConceptSelection: (conceptId: string) => void;
    generatePhotoshoot: () => Promise<void>;
    retryPhotoshootImage: (imageId: string) => Promise<void>;
    _generateSingleImage: (conceptId: string) => Promise<void>;
}

export type PhotoshootSlice = PhotoshootState & PhotoshootActions;

const initialPhotoshootState: PhotoshootState = {
    sourceImage: null,
    sourceImagePreview: null,
    concepts: [],
    isGeneratingConcepts: false,
    selectedConceptIds: [],
    generatedPhotoshootImages: [],
    isGeneratingPhotoshoot: false,
};

export const createPhotoshootSlice: StudioStoreSlice<PhotoshootSlice> = (set: (partial: Partial<StudioStore> | ((state: StudioStore) => Partial<StudioStore>)) => void, get: () => StudioStore) => ({
    ...initialPhotoshootState,

    setSourceImage: async (base64: string | null) => {
        set({ 
            sourceImage: base64, 
            sourceImagePreview: null, 
            concepts: [], 
            selectedConceptIds: [], 
            generatedPhotoshootImages: [] 
        });
        if (base64) {
            try {
                // Create a smaller preview for the UI
                const preview = await resizeImage(base64, 50);
                set({ sourceImagePreview: preview });
            } catch (error) {
                console.error("Failed to create image preview:", error);
                set({ sourceImagePreview: base64 }); // fallback to full image
            }
        }
    },

    generatePhotoshootConcepts: async () => {
        const { sourceImage } = get();
        if (!sourceImage) return;

        set({ isGeneratingConcepts: true, concepts: [], selectedConceptIds: [] });
        try {
            // FIX: Correctly call the new 'generateConceptSuggestions' method. This resolves the error on this line and the following '.map' error.
            const newConcepts = await withRetry(() => geminiService.generateConceptSuggestions(sourceImage));
            set({ concepts: newConcepts, selectedConceptIds: newConcepts.map(c => c.id) });
        } catch (e: any) {
            console.error("Failed to generate concepts:", e);
        } finally {
            set({ isGeneratingConcepts: false });
        }
    },

    toggleConceptSelection: (conceptId: string) => {
        set(state => {
            const newSelection = state.selectedConceptIds.includes(conceptId)
                ? state.selectedConceptIds.filter(id => id !== conceptId)
                : [...state.selectedConceptIds, conceptId];
            return { selectedConceptIds: newSelection };
        });
    },
    
    _generateSingleImage: async (conceptId: string) => {
        const { sourceImage, concepts } = get();
        const concept = concepts.find(c => c.id === conceptId);
        if (!sourceImage || !concept) return;

        try {
            // FIX: Replace non-existent 'generateImageFromPrompt' with 'generateStyledImage' and pass arguments as an array.
            const resultUrl = await withRetry(() => geminiService.generateStyledImage(concept.prompt, [sourceImage]));
            set(state => ({
                generatedPhotoshootImages: state.generatedPhotoshootImages.map(img =>
                    img.conceptId === conceptId ? { ...img, status: 'done', url: resultUrl } : img
                )
            }));
        } catch (err) {
            const message = err instanceof Error ? err.message : "An unknown error occurred.";
            set(state => ({
                generatedPhotoshootImages: state.generatedPhotoshootImages.map(img =>
                    img.conceptId === conceptId ? { ...img, status: 'error', error: message } : img
                )
            }));
            console.error("Failed to generate photoshoot image:", message);
        }
    },

    generatePhotoshoot: async () => {
        const { selectedConceptIds } = get();
        if (selectedConceptIds.length === 0) return;

        set({ isGeneratingPhotoshoot: true });
        
        const imagesToGenerate: GeneratedPhotoshootImage[] = selectedConceptIds.map(conceptId => ({
            id: `${conceptId}-${Date.now()}`,
            conceptId,
            status: 'pending'
        }));
        set({ generatedPhotoshootImages: imagesToGenerate });
        
        // Using Promise.all to run generations in parallel
        await Promise.all(selectedConceptIds.map(conceptId => get()._generateSingleImage(conceptId)));

        set({ isGeneratingPhotoshoot: false });
    },

    retryPhotoshootImage: async (imageId: string) => {
        const imageToRetry = get().generatedPhotoshootImages.find(img => img.id === imageId);
        if (!imageToRetry) return;

        set(state => ({
            generatedPhotoshootImages: state.generatedPhotoshootImages.map(img =>
                img.id === imageId ? { ...img, status: 'pending', error: undefined } : img
            )
        }));

        await get()._generateSingleImage(imageToRetry.conceptId);
    },
});
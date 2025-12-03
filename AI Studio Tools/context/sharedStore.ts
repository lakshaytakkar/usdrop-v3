import {
  StudioMode,
  Scene,
  AspectRatio,
  Animation,
  ColorGrade,
  Look,
  Background,
  User
} from '../types';
import {
  ASPECT_RATIOS_LIBRARY,
  BACKGROUNDS_LIBRARY,
  LIGHTING_PRESETS,
  ECOMMERCE_PACKS,
  SOCIAL_MEDIA_PACK_SHOT_IDS,
  MOCKUP_PACK_SHOTS_3,
  MOCKUP_PACK_SHOTS_4,
  PRODUCT_ECOMMERCE_PACKS,
  SHOT_TYPES_LIBRARY,
  EXPRESSIONS,
  CAMERA_ANGLES_LIBRARY,
  FOCAL_LENGTHS_LIBRARY,
  CAMERA_ANGLES_LIBRARY_PRODUCT,
} from '../constants';
import { promptService } from '../services/promptService';
import { geminiService } from '../services/geminiService';
import type { StudioStoreSlice, StudioStore } from './StudioContext';
import { withRetry } from '../utils/colorUtils';
// FIX: Correctly import PLAN_DETAILS from permissionsService
import { PLAN_DETAILS } from '../services/permissionsService';

let generationController: AbortController | null = null;

const initialScene: Scene = {
    background: BACKGROUNDS_LIBRARY[0],
    lighting: LIGHTING_PRESETS[1], // Studio Softbox
    timeOfDay: null,
    sceneProps: '',
    environmentalEffects: '',
};

export interface SharedState {
  studioMode: StudioMode;
  scene: Scene;
  aspectRatio: AspectRatio;
  numberOfImages: number;
  isGenerating: boolean;
  loadingMessage: string;
  generatedImages: (string | null)[] | null;
  activeImageSources: { web: { uri: string; title: string; } }[] | null;
  generatedVideoUrl: string | null;
  videoSourceImage: string | null; // For video thumbnail
  activeImageIndex: number | null;
  error: string | null;
  generationCount: number;
  styleReferenceImage: string | null;
  isEditing: boolean;
  imageBeingEdited: { original: string; index: number } | null;
  isApplyingEdit: boolean;
  isApplyingPost: boolean;
  isGuideActive: boolean;
  isBestPracticesModalOpen: boolean;
  isGeneratingBackground: boolean;
  requestTimestamps: number[];
}

export interface SharedActions {
  setStudioMode: (mode: StudioMode) => void;
  updateScene: (updates: Partial<Scene>) => void;
  selectAspectRatio: (aspectRatio: AspectRatio) => void;
  setNumberOfImages: (count: number) => void;
  setActiveImageIndex: (index: number | null) => void;
  clearError: () => void;
  generateAsset: (user: User | null, onGenerationComplete: (count: number) => Promise<void>) => Promise<void>;
  generateBackView: (onGenerationComplete: (count: number) => Promise<void>) => Promise<void>;
  cancelCurrentProcess: () => void;
  setStyleReferenceImage: (base64: string | null) => void;
  startEditing: (index: number) => void;
  cancelEditing: () => void;
  applyGenerativeEdit: (maskB64: string, prompt: string, apparelRefB64?: string | null) => Promise<void>;
  revertEdit: () => void;
  applyColorGrade: (grade: ColorGrade) => Promise<void>;
  applyRealismBoost: () => Promise<void>;
  applyFilmGrain: (strength: 'Subtle' | 'Medium') => Promise<void>;
  applyHologramEffect: () => Promise<void>;
  generateVideoFromImage: (animation: Animation, onGenerationComplete: (count: number) => Promise<void>) => Promise<void>;
  generatePackFromReference: (onGenerationComplete: (count: number) => Promise<void>) => Promise<void>;
  generateColorways: (colors: string[], onGenerationComplete: (count: number) => Promise<void>) => Promise<void>;
  generateAIBackground: (prompt: string) => Promise<void>;
  setGuideActive: (isActive: boolean) => void;
  setBestPracticesModalOpen: (isOpen: boolean) => void;
}

export type SharedSlice = SharedState & SharedActions;

const initialSharedState: SharedState = {
    studioMode: 'apparel',
    scene: initialScene,
    aspectRatio: ASPECT_RATIOS_LIBRARY[0],
    numberOfImages: 1,
    isGenerating: false,
    loadingMessage: 'Generating your vision...',
    generatedImages: null,
    activeImageSources: null,
    generatedVideoUrl: null,
    videoSourceImage: null,
    activeImageIndex: null,
    error: null,
    generationCount: 0,
    styleReferenceImage: null,
    isEditing: false,
    imageBeingEdited: null,
    isApplyingEdit: false,
    isApplyingPost: false,
    isGuideActive: false,
    isBestPracticesModalOpen: false,
    isGeneratingBackground: false,
    requestTimestamps: [],
};


export const createSharedSlice: StudioStoreSlice<SharedSlice> = (set: (partial: Partial<StudioStore> | ((state: StudioStore) => Partial<StudioStore>)) => void, get: () => StudioStore) => ({
  ...initialSharedState,

  setStudioMode: (mode: StudioMode) => set({ studioMode: mode }),

  updateScene: (updates: Partial<Scene>) => {
    set(state => ({ scene: { ...state.scene, ...updates } }));
  },

  selectAspectRatio: (aspectRatio: AspectRatio) => set({ aspectRatio }),

  setNumberOfImages: (count: number) => set({ numberOfImages: count }),

  setActiveImageIndex: (index: number | null) => set({ activeImageIndex: index, generatedVideoUrl: null }),

  clearError: () => set({ error: null }),
  
  setStyleReferenceImage: (base64: string | null) => set({ styleReferenceImage: base64 }),

  cancelCurrentProcess: () => {
    if (generationController) {
      generationController.abort();
    }
    set({ isGenerating: false, loadingMessage: '' });
  },

  generateAsset: async (user: User | null, onGenerationComplete: (count: number) => Promise<void>) => {
    // --- RATE LIMIT TRACKING ---
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentTimestamps = get().requestTimestamps.filter(ts => ts > oneMinuteAgo);
    set({ requestTimestamps: [...recentTimestamps, now] });
    // --- END RATE LIMIT TRACKING ---

    set({
      isGenerating: true,
      error: null,
      generatedImages: null,
      generatedVideoUrl: null,
      activeImageIndex: 0,
      loadingMessage: 'Preparing your vision...',
    });

    const { studioMode } = get();
    
    const onRetry = (attempt: number, delay: number) => {
        set({ loadingMessage: `API is busy. Retrying in ${Math.ceil(delay / 1000)}s... (Attempt ${attempt})` });
    };

    try {
      if (studioMode === 'apparel') {
        const { isSocialMediaPack, ecommercePack, isCompletePack, numberOfImages, selectedModels, isBatchMode, apparelControls } = get();
        
        const generateSocialPack = async (imageIndexOffset = 0, initialBaseLookImageB64?: string) => {
            const packShotIds = SOCIAL_MEDIA_PACK_SHOT_IDS;
            const aspectRatios: AspectRatio['value'][] = ['1:1', '9:16'];
            const totalImagesInPack = packShotIds.length * aspectRatios.length;

            let baseLookImageB64: string | null = initialBaseLookImageB64 || null;
            let generatedCount = 0;
            
            for (const ar of aspectRatios) {
                for (const shotId of packShotIds) {
                    const currentIndex = imageIndexOffset + generatedCount;
                    set({ loadingMessage: `Generating Social Pack... (${currentIndex % totalImagesInPack + 1}/${totalImagesInPack})` });
                    
                    const state = get();
                    const shotType = SHOT_TYPES_LIBRARY.find(s => s.id === shotId) || state.apparelControls.shotType;
                    const overriddenControls = { ...state.apparelControls, shotType };
                    
                    const { parts } = promptService.generatePrompt({ ...state, studioMode: 'apparel', generationMode: 'image', apparelControls: overriddenControls, aspectRatio: ar, baseLookImageB64: baseLookImageB64 });
                    
                    await withRetry(() => geminiService.generatePhotoshootImage(parts, ar, 1, overriddenControls.negativePrompt, (imageB64) => {
                        if (!baseLookImageB64) {
                            baseLookImageB64 = imageB64;
                        }
                        set(currentState => {
                            const newImages = [...(currentState.generatedImages || [])];
                            if (newImages.length > currentIndex) newImages[currentIndex] = imageB64;
                            return { generatedImages: newImages };
                        });
                    }), { onRetry });
                    generatedCount++;
                }
            }
            return totalImagesInPack;
        };

        const generateEcomPack = async (imageIndexOffset = 0) => {
            const packKey = get().ecommercePack;
            if(packKey === 'none') return 0;

            const pack = ECOMMERCE_PACKS[packKey];
            const packShots = pack.shots;
            const totalImages = packShots.length;

            let baseLookImageB64: string | null = null;
            
            for (const [index, shot] of packShots.entries()) {
                const currentIndex = imageIndexOffset + index;
                set({ loadingMessage: `Generating ${pack.name}... (${index + 1}/${totalImages})` });
                
                const state = get();
                const shotType = SHOT_TYPES_LIBRARY.find(s => s.id === shot.shotId) || state.apparelControls.shotType;
                const expression = EXPRESSIONS.find(e => e.id === shot.expressionId) || state.apparelControls.expression;
                const cameraAngle = CAMERA_ANGLES_LIBRARY.find(c => c.id === shot.cameraAngleId) || state.apparelControls.cameraAngle;

                const overriddenControls = { ...state.apparelControls, shotType, expression, cameraAngle };
                
                const { parts } = promptService.generatePrompt({ ...state, studioMode: 'apparel', generationMode: 'image', apparelControls: overriddenControls, aspectRatio: state.aspectRatio.value, baseLookImageB64: baseLookImageB64 });

                await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, overriddenControls.negativePrompt, (imageB64) => {
                    if (!baseLookImageB64) {
                        baseLookImageB64 = imageB64;
                    }
                    set(currentState => {
                        const newImages = [...(currentState.generatedImages || [])];
                        if (newImages.length > currentIndex) newImages[currentIndex] = imageB64;
                        return { generatedImages: newImages };
                    });
                }), { onRetry });
            }
            return totalImages;
        };
        
        const modelsToProcess = isBatchMode && selectedModels.length > 0 ? selectedModels : [null];
        const modelCount = modelsToProcess.length;
        const originalSelectedModels = [...selectedModels];
        let totalImagesToGenerate = 0;
        let totalGeneratedThisRun = 0;

        if (isCompletePack) {
            totalImagesToGenerate = (ECOMMERCE_PACKS['essential'].shots.length + (SOCIAL_MEDIA_PACK_SHOT_IDS.length * 2)) * modelCount;
        } else if (isSocialMediaPack) {
            totalImagesToGenerate = (SOCIAL_MEDIA_PACK_SHOT_IDS.length * 2) * modelCount;
        } else if (ecommercePack !== 'none') {
            totalImagesToGenerate = ECOMMERCE_PACKS[ecommercePack].shots.length * modelCount;
        } else {
            totalImagesToGenerate = numberOfImages * modelCount;
        }
        set({ generatedImages: Array(totalImagesToGenerate).fill(null), activeImageIndex: 0 });


        for (const [modelIndex, model] of modelsToProcess.entries()) {
            if (model) {
                set({ selectedModels: [model] });
            }

            if (isCompletePack) {
                const essentialPackSize = ECOMMERCE_PACKS['essential'].shots.length;
                const socialPackSize = SOCIAL_MEDIA_PACK_SHOT_IDS.length * 2;
                const modelOffset = modelIndex * (essentialPackSize + socialPackSize);
                
                const originalEcomPack = get().ecommercePack;
                set({ ecommercePack: 'essential' });
                totalGeneratedThisRun += await generateEcomPack(modelOffset);
                set({ ecommercePack: originalEcomPack });

                const baseLookForSocial = get().generatedImages?.[modelOffset];
                
                totalGeneratedThisRun += await generateSocialPack(modelOffset + essentialPackSize, baseLookForSocial || undefined);

            } else if (isSocialMediaPack) {
                const packSize = SOCIAL_MEDIA_PACK_SHOT_IDS.length * 2;
                const offset = modelIndex * packSize;
                totalGeneratedThisRun += await generateSocialPack(offset);

            } else if (ecommercePack !== 'none') {
                const packSize = ECOMMERCE_PACKS[ecommercePack].shots.length;
                const offset = modelIndex * packSize;
                totalGeneratedThisRun += await generateEcomPack(offset);

            } else {
                const offset = modelIndex * numberOfImages;
                const { parts } = promptService.generatePrompt({ ...get(), studioMode: 'apparel', generationMode: 'image', aspectRatio: get().aspectRatio.value });
                await withRetry(() => geminiService.generatePhotoshootImage(parts, get().aspectRatio.value, numberOfImages, apparelControls.negativePrompt, (imageB64, index) => {
                  set(state => {
                    const newImages = [...(state.generatedImages || [])];
                    newImages[offset + index] = imageB64;
                    return { generatedImages: newImages };
                  });
                }), { onRetry });
                totalGeneratedThisRun += numberOfImages;
            }
        }
        
        if (isBatchMode) {
            set({ selectedModels: originalSelectedModels });
        }
        await onGenerationComplete(totalGeneratedThisRun);

      } else if (studioMode === 'product') {
        const { productEcommercePack, ecommercePack, selectedModels, uploadedModelImage, isBatchMode, numberOfImages } = get();
        const isModelSelected = !!uploadedModelImage || (selectedModels && selectedModels.length > 0);
        
        const modelsToProcess = isBatchMode && selectedModels.length > 0 ? selectedModels : [null];
        const modelCount = modelsToProcess.length;
        const originalSelectedModels = [...selectedModels];
        let totalGeneratedThisRun = 0;

        if (isModelSelected && ecommercePack !== 'none') {
            const pack = ECOMMERCE_PACKS[ecommercePack];
            const packShots = pack.shots;
            const totalImages = packShots.length * modelCount;
            set({ generatedImages: Array(totalImages).fill(null), activeImageIndex: 0 });

            for (const [modelIndex, model] of modelsToProcess.entries()) {
                if (model) {
                    set({ selectedModels: [model] });
                }
                const modelOffset = modelIndex * packShots.length;

                let modelReferenceImage: string | null = null;

                for (const [index, shot] of packShots.entries()) {
                    const currentIndex = modelOffset + index;
                    set({ loadingMessage: `Generating ${pack.name}... (${currentIndex + 1}/${totalImages})` });
                    
                    const state = get();
                    const shotType = SHOT_TYPES_LIBRARY.find(s => s.id === shot.shotId) || state.productControls.shotType;
                    const expression = EXPRESSIONS.find(e => e.id === shot.expressionId) || state.productControls.expression;
                    const cameraAngle = CAMERA_ANGLES_LIBRARY.find(c => c.id === shot.cameraAngleId) || state.productControls.cameraAngle;

                    const overriddenControls = { ...state.productControls, shotType, expression, cameraAngle };
                    const { parts } = promptService.generatePrompt({ ...state, studioMode: 'product', generationMode: 'image', productControls: overriddenControls, aspectRatio: state.aspectRatio.value, modelReferenceImage: modelReferenceImage });

                    await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, overriddenControls.negativePrompt, (imageB64) => {
                        if (!modelReferenceImage) {
                            modelReferenceImage = imageB64;
                        }
                        set(currentState => {
                            const newImages = [...(currentState.generatedImages || [])];
                            if (newImages.length > currentIndex) newImages[currentIndex] = imageB64;
                            return { generatedImages: newImages };
                        });
                    }), { onRetry });
                }
            }
            if (isBatchMode) set({ selectedModels: originalSelectedModels });
            totalGeneratedThisRun = totalImages;

        } else if (!isModelSelected && productEcommercePack !== 'none') {
            const pack = PRODUCT_ECOMMERCE_PACKS[productEcommercePack];
            const packShots = pack.shots;
            set({ generatedImages: Array(packShots.length).fill(null), activeImageIndex: 0, loadingMessage: `Generating ${pack.name}... (1/${packShots.length})` });
    
            for (const [index, shot] of packShots.entries()) {
                set({ loadingMessage: `Generating ${pack.name}... (${index + 1}/${packShots.length})` });
                const state = get();
                
                const cameraAngle = CAMERA_ANGLES_LIBRARY_PRODUCT.find(c => c.id === shot.cameraAngleId) || state.productControls.cameraAngle;
                const focalLength = FOCAL_LENGTHS_LIBRARY.find(f => f.id === shot.focalLengthId) || state.productControls.focalLength;
    
                const overriddenControls = { ...state.productControls, cameraAngle, focalLength };
                
                const { parts } = promptService.generatePrompt({ ...state, studioMode: 'product', generationMode: 'image', productControls: overriddenControls, aspectRatio: state.aspectRatio.value });
    
                await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, overriddenControls.negativePrompt, (imageB64) => {
                    set(currentState => {
                        const newImages = [...(currentState.generatedImages || [])];
                        if (newImages.length > index) newImages[index] = imageB64;
                        return { generatedImages: newImages };
                    });
                }), { onRetry });
            }
            totalGeneratedThisRun = packShots.length;
    
        } else {
            const totalImages = numberOfImages * modelCount;
            set({ generatedImages: Array(totalImages).fill(null), activeImageIndex: 0 });

            for (const [modelIndex, model] of modelsToProcess.entries()) {
                if (model) set({ selectedModels: [model] });
                
                const { parts } = promptService.generatePrompt({ ...get(), studioMode: 'product', generationMode: 'image', aspectRatio: get().aspectRatio.value });
                const { productControls } = get();
                
                await withRetry(() => geminiService.generatePhotoshootImage(parts, get().aspectRatio.value, numberOfImages, productControls.negativePrompt, (imageB64, index) => {
                    set(state => {
                        const newImages = [...(state.generatedImages || [])];
                        newImages[modelIndex * numberOfImages + index] = imageB64;
                        return { generatedImages: newImages };
                    });
                }), { onRetry });
            }
            if (isBatchMode) set({ selectedModels: originalSelectedModels });
            totalGeneratedThisRun = totalImages;
        }

        await onGenerationComplete(totalGeneratedThisRun);
        
      } else if (studioMode === 'design') {
        const { designPlacementControls, backDesignImage, numberOfImages, mockupImage, designImage } = get();
        if (!mockupImage || !designImage) {
            throw new Error("Mockup image and design image are required for design mode.");
        }
        const isPackMode = designPlacementControls.isMockupPackActive;
        let totalGeneratedThisRun = 0;

        if (isPackMode) {
            const packShots = backDesignImage ? MOCKUP_PACK_SHOTS_4 : MOCKUP_PACK_SHOTS_3;
            const totalImages = packShots.length;
            set({ generatedImages: Array(totalImages).fill(null), activeImageIndex: 0 });

            for (const [index, shot] of packShots.entries()) {
                set({ loadingMessage: `Generating Mockup Pack... (${index + 1}/${totalImages})` });
                const state = get();
                if (!state.mockupImage || !state.designImage) {
                    throw new Error("Mockup image and design image are required for design mode.");
                }
                const overriddenControls = {
                    ...state.designPlacementControls,
                    cameraAngle: shot.angle,
                    lightingStyle: shot.lighting,
                };

                const { parts } = promptService.generatePrompt({
                    ...state,
                    studioMode: 'design',
                    shotView: shot.view,
                    designPlacementControls: overriddenControls,
                    aspectRatio: state.aspectRatio.value,
                    mockupImage: state.mockupImage,
                    designImage: state.designImage,
                });

                await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, undefined, (imageB64) => {
                    set(currentState => {
                        const newImages = [...(currentState.generatedImages || [])];
                        if (newImages.length > index) {
                            newImages[index] = imageB64;
                        }
                        return { generatedImages: newImages };
                    });
                }), { onRetry });
            }
            totalGeneratedThisRun = totalImages;
        } else {
            set({ generatedImages: Array(numberOfImages).fill(null), activeImageIndex: 0 });
            const state = get();
            if (!state.mockupImage || !state.designImage) {
                throw new Error("Mockup image and design image are required for design mode.");
            }
            const { parts } = promptService.generatePrompt({ ...state, studioMode: 'design', shotView: 'front', aspectRatio: state.aspectRatio.value, mockupImage: state.mockupImage, designImage: state.designImage });
            await withRetry(() => geminiService.generatePhotoshootImage(parts, get().aspectRatio.value, numberOfImages, undefined, (imageB64, index) => {
                set(state => {
                    const newImages = [...(state.generatedImages || Array(numberOfImages).fill(null))];
                    newImages[index] = imageB64;
                    return { generatedImages: newImages };
                });
            }), { onRetry });
            totalGeneratedThisRun = numberOfImages;
        }
        await onGenerationComplete(totalGeneratedThisRun);
      } else if (studioMode === 'reimagine') {
        const state = get();
        if (!state.reimagineSourcePhoto) {
            throw new Error("Source photo is required for reimagine mode.");
        }
        const { parts } = promptService.generatePrompt({ ...state, studioMode: 'reimagine', aspectRatio: state.aspectRatio.value, reimagineSourcePhoto: state.reimagineSourcePhoto });
        const { numberOfImages, reimagineControls } = state;
        await withRetry(() => geminiService.generatePhotoshootImage(parts, get().aspectRatio.value, numberOfImages, reimagineControls.negativePrompt, (imageB64, index) => {
            set(state => {
                const newImages = [...(state.generatedImages || Array(numberOfImages).fill(null))];
                newImages[index] = imageB64;
                return { generatedImages: newImages };
            });
        }), { onRetry });
        await onGenerationComplete(numberOfImages);
      }
    } catch (e: any) {
      console.error(e);
      set({ error: e.message || 'An unknown error occurred during generation.' });
    } finally {
      set({ isGenerating: false, generationCount: get().generationCount + 1 });
    }
  },

  generateBackView: async (onGenerationComplete: (count: number) => Promise<void>) => {
    if (get().isGenerating) return;

    // Rate limit check
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    const recentTimestamps = get().requestTimestamps.filter(ts => ts > oneMinuteAgo);
    set({ requestTimestamps: [...recentTimestamps, now] });

    set({
        isGenerating: true,
        error: null,
        loadingMessage: 'Generating back view...',
    });

    const onRetry = (attempt: number, delay: number) => {
        set({ loadingMessage: `API is busy. Retrying... (Attempt ${attempt})` });
    };

    try {
        const { backDesignImage, numberOfImages, studioMode } = get();
        if (studioMode !== 'design') throw new Error("This action is only for Design mode.");
        if (!backDesignImage) throw new Error("Please upload a back design image first.");

        const existingImages = get().generatedImages?.filter(img => img !== null) as string[] || [];
        const placeholders = Array(numberOfImages).fill(null);
        set({ generatedImages: [...existingImages, ...placeholders] });

        const state = get();
        if (!state.mockupImage || !state.designImage) {
            throw new Error("Mockup image and design image are required for design mode.");
        }
        const { parts } = promptService.generatePrompt({
            ...state,
            studioMode: 'design',
            shotView: 'back',
            aspectRatio: state.aspectRatio.value,
            mockupImage: state.mockupImage,
            designImage: state.designImage,
        });

        let generatedCount = 0;
        await withRetry(() => geminiService.generatePhotoshootImage(parts, get().aspectRatio.value, numberOfImages, undefined, (imageB64, index) => {
            generatedCount++;
            set(state => {
                const currentImages = [...(state.generatedImages || [])];
                const insertionIndex = existingImages.length + index;
                currentImages[insertionIndex] = imageB64;
                return {
                    generatedImages: currentImages,
                    activeImageIndex: insertionIndex, // Focus on the newly generated image
                };
            });
        }), { onRetry });

        await onGenerationComplete(generatedCount);

    } catch (e: any) {
        console.error(e);
        set({ error: e.message || 'An unknown error occurred during back view generation.' });
        // Clean up placeholders on error
        set(state => ({
            generatedImages: state.generatedImages?.filter(img => img !== null) || null
        }));
    } finally {
        set({ isGenerating: false, generationCount: get().generationCount + 1 });
    }
  },

  startEditing: (index: number) => {
    const original = get().generatedImages?.[index];
    if (original) {
      set({ isEditing: true, imageBeingEdited: { original, index }, error: null });
    }
  },

  cancelEditing: () => {
    const { imageBeingEdited } = get();
    if(imageBeingEdited) {
       set(state => {
         const newImages = [...(state.generatedImages || [])];
         newImages[imageBeingEdited.index] = imageBeingEdited.original;
         return {
           isEditing: false,
           imageBeingEdited: null,
           generatedImages: newImages,
         }
       })
    } else {
        set({ isEditing: false, imageBeingEdited: null });
    }
  },
  
  revertEdit: () => {
      const { imageBeingEdited } = get();
      if(imageBeingEdited) {
          set(state => {
             const newImages = [...(state.generatedImages || [])];
             newImages[imageBeingEdited.index] = imageBeingEdited.original;
             return { generatedImages: newImages, generationCount: state.generationCount + 1 };
          });
      }
  },
  
  applyGenerativeEdit: async (maskB64: string, prompt: string, apparelRefB64?: string | null) => {
    const { activeImageIndex, generatedImages } = get();
    if (activeImageIndex === null || !generatedImages?.[activeImageIndex]) return;

    set({ isApplyingEdit: true, error: null, loadingMessage: 'Applying generative edit...' });
    const onRetry = (attempt: number, delay: number) => {
        set({ loadingMessage: `API is busy. Retrying in ${Math.ceil(delay / 1000)}s... (Attempt ${attempt})` });
    };

    try {
      const originalImageB64 = generatedImages[activeImageIndex]!;
      const result = await withRetry(() => geminiService.generativeEdit({
        originalImageB64,
        maskImageB64: maskB64,
        prompt,
        apparelImageB64: apparelRefB64
      }), { onRetry });
      set(state => {
        const newImages = [...(state.generatedImages || [])];
        newImages[activeImageIndex] = result;
        return {
          generatedImages: newImages,
          generationCount: state.generationCount + 1,
        };
      });
    } catch (e: any) {
      set({ error: e.message || "Generative edit failed." });
    } finally {
      set({ isApplyingEdit: false });
    }
  },
  
  applyColorGrade: async(grade: ColorGrade) => {},
  applyRealismBoost: async() => {},
  applyFilmGrain: async(strength: 'Subtle' | 'Medium') => {},
  applyHologramEffect: async() => {},
  generateVideoFromImage: async (animation: Animation, onGenerationComplete: (count: number) => Promise<void>) => {
    const { studioMode, activeImageIndex, generatedImages, aspectRatio } = get();
    if (activeImageIndex === null || !generatedImages || !generatedImages[activeImageIndex]) {
        set({ error: "No reference image selected to generate a video from." });
        return;
    }
    const referenceImageB64 = generatedImages[activeImageIndex];

    set({
        isGenerating: true,
        error: null,
        generatedVideoUrl: null,
        videoSourceImage: referenceImageB64,
        loadingMessage: `Animating your image...`,
        activeImageIndex: null, // Switch view to video player
    });
    
    const onRetry = (attempt: number, delay: number) => {
        set({ loadingMessage: `API is busy. Retrying in ${Math.ceil(delay / 1000)}s... (Attempt ${attempt})` });
    };

    generationController = new AbortController();
    const signal = generationController.signal;

    try {
        let promptParams: any;

        if (studioMode === 'apparel') {
            promptParams = { ...get(), studioMode: 'apparel' as const, generationMode: 'video', animation, aspectRatio: get().aspectRatio.value };
        } else if (studioMode === 'product') {
            promptParams = { ...get(), studioMode: 'product' as const, generationMode: 'video', animation, aspectRatio: get().aspectRatio.value };
        } else {
            throw new Error("Video generation is not supported in this mode.");
        }

        const { parts } = promptService.generatePrompt(promptParams);
        const textPrompt = parts.find(p => 'text' in p)?.text || '';
        if (!textPrompt) throw new Error("Could not generate a valid prompt for video generation.");

        set({ loadingMessage: 'Sending to video model...' });
        // FIX: Add 'any' type to operation to resolve property access errors.
        let operation: any = await withRetry(() => geminiService.generatePhotoshootVideo(textPrompt, aspectRatio.value, referenceImageB64), { onRetry });
        
        if (signal.aborted) return;
        
        set({ loadingMessage: 'Video is processing... This may take a few minutes.' });
        
        while (!operation.done) {
            if (signal.aborted) {
                // TODO: Add cancellation logic on the backend if available
                console.log('Video generation cancelled by user.');
                return;
            }
            await new Promise(resolve => setTimeout(resolve, 10000)); // Poll every 10 seconds
            if (signal.aborted) return;
            operation = await geminiService.getVideoOperationStatus(operation);
        }

        if (signal.aborted) return;
        
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (downloadLink) {
            set({ loadingMessage: 'Fetching final video...' });
            const blobUrl = await geminiService.fetchVideoAsBlobUrl(downloadLink);
            if (signal.aborted) {
                URL.revokeObjectURL(blobUrl);
                return;
            }
            set({ generatedVideoUrl: blobUrl });
            await onGenerationComplete(1); // Consumes 1 generation credit
        } else {
            throw new Error("Video generation completed but no video URL was returned.");
        }

    } catch (e: any) {
        if (e.name === 'AbortError' || signal.aborted) {
            console.log('Video generation cancelled by user.');
            return;
        }
        console.error("Failed to generate video:", e);
        set({ error: e.message || "An unknown error occurred during video generation." });
    } finally {
        set({ isGenerating: false, loadingMessage: '' });
        generationController = null;
    }
},
  generatePackFromReference: async (onGenerationComplete: (count: number) => Promise<void>) => {
    const { studioMode, activeImageIndex, generatedImages } = get();
    if (activeImageIndex === null || !generatedImages || !generatedImages[activeImageIndex]) {
      set({ error: "No reference image selected to generate a pack." });
      return;
    }

    const referenceImageB64 = generatedImages[activeImageIndex];

    set({
      isGenerating: true,
      error: null,
      generatedVideoUrl: null,
      videoSourceImage: null,
      loadingMessage: `Generating asset pack...`,
    });
    
    const onRetry = (attempt: number, delay: number) => {
        set({ loadingMessage: `API is busy. Retrying in ${Math.ceil(delay / 1000)}s... (Attempt ${attempt})` });
    };

    try {
      if (studioMode === 'apparel') {
        const { ecommercePack } = get();
        if (ecommercePack === 'none') throw new Error("No e-commerce pack is selected in the settings.");
        
        const pack = ECOMMERCE_PACKS[ecommercePack];
        const packShots = pack.shots;

        set({ generatedImages: Array(packShots.length).fill(null), activeImageIndex: 0 });

        for (const [index, shot] of packShots.entries()) {
            const state = get();
            const shotType = SHOT_TYPES_LIBRARY.find(s => s.id === shot.shotId) || state.apparelControls.shotType;
            const expression = EXPRESSIONS.find(e => e.id === shot.expressionId) || state.apparelControls.expression;
            const cameraAngle = CAMERA_ANGLES_LIBRARY.find(c => c.id === shot.cameraAngleId) || state.apparelControls.cameraAngle;

            const overriddenControls = { ...state.apparelControls, shotType, expression, cameraAngle };

            const { parts } = promptService.generatePrompt({
                ...state,
                studioMode: 'apparel',
                generationMode: 'image',
                apparelControls: overriddenControls,
                aspectRatio: state.aspectRatio.value,
                baseLookImageB64: referenceImageB64,
            });

            await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, overriddenControls.negativePrompt, (imageB64) => {
                set(currentState => {
                    const newImages = [...(currentState.generatedImages || [])];
                    if (newImages.length > index) newImages[index] = imageB64;
                    return { generatedImages: newImages };
                });
            }), { onRetry });
        }
        await onGenerationComplete(packShots.length);

      } else if (studioMode === 'product') {
        const { ecommercePack, productEcommercePack } = get();

        // This function only supports on-model pack generation, which uses `ecommercePack`.
        if (ecommercePack === 'none') {
            if (productEcommercePack !== 'none') {
                // If the user selected a product-only pack, guide them with a specific error.
                throw new Error("Generating a pack from a reference image is for on-model shots. Please select a model and choose a pack from the 'E-commerce Pack' options.");
            } else {
                throw new Error("Select an E-commerce Pack in Settings for on-model pack generation.");
            }
        }
        
        const pack = ECOMMERCE_PACKS[ecommercePack];
        const packShots = pack.shots;

        set({ generatedImages: Array(packShots.length).fill(null), activeImageIndex: 0 });
        
        for (const [index, shot] of packShots.entries()) {
            const state = get();
            const shotType = SHOT_TYPES_LIBRARY.find(s => s.id === shot.shotId) || state.productControls.shotType;
            const expression = EXPRESSIONS.find(e => e.id === shot.expressionId) || state.productControls.expression;
            const cameraAngle = CAMERA_ANGLES_LIBRARY.find(c => c.id === shot.cameraAngleId) || state.productControls.cameraAngle;
            
            const overriddenControls = { ...state.productControls, shotType, expression, cameraAngle };

            const { parts } = promptService.generatePrompt({
                ...state,
                studioMode: 'product',
                generationMode: 'image',
                productControls: overriddenControls,
                aspectRatio: state.aspectRatio.value,
                modelReferenceImage: referenceImageB64, 
            });

            await withRetry(() => geminiService.generatePhotoshootImage(parts, state.aspectRatio.value, 1, overriddenControls.negativePrompt, (imageB64) => {
                set(currentState => {
                    const newImages = [...(currentState.generatedImages || [])];
                    if (newImages.length > index) newImages[index] = imageB64;
                    return { generatedImages: newImages };
                });
            }), { onRetry });
        }

        await onGenerationComplete(packShots.length);
      } else {
        throw new Error("Pack generation is not available in this mode.");
      }
    } catch (e: any) {
      console.error(e);
      set({ error: e.message || 'An unknown error occurred during pack generation.' });
    } finally {
      set({ isGenerating: false, generationCount: get().generationCount + 1 });
    }
  },
  generateColorways: async(colors: string[], onGenerationComplete: (count: number) => Promise<void>) => {},
  
  generateAIBackground: async (prompt: string) => {
    set({ isGeneratingBackground: true, error: null });
    try {
      const imageB64 = await withRetry(() => geminiService.generateWithImagen(prompt, '16:9'));
      const newBg: Background = {
        id: 'custom',
        name: 'AI: ' + prompt.substring(0, 20) + '...',
        type: 'image',
        value: imageB64,
        category: 'Custom'
      };
      get().updateScene({ background: newBg });
    } catch(e: any) {
      set({ error: "Failed to generate AI background. " + e.message });
    } finally {
      set({ isGeneratingBackground: false });
    }
  },

  setGuideActive: (isActive: boolean) => set({ isGuideActive: isActive }),
  setBestPracticesModalOpen: (isOpen: boolean) => set({ isBestPracticesModalOpen: isOpen }),
});
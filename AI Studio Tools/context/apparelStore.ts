import type { AIModel, ApparelCreativeControls, ApparelItem, ArtDirectorSuggestion, EcommercePack, ShotType, CameraAngle, ApparelCategory, Scene, Look } from '../types';
// FIX: Import BACKGROUNDS_LIBRARY to resolve reference error.
import { APERTURES_LIBRARY, BACKGROUNDS_LIBRARY, CAMERA_ANGLES_LIBRARY, COLOR_GRADING_PRESETS, EXPRESSIONS, FABRIC_TYPES_LIBRARY, FOCAL_LENGTHS_LIBRARY, LIGHTING_PRESETS, SHOT_TYPES_LIBRARY, LIGHTING_DIRECTIONS_LIBRARY, LIGHT_QUALITIES_LIBRARY, CATCHLIGHT_STYLES_LIBRARY } from '../constants';
import { geminiService } from '../services/geminiService';
import type { StudioStoreSlice } from './StudioContext';
import { withRetry } from '../utils/colorUtils';

export interface ApparelState {
  uploadedModelImage: string | null;
  selectedModels: AIModel[];
  myModels: AIModel[];
  isSavingModel: boolean;
  apparel: ApparelItem[];
  modelLightingDescription: string | null;
  isAnalyzingLighting: boolean;
  isSuggestingLayering: boolean;
  apparelControls: ApparelCreativeControls;
  artDirectorSuggestions: ArtDirectorSuggestion[] | null;
  isFetchingSuggestion: boolean;
  appliedSuggestionId: string | null;
  isBatchMode: boolean;
  ecommercePack: EcommercePack;
  isSocialMediaPack: boolean;
  isCompletePack: boolean;
  promptedModelDescription: string;
  isGeneratingModel: boolean;
  preConceptState: { apparelControls: ApparelCreativeControls; scene: Scene } | null;
  looks: Look[];
}

export interface ApparelActions {
  setUploadedModelImage: (base64: string | null) => void;
  setSelectedModels: (models: AIModel[]) => void;
  handleModelSelection: (model: AIModel) => void;
  saveModel: (imageB64: string) => Promise<void>;
  addApparelItem: (base64: string) => Promise<void>;
  removeApparelItem: (id: string) => void;
  reorderApparel: (dragIndex: number, hoverIndex: number) => void;
  suggestAndApplyLayering: () => Promise<void>;
  updateApparelItemDescription: (id: string, description: string) => void;
  updateApparelItemCategory: (id: string, category: ApparelCategory) => void;
  updateApparelItemView: (id: string, viewType: 'back' | 'detail', base64: string | null) => void;
  analyzeAndSetModelLighting: () => Promise<void>;
  updateApparelControl: <K extends keyof ApparelCreativeControls>(key: K, value: ApparelCreativeControls[K]) => void;
  applyArtDirectorSuggestion: (suggestion: ArtDirectorSuggestion) => void;
  removeArtDirectorSuggestion: () => void;
  setIsBatchMode: (mode: boolean) => void;
  setEcommercePack: (pack: EcommercePack) => void;
  setIsSocialMediaPack: (isSocial: boolean) => void;
  setIsCompletePack: (isComplete: boolean) => void;
  setPromptedModelDescription: (description: string) => void;
  generateAIModel: (prompt: string) => Promise<void>;
  saveLook: (name: string) => void;
  applyLook: (id: string) => void;
  deleteLook: (id: string) => void;
  removeModelFromApparel: (itemId: string) => Promise<void>;
}

export type ApparelSlice = ApparelState & ApparelActions;

const baseControls = {
    aperture: APERTURES_LIBRARY[0],
    focalLength: FOCAL_LENGTHS_LIBRARY[1],
    lightingDirection: LIGHTING_DIRECTIONS_LIBRARY[0],
    lightQuality: LIGHT_QUALITIES_LIBRARY[0],
    catchlightStyle: CATCHLIGHT_STYLES_LIBRARY[0],
    colorGrade: COLOR_GRADING_PRESETS[0],
    negativePrompt: 'deformed, disfigured, poor quality, bad anatomy, extra limbs, blurry, text, watermark, logo',
    isHyperRealismEnabled: true,
    cinematicLook: false,
    styleStrength: 75,
    customPrompt: '',
};

// Load myModels from localStorage on initialization
const loadMyModelsFromStorage = (): AIModel[] => {
  try {
    const saved = localStorage.getItem('aiStudioMyModels');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error("Failed to load myModels from localStorage", error);
  }
  return [];
};

const initialApparelState: Omit<ApparelState, 'preConceptState'> = {
  uploadedModelImage: null,
  selectedModels: [],
  myModels: loadMyModelsFromStorage(),
  isSavingModel: false,
  apparel: [],
  modelLightingDescription: null,
  isAnalyzingLighting: false,
  isSuggestingLayering: false,
  apparelControls: {
      ...baseControls,
      shotType: SHOT_TYPES_LIBRARY[0],
      expression: EXPRESSIONS[0],
      fabric: FABRIC_TYPES_LIBRARY[0],
      cameraAngle: CAMERA_ANGLES_LIBRARY[0],
      hairStyle: '',
      makeupStyle: '',
      garmentStyling: '',
  },
  artDirectorSuggestions: null,
  isFetchingSuggestion: false,
  appliedSuggestionId: null,
  isBatchMode: false,
  ecommercePack: 'none',
  isSocialMediaPack: false,
  isCompletePack: false,
  promptedModelDescription: '',
  isGeneratingModel: false,
  looks: [],
};

export const createApparelSlice: StudioStoreSlice<ApparelSlice> = (set, get) => ({
  ...initialApparelState,
  preConceptState: null,

  setUploadedModelImage: (base64) => {
      const isProductMode = get().studioMode === 'product';
      set({ uploadedModelImage: base64 });
      if (base64) {
          set({
              selectedModels: [],
              promptedModelDescription: '',
              isBatchMode: false,
              ...(isProductMode ? {} : { productImage: null, productImageCutout: null, stagedAssets: [] }),
              mockupImage: null,
              designImage: null,
          });
      }
      set({ modelLightingDescription: null });
      if (get().scene.lighting.isDynamic) {
          set(state => ({ scene: { ...state.scene, lighting: LIGHTING_PRESETS[1] } }));
      }
  },
  
  setSelectedModels: (models) => set({ 
      selectedModels: models, 
      ...(get().studioMode === 'product' ? {} : { productImage: null, productImageCutout: null, stagedAssets: [] }),
      mockupImage: null, 
      designImage: null 
  }),
  
  setIsBatchMode: (mode) => {
      const isProductMode = get().studioMode === 'product';
      set({ isBatchMode: mode });
      if (mode) {
          set({ 
              uploadedModelImage: null, 
              promptedModelDescription: '', 
              ...(isProductMode ? {} : { productImage: null, productImageCutout: null, stagedAssets: [] }),
              mockupImage: null, 
              designImage: null 
          });
      }
      if (!mode && get().selectedModels.length > 1) {
          set(state => ({ selectedModels: [state.selectedModels[0]] }));
      }
  },

  handleModelSelection: (model) => {
      const isProductMode = get().studioMode === 'product';
      set({ 
          uploadedModelImage: null, 
          promptedModelDescription: '', 
          ...(isProductMode ? {} : { productImage: null, productImageCutout: null, stagedAssets: [] }),
          mockupImage: null, 
          designImage: null 
      });
      if (get().isBatchMode) {
          set(state => ({
              selectedModels: state.selectedModels.some(m => m.id === model.id)
                  ? state.selectedModels.filter(m => m.id !== model.id)
                  : [...state.selectedModels, model]
          }));
      } else {
          set({ selectedModels: [model] });
      }
  },
  
  saveModel: async (imageB64) => {
    set({ isSavingModel: true, error: null });
    try {
        const modelDetails = await withRetry(() => geminiService.describeModel(imageB64));
        const newModel: AIModel = {
            id: `user-model-${Date.now()}`,
            name: modelDetails.name,
            gender: modelDetails.gender,
            description: modelDetails.description,
            thumbnail: imageB64,
            source: 'user-saved',
            region: 'Custom',
            country: 'Custom',
        };
        const updatedModels = [...get().myModels, newModel];
        set({ myModels: updatedModels });
        // Persist to localStorage
        try {
            localStorage.setItem('aiStudioMyModels', JSON.stringify(updatedModels));
        } catch (error) {
            console.error("Failed to save myModels to localStorage", error);
        }
    } catch (e: any) {
        console.error("Failed to save model:", e);
        set({ error: "Could not analyze and save the model from this image." });
    } finally {
        set({ isSavingModel: false });
    }
  },

  setPromptedModelDescription: (description) => {
      const isProductMode = get().studioMode === 'product';
      set({ promptedModelDescription: description });
      if (description.trim()) {
          set({ 
              uploadedModelImage: null, 
              selectedModels: [], 
              isBatchMode: false, 
              ...(isProductMode ? {} : { productImage: null, productImageCutout: null, stagedAssets: [] }),
              mockupImage: null, 
              designImage: null 
          });
      }
  },

  generateAIModel: async (prompt) => {
    if (!prompt.trim()) return;
    set({ isGeneratingModel: true, error: null });
    try {
      // Construct a more specific prompt for a high-quality, usable model headshot.
      const finalPrompt = `Professional studio headshot portrait of a model. ${prompt}. Ultra-photorealistic, clean studio lighting, sharp focus on the face, plain white background.`;
      
      // Models are usually portrait aspect ratio
      const imageB64 = await withRetry(() => geminiService.generateWithImagen(finalPrompt, '3:4'));
      if (imageB64) {
        // Now that we have the image, call saveModel to analyze it and add it to "My Agency"
        await get().saveModel(imageB64);
      }
    } catch (e: any) {
      console.error("Failed to generate AI model:", e);
      set({ error: "AI Model generation failed. Please try a more descriptive prompt." });
    } finally {
      set({ isGeneratingModel: false });
    }
  },

  addApparelItem: async (base64) => {
      set({ error: null, artDirectorSuggestions: null, appliedSuggestionId: null });
      const newItem: ApparelItem = { 
          id: Date.now().toString(), 
          base64, 
          description: '',
          category: 'Uncategorized',
          isProcessing: true,
      };
      set(state => ({ apparel: [...state.apparel, newItem] }));

      // Run AI tasks in parallel
      const artDirectorPromise = withRetry(() => geminiService.getArtDirectorSuggestions(base64));
      const analysisPromise = withRetry(() => geminiService.analyzeApparel(base64));

      try {
          const { description, category } = await analysisPromise;
           set(state => ({
              apparel: state.apparel.map(item => item.id === newItem.id ? { ...item, description, category, isProcessing: false } : item)
          }));
      } catch (e) {
           console.error("Failed to analyze apparel:", e);
            set(state => ({
              apparel: state.apparel.map(item => item.id === newItem.id ? { ...item, isProcessing: false } : item)
          }));
      }

      set({ isFetchingSuggestion: true });
      try {
          const suggestions = await artDirectorPromise;
          set({ artDirectorSuggestions: suggestions });
      } catch (e) {
          console.error("Failed to fetch art director suggestions:", e);
      } finally {
          set({ isFetchingSuggestion: false });
      }
  },

  removeApparelItem: (id) => {
      set(state => {
          const newApparel = state.apparel.filter(item => item.id !== id);
          return {
              apparel: newApparel,
              artDirectorSuggestions: newApparel.length === 0 ? null : state.artDirectorSuggestions
          };
      });
  },

  reorderApparel: (dragIndex, hoverIndex) => {
    set(state => {
      const newApparel = [...state.apparel];
      const draggedItem = newApparel[dragIndex];
      newApparel.splice(dragIndex, 1);
      newApparel.splice(hoverIndex, 0, draggedItem);
      return { apparel: newApparel };
    });
  },

  suggestAndApplyLayering: async () => {
    const { apparel } = get();
    if (apparel.length < 2) return;
    set({ isSuggestingLayering: true, error: null });
    try {
      const itemsToLayer = apparel.map(({ id, description, category }) => ({ id, description, category }));
      const orderedIds = await withRetry(() => geminiService.suggestLayering(itemsToLayer));
      
      const reorderedApparel = orderedIds.map(id => apparel.find(item => item.id === id)).filter(Boolean) as ApparelItem[];
      const remainingApparel = apparel.filter(item => !orderedIds.includes(item.id));
      
      set({ apparel: [...reorderedApparel, ...remainingApparel] });

    } catch (e) {
      console.error("Failed to suggest layering:", e);
      set({ error: "AI layering suggestion failed." });
    } finally {
      set({ isSuggestingLayering: false });
    }
  },

  updateApparelItemDescription: (id, description) => {
      set(state => ({
          apparel: state.apparel.map(item => item.id === id ? { ...item, description } : item)
      }));
  },

  updateApparelItemCategory: (id, category) => {
      set(state => ({
          apparel: state.apparel.map(item => item.id === id ? { ...item, category } : item)
      }));
  },
  
  updateApparelItemView: (id, viewType, base64) => {
    set(state => ({
        apparel: state.apparel.map(item => {
            if (item.id === id) {
                if (viewType === 'back') return { ...item, backViewBase64: base64 };
                if (viewType === 'detail') return { ...item, detailViewBase64: base64 };
            }
            return item;
        })
    }));
  },

  removeModelFromApparel: async (itemId) => {
    const item = get().apparel.find(i => i.id === itemId);
    if (!item) return;

    set(state => ({
        apparel: state.apparel.map(i => i.id === itemId ? { ...i, isEditing: true } : i),
        error: null
    }));

    try {
        const isolatedGarmentB64 = await withRetry(() => geminiService.isolateGarment(item.base64));
        const { description, category } = await withRetry(() => geminiService.analyzeApparel(isolatedGarmentB64));

        set(state => ({
            apparel: state.apparel.map(i => i.id === itemId ? { 
                ...i, 
                base64: isolatedGarmentB64, 
                isEditing: false,
                description,
                category
            } : i)
        }));
    } catch (e: any) {
        console.error("Failed to remove model from apparel:", e);
        set(state => ({
            error: "Failed to process the image. Please try again.",
            apparel: state.apparel.map(i => i.id === itemId ? { ...i, isEditing: false } : i)
        }));
    }
  },

  analyzeAndSetModelLighting: async () => {
      const { uploadedModelImage } = get();
      if (!uploadedModelImage) {
          set({ error: "Please upload a model image first to analyze its lighting." });
          return;
      }

      set({ isAnalyzingLighting: true, error: null });
      try {
          const description = await withRetry(() => geminiService.describeImageStyle(uploadedModelImage));
          set({ modelLightingDescription: description });
          const matchModelLightingPreset = LIGHTING_PRESETS.find(p => p.isDynamic);
          if (matchModelLightingPreset) {
              get().updateScene({ lighting: matchModelLightingPreset });
          } else {
              throw new Error("Could not find the 'Match Model Lighting' preset.");
          }
      } catch (e) {
          console.error("Failed to analyze model lighting:", e);
          set({ error: "Could not analyze the model's lighting. Please try a different image." });
          if (get().scene.lighting.isDynamic) {
              set(state => ({ scene: { ...state.scene, lighting: LIGHTING_PRESETS[1] } }));
          }
      } finally {
          set({ isAnalyzingLighting: false });
      }
  },

  updateApparelControl: (key, value) => {
      set(state => ({ apparelControls: { ...state.apparelControls, [key]: value } }));
  },
  
  setEcommercePack: (pack) => {
      set({ ecommercePack: pack });
      if (pack !== 'none') {
          set({ isSocialMediaPack: false, isCompletePack: false });
      }
  },

  setIsSocialMediaPack: (isSocial) => {
      set({ isSocialMediaPack: isSocial });
      if (isSocial) {
          set({ ecommercePack: 'none', isCompletePack: false });
      }
  },

  setIsCompletePack: (isComplete) => {
      set({ isCompletePack: isComplete });
      if (isComplete) {
          set({ ecommercePack: 'none', isSocialMediaPack: false });
      }
  },

  applyArtDirectorSuggestion: (suggestion) => {
    if (get().appliedSuggestionId === null) {
        set(state => ({
            preConceptState: {
                apparelControls: state.apparelControls,
                scene: state.scene,
            }
        }));
    }
    
    if (!suggestion) return;
    
    const suggestedShotType = SHOT_TYPES_LIBRARY.find(p => p.id === suggestion.shotTypeId);
    const suggestedLighting = LIGHTING_PRESETS.find(l => l.id === suggestion.lightingId);
    const suggestedExpression = EXPRESSIONS.find(e => e.id === suggestion.expressionId);
    const suggestedAperture = APERTURES_LIBRARY.find(a => a.id === suggestion.apertureId);
    const suggestedFocalLength = FOCAL_LENGTHS_LIBRARY.find(f => f.id === suggestion.focalLengthId);
    const suggestedCameraAngle = CAMERA_ANGLES_LIBRARY.find(c => c.id === suggestion.cameraAngleId);
    const suggestedColorGrade = COLOR_GRADING_PRESETS.find(c => c.id === suggestion.colorGradeId);
    
    if (suggestedLighting) get().updateScene({ lighting: suggestedLighting });
    
    const backgroundFromLib = BACKGROUNDS_LIBRARY.find(b => b.id === suggestion.backgroundId);
    if (backgroundFromLib) get().updateScene({ background: backgroundFromLib });
    
    if (suggestedShotType) get().updateApparelControl('shotType', suggestedShotType);
    if (suggestedExpression) get().updateApparelControl('expression', suggestedExpression);
    if (suggestedAperture) get().updateApparelControl('aperture', suggestedAperture);
    if (suggestedFocalLength) get().updateApparelControl('focalLength', suggestedFocalLength);
    if (suggestedCameraAngle) get().updateApparelControl('cameraAngle', suggestedCameraAngle);
    if (suggestedColorGrade) get().updateApparelControl('colorGrade', suggestedColorGrade);

    set({ appliedSuggestionId: suggestion.id });
  },

  removeArtDirectorSuggestion: () => {
    const { preConceptState } = get();
    if (preConceptState) {
        set({
            apparelControls: preConceptState.apparelControls,
            scene: preConceptState.scene,
        });
    }
    set({
        appliedSuggestionId: null,
        preConceptState: null,
    });
  },

  saveLook: (name) => {
      if (!name.trim()) return;
      const { apparelControls, scene } = get();
      const newLook: Look = {
        id: `look_${Date.now()}`,
        name: name.trim(),
        controls: { ...apparelControls },
        scene: { ...scene },
      };
      set(state => ({ looks: [...state.looks, newLook] }));
  },

  applyLook: (id) => {
      const look = get().looks.find(l => l.id === id);
      if (look) {
          set({
              apparelControls: look.controls,
              scene: look.scene,
          });
      }
  },

  deleteLook: (id) => {
      set(state => ({ looks: state.looks.filter(l => l.id !== id) }));
  },
});
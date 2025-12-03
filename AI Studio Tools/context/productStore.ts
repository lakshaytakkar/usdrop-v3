import type { ProductCreativeControls, ProductEcommercePack, ProductSceneTemplate, StagedAsset, SceneSuggestion } from '../types';
import { APERTURES_LIBRARY, CAMERA_ANGLES_LIBRARY_PRODUCT, COLOR_GRADING_PRESETS, FOCAL_LENGTHS_LIBRARY, LIGHTING_DIRECTIONS_LIBRARY, LIGHT_QUALITIES_LIBRARY, CATCHLIGHT_STYLES_LIBRARY, SURFACE_LIBRARY, PRODUCT_MATERIAL_LIBRARY, THEMED_SCENE_TEMPLATES, SHOT_TYPES_LIBRARY, EXPRESSIONS, PRODUCT_INTERACTION_LIBRARY } from '../constants';
import { geminiService } from '../services/geminiService';
import type { StudioStoreSlice, StudioStore } from './StudioContext';
import { getDominantColor } from '../utils/colorExtractor';
import { getComplementaryColor, withRetry } from '../utils/colorUtils';

export interface ProductState {
  productImage: string | null;
  productImageCutout: string | null;
  isRemovingBackground: boolean;
  isCutout: boolean;
  productName: string;
  isNamingProduct: boolean;
  productControls: ProductCreativeControls;
  isSuggestingScenes: boolean;
  sceneSuggestions: SceneSuggestion[];
  stagedAssets: StagedAsset[];
  suggestedBackgroundColor: string | null;
  sceneTemplates: ProductSceneTemplate[];
  productEcommercePack: ProductEcommercePack;
}

export interface ProductActions {
  setProductImage: (base64: string | null) => void;
  setProductName: (name: string) => void;
  performBackgroundRemoval: () => Promise<void>;
  setUseCutout: (useCutout: boolean) => void;
  updateProductControl: <K extends keyof ProductCreativeControls>(key: K, value: ProductCreativeControls[K]) => void;
  fetchSceneSuggestions: () => Promise<void>;
  addCompanionAsset: (base64: string) => void;
  removeCompanionAsset: (id: string) => void;
  updateStagedAsset: (id: string, partialAsset: Partial<StagedAsset>) => void;
  saveSceneTemplate: (name: string) => void;
  applySceneTemplate: (id: string) => void;
  deleteSceneTemplate: (id: string) => void;
  setProductEcommercePack: (pack: ProductEcommercePack) => void;
}

export type ProductSlice = ProductState & ProductActions;

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

const initialProductState: ProductState = {
  productImage: null,
  productImageCutout: null,
  isRemovingBackground: false,
  isCutout: true,
  productName: '',
  isNamingProduct: false,
  productControls: {
    ...baseControls,
    cameraAngle: CAMERA_ANGLES_LIBRARY_PRODUCT[0],
    productShadow: 'Soft',
    customProps: '',
    surface: SURFACE_LIBRARY[0],
    productMaterial: PRODUCT_MATERIAL_LIBRARY[0],
    // On-model controls
    shotType: SHOT_TYPES_LIBRARY[0],
    expression: EXPRESSIONS[0],
    modelInteractionType: PRODUCT_INTERACTION_LIBRARY[0],
    customModelInteraction: '',
  },
  isSuggestingScenes: false,
  sceneSuggestions: [],
  stagedAssets: [],
  suggestedBackgroundColor: null,
  sceneTemplates: [],
  productEcommercePack: 'none',
};

export const createProductSlice: StudioStoreSlice<ProductSlice> = (set: (partial: Partial<StudioStore> | ((state: StudioStore) => Partial<StudioStore>)) => void, get: () => StudioStore) => ({
  ...initialProductState,

  setProductImage: async (base64: string | null) => {
    set({ 
        productImage: base64, 
        productImageCutout: null, 
        error: null,
        sceneSuggestions: [],
        stagedAssets: [],
        suggestedBackgroundColor: null,
        productName: '', // Reset name on new image
        isNamingProduct: !!base64, // Start naming process if image is uploaded
    });
    if (base64) {
        const isProductMode = get().studioMode === 'product';
        set({
            ...(isProductMode ? {} : { 
                uploadedModelImage: null,
                selectedModels: [],
                promptedModelDescription: '',
            }),
            apparel: [],
            artDirectorSuggestions: null,
            mockupImage: null,
            designImage: null,
        });
        
        get().performBackgroundRemoval();
        
        try {
            const name = await withRetry(() => geminiService.nameProduct(base64));
            set({ productName: name });
        } catch (e) {
            console.error("Could not name product:", e);
        } finally {
            set({ isNamingProduct: false });
        }
        
        try {
            const dominantColor = await getDominantColor(base64);
            const complementary = getComplementaryColor(dominantColor);
            set({ suggestedBackgroundColor: complementary });
        } catch(e) {
            console.error("Could not suggest background color:", e);
        }

    }
  },
  
  setProductName: (name: string) => set({ productName: name }),

  performBackgroundRemoval: async () => {
      const { productImage } = get();
      if (!productImage) return;

      set({ isRemovingBackground: true, isCutout: false, stagedAssets: [] });
      try {
          const cutoutB64 = await withRetry(() => geminiService.removeBackground(productImage));
          const initialAsset: StagedAsset = { id: 'product', base64: cutoutB64, x: 50, y: 50, z: 1, scale: 50 };
          set({ productImageCutout: cutoutB64, isCutout: true, stagedAssets: [initialAsset] });
      } catch (e) {
          console.error("Failed to remove background:", e);
          const initialAsset: StagedAsset = { id: 'product', base64: productImage, x: 50, y: 50, z: 1, scale: 50 };
          set({ isCutout: false, stagedAssets: [initialAsset] }); // Fallback to using original
      } finally {
          set({ isRemovingBackground: false });
      }
  },

  setUseCutout: (useCutout: boolean) => {
      const { productImage, productImageCutout, stagedAssets } = get();
      const imageToUse = useCutout ? productImageCutout : productImage;
      if (!imageToUse) return;

      const productAsset = stagedAssets.find(a => a.id === 'product');
      if (productAsset) {
          get().updateStagedAsset('product', { base64: imageToUse });
      }
      set({ isCutout: useCutout });
  },

  updateProductControl: <K extends keyof ProductCreativeControls>(key: K, value: ProductCreativeControls[K]) => {
      set(state => ({ productControls: { ...state.productControls, [key]: value } }));
  },

  fetchSceneSuggestions: async () => {
      const { isCutout, productImage, productImageCutout, productName } = get();
      const imageToAnalyze = isCutout ? productImageCutout : productImage;

      if (!imageToAnalyze) {
          set({ error: "Upload a product image to get suggestions." });
          return;
      }

      set({ isSuggestingScenes: true, error: null, sceneSuggestions: [] });
      try {
          const suggestions = await withRetry(() => geminiService.getSceneSuggestions(imageToAnalyze, productName || "the product"));
          // Set suggestions first without previews to show placeholders
          set({ sceneSuggestions: suggestions.map(s => ({ ...s, previewImageB64: null })) });

          // Asynchronously generate and update previews
          suggestions.forEach(async (suggestion, index) => {
              try {
                  const preview = await withRetry(() => geminiService.generateWithImagen(suggestion.previewPrompt, '1:1'));
                  set(state => {
                      const newSuggestions = [...state.sceneSuggestions];
                      if (newSuggestions[index]) {
                          newSuggestions[index].previewImageB64 = preview;
                      }
                      return { sceneSuggestions: newSuggestions };
                  });
              } catch (e) {
                  console.error(`Failed to generate preview for suggestion ${index}:`, e);
                  // Optionally handle failed previews, e.g., show an error icon
              }
          });

      } catch (e) {
          console.error("Failed to fetch scene suggestions:", e);
          set({ error: "Could not get AI scene suggestions." });
      } finally {
          // The loading state can be turned off after the main suggestions are fetched.
          // The UI will handle the loading state for individual preview images.
          set({ isSuggestingScenes: false });
      }
  },
  
  addCompanionAsset: (base64: string) => {
    const newId = `companion_${Date.now()}`;
    const newAsset: StagedAsset = { id: newId, base64, x: 25, y: 25, z: 0, scale: 30 };
    set(state => ({ stagedAssets: [...state.stagedAssets, newAsset] }));
  },
  
  removeCompanionAsset: (id: string) => set(state => ({ stagedAssets: state.stagedAssets.filter(asset => asset.id !== id) })),
  
  updateStagedAsset: (id: string, partialAsset: Partial<StagedAsset>) => {
    set(state => ({
        stagedAssets: state.stagedAssets.map(asset => 
            asset.id === id ? { ...asset, ...partialAsset } : asset
        )
    }));
  },

  saveSceneTemplate: (name: string) => {
    if (!name.trim()) return;
    const { scene, productControls, stagedAssets } = get();
    const newTemplate: ProductSceneTemplate = {
      id: `template_${Date.now()}`,
      name: name.trim(),
      description: 'A custom saved scene template',
      scene: { ...scene },
      controls: { ...productControls },
      stagedAssets: [...stagedAssets],
    };
    set(state => ({
      sceneTemplates: [...state.sceneTemplates, newTemplate]
    }));
  },

  applySceneTemplate: (id: string) => {
    const template = get().sceneTemplates.find(t => t.id === id) || THEMED_SCENE_TEMPLATES.find(t => t.id === id);
    if (template) {
      get().updateScene(template.scene);
      set(state => ({
        productControls: { ...state.productControls, ...template.controls },
        stagedAssets: template.stagedAssets || state.stagedAssets,
      }));
    }
  },

  deleteSceneTemplate: (id: string) => {
    set(state => ({
      sceneTemplates: state.sceneTemplates.filter(t => t.id !== id)
    }));
  },

  setProductEcommercePack: (pack: ProductEcommercePack) => set({ productEcommercePack: pack }),
});
import type { DesignInput, DesignPlacementControls } from '../types';
import { getDominantColor } from '../utils/colorExtractor';
import type { StudioStoreSlice } from './StudioContext';
import { geminiService } from '../services/geminiService';
import { withRetry } from '../utils/colorUtils';

export interface DesignState {
  mockupImage: DesignInput | null;
  designImage: DesignInput | null;
  backDesignImage: DesignInput | null;
  designPlacementControls: DesignPlacementControls;
  isGeneratingDesign: boolean;
}

export interface DesignActions {
  setMockupImage: (image: DesignInput | null) => Promise<void>;
  setDesignImage: (image: DesignInput | null) => void;
  setBackDesignImage: (image: DesignInput | null) => void;
  updateDesignPlacementControl: <K extends keyof DesignPlacementControls>(key: K, value: DesignPlacementControls[K]) => void;
  updateDesignSideControl: (side: 'front' | 'back', key: keyof DesignPlacementControls['front'], value: any) => void;
  generateAIDesign: (prompt: string) => Promise<void>;
}

export type DesignSlice = DesignState & DesignActions;

const initialDesignSideControls = {
    placement: 'frontCenter' as const,
    scale: 80,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
};

const initialDesignState: DesignState = {
  mockupImage: null,
  designImage: null,
  backDesignImage: null,
  designPlacementControls: {
    front: initialDesignSideControls,
    back: { ...initialDesignSideControls, placement: 'backCenter' as const, scale: 85 },
    fabricBlend: 50,
    wrinkleConform: true,
    mockupStyle: 'hanging',
    fabricStyle: 'standard',
    shirtColor: '#d4d4d8', // zinc-300 default
    apparelType: 'Standard cotton t-shirt',
    printStyle: 'screen',
    lightingStyle: 'studio',
    cameraAngle: 'front',
    isMockupPackActive: false,
  },
  isGeneratingDesign: false,
};

export const createDesignSlice: StudioStoreSlice<DesignSlice> = (set, get) => ({
  ...initialDesignState,
  
  setMockupImage: async (image) => {
      set({ mockupImage: image });
      if (image) {
          try {
              const dominantColor = await getDominantColor(image.base64);
              get().updateDesignPlacementControl('shirtColor', dominantColor);
          } catch (error) {
              console.error("Could not extract dominant color:", error);
              // Keep the default color on error
          }
      }
  },

  setDesignImage: (image) => set({ designImage: image }),
  
  setBackDesignImage: (image) => set({ backDesignImage: image }),
  
  updateDesignPlacementControl: (key, value) => {
      set(state => ({ 
          designPlacementControls: { ...state.designPlacementControls, [key]: value } 
      }));
  },
  
  updateDesignSideControl: (side, key, value) => {
      set(state => ({
          designPlacementControls: {
              ...state.designPlacementControls,
              [side]: {
                  ...state.designPlacementControls[side],
                  [key]: value
              }
          }
      }));
  },

  generateAIDesign: async (prompt) => {
    if (!prompt.trim()) return;
    set({ isGeneratingDesign: true, error: null });
    try {
      // Design graphics are usually square.
      const imageB64 = await withRetry(() => geminiService.generateWithImagen(prompt, '1:1'));
      if (imageB64) {
        get().setDesignImage({
          id: `ai-design-${Date.now()}`,
          name: prompt.substring(0, 30),
          base64: imageB64,
        });
      }
    } catch (e: any) {
      console.error("Failed to generate AI design:", e);
      set({ error: "AI Design generation failed. Please try a different prompt." });
    } finally {
      set({ isGeneratingDesign: false });
    }
  },
});
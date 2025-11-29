import type { ReimagineCreativeControls, ReimagineState } from '../types';
import type { StudioStoreSlice } from './StudioContext';

export interface ReimagineActions {
  setReimagineSourcePhoto: (base64: string | null) => void;
  setNewModelPhoto: (base64: string | null) => void;
  setNewProductPhoto: (base64: string | null) => void;
  updateReimagineControl: <K extends keyof ReimagineCreativeControls>(key: K, value: ReimagineCreativeControls[K]) => void;
}

export type ReimagineSlice = ReimagineState & ReimagineActions;

const initialReimagineState: ReimagineState = {
  reimagineSourcePhoto: null,
  newModelPhoto: null,
  newProductPhoto: null,
  reimagineControls: {
    newModelDescription: '',
    newBackgroundDescription: '',
    newProductDescription: '',
    newPoseDescription: '',
    negativePrompt: 'deformed, disfigured, poor quality, bad anatomy, extra limbs, blurry, text, watermark, logo',
    customPrompt: '',
  },
};

export const createReimagineSlice: StudioStoreSlice<ReimagineSlice> = (set, get) => ({
  ...initialReimagineState,

  setReimagineSourcePhoto: (base64) => {
    if (base64) {
      set({ reimagineSourcePhoto: base64, generatedImages: null, activeImageIndex: null, error: null });
      // Clear other mode inputs when a source photo is uploaded, but preserve reimagine-specific inputs.
      set({
        uploadedModelImage: null,
        selectedModels: [],
        apparel: [],
        productImage: null,
        mockupImage: null,
        designImage: null,
      });

      // If a new model photo already exists, set the automatic prompt.
      const { newModelPhoto } = get();
      if (newModelPhoto) {
        get().updateReimagineControl('newModelDescription', 'Change the model in the reference image to the new model photo, keep everything else the same');
      }

    } else {
      // If the source photo is removed, clear everything related to this reimagine session.
      set({ reimagineSourcePhoto: null, generatedImages: null, activeImageIndex: null, error: null, newModelPhoto: null, newProductPhoto: null });
    }
  },

  setNewModelPhoto: (base64) => {
    set({ newModelPhoto: base64 });
    const { reimagineSourcePhoto } = get();
    if (base64 && reimagineSourcePhoto) {
      // Both images are present, so set the automatic prompt.
      get().updateReimagineControl('newModelDescription', 'Change the model in the reference image to the new model photo, keep everything else the same');
    } else if (base64) {
      // Using a photo for the model is a strong intent, we clear the text description
      // to avoid potential conflicts if the user was typing something.
      get().updateReimagineControl('newModelDescription', '');
    }
  },

  setNewProductPhoto: (base64) => {
    set({ newProductPhoto: base64 });
    if (base64) {
      get().updateReimagineControl('newProductDescription', '');
    }
  },

  updateReimagineControl: (key, value) => {
    set(state => ({
      reimagineControls: { ...state.reimagineControls, [key]: value }
    }));
  },
});
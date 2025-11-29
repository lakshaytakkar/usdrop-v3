export interface ReimagineCreativeControls {
    newModelDescription: string;
    newBackgroundDescription: string;
    newProductDescription: string;
    negativePrompt: string;
    customPrompt: string;
}

// Add to state, not controls
export interface ReimagineState {
  reimagineSourcePhoto: string | null;
  newModelPhoto: string | null;
  newProductPhoto: string | null;
  reimagineControls: ReimagineCreativeControls;
}
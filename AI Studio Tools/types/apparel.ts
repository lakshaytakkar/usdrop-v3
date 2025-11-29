import type { BaseCreativeControls, Scene, ShotType, Expression } from './shared';

export interface AIModel {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  region: string;
  country: string;
  gender: 'Male' | 'Female';
  source?: 'library' | 'user-saved';
}

export type ApparelCategory = 'Top' | 'Bottom' | 'Full Body' | 'Outerwear' | 'Accessory' | 'Footwear' | 'Uncategorized';

export interface ApparelItem {
  id:string;
  base64: string; // Represents the Front View
  backViewBase64?: string | null;
  detailViewBase64?: string | null;
  description: string;
  category: ApparelCategory;
  isProcessing: boolean;
  isEditing?: boolean;
}

export interface Fabric {
  id: string;
  name: string;
  description: string;
}

// Controls specific to Apparel mode
export interface ApparelCreativeControls extends BaseCreativeControls {
  shotType: ShotType;
  expression: Expression;
  fabric: Fabric;
  hairStyle: string;
  makeupStyle: string;
  garmentStyling: string;
}

export interface ArtDirectorSuggestion {
  id: string;
  conceptName: string;
  shotTypeId: string;
  lightingId: string;
  backgroundId: string;
  expressionId: string;
  apertureId: string;
  focalLengthId: string;
  cameraAngleId: string;
  colorGradeId: string;
  reasoning: string;
  prompt: string;
}

export interface PackShot {
  shotId: string;
  expressionId: string;
  cameraAngleId?: string;
  name: string; 
}

export type EcommercePack = 'none' | 'essential' | 'plus' | 'dynamic' | 'editorial' | 'pov';

export interface Look {
  id: string;
  name: string;
  controls: ApparelCreativeControls;
  scene: Scene;
}
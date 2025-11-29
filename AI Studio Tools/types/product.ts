import type { BaseCreativeControls, Scene, ShotType, Expression, ProductInteraction } from './shared';

export interface Surface {
  id: string;
  name: string;
  description: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  category: 'Standard' | 'Artistic';
}

// Controls specific to Product mode
export interface ProductCreativeControls extends BaseCreativeControls {
  productShadow: 'None' | 'Soft' | 'Hard';
  customProps: string;
  surface: Surface;
  productMaterial: Material;
  // On-model controls
  shotType: ShotType;
  expression: Expression;
  // FIX: Changed modelInteraction to modelInteractionType and added customModelInteraction to match implementation.
  modelInteractionType: ProductInteraction;
  customModelInteraction: string;
}

export interface StagedAsset {
  id: string; // 'product' or index of companion asset
  base64: string;
  x: number; // percentage
  y: number; // percentage
  z: number; // z-index
  scale: number; // percentage of canvas size
}

export interface ProductSceneTemplate {
  id: string;
  name:string;
  description: string;
  scene: Partial<Scene>;
  controls: Partial<ProductCreativeControls>;
  stagedAssets?: StagedAsset[];
}

export type ProductEcommercePack = 'none' | 'essential' | 'plus';

export interface ProductPackShot {
  name: string;
  cameraAngleId: string;
  focalLengthId?: string;
}

export interface SceneSuggestion {
  conceptName: string;
  sceneDescription: string;
  previewPrompt: string;
  previewImageB64?: string | null;
}

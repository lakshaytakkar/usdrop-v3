import type React from 'react';
// FIX: Add Part import for ChatMessage interface
import type { Part } from '@google/genai';

// From types/shared.ts

export interface Aperture {
  id: string;
  name: string;
  description: string;
}

export interface FocalLength {
  id: string;
  name: string;
  description: string;
}

export interface CameraAngle {
  id: string;
  name: string;
  description: string;
}

export interface LightingDirection {
  id: string;
  name: string;
  description: string;
}

export interface LightQuality {
  id: string;
  name: string;
  description: string;
}

export interface CatchlightStyle {
  id: string;
  name: string;
  description: string;
}

export interface ColorGrade {
  id: string;
  name: string;
  description: string;
}

// Base controls shared between modes
export interface BaseCreativeControls {
  aperture: Aperture;
  focalLength: FocalLength;
  cameraAngle: CameraAngle;
  lightingDirection: LightingDirection;
  lightQuality: LightQuality;
  catchlightStyle: CatchlightStyle;
  colorGrade: ColorGrade;
  negativePrompt: string;
  isHyperRealismEnabled: boolean;
  cinematicLook: boolean;
  styleStrength: number;
  customPrompt: string;
}

export interface Background {
  id: string;
  name: string;
  type: 'color' | 'gradient' | 'image';
  value: string; // color hex, gradient CSS, image URL, or base64
  category?: string;
}

export interface Lighting {
  id:string;
  name: string;
  description: string;
  isDynamic?: boolean;
}

export interface Scene {
  background: Background;
  lighting: Lighting;
  timeOfDay: 'Sunrise' | 'Midday' | 'Golden Hour' | 'Twilight' | 'Night' | null;
  // FIX: Removed obsolete comment; properties are present.
  sceneProps: string;
  environmentalEffects: string;
}

export type GenerationMode = 'image';

// FIX: Add 'chat' to StudioMode to allow switching to the new Chat Studio.
// FIX: Add 'logo-studio' to StudioMode to support the Whitelabelling.
export type StudioMode = 'apparel' | 'product' | 'design' | 'reimagine' | 'product-scene-generator' | 'photoshoot' | 'chat' | 'logo-studio';

export interface AspectRatio {
    id: string;
    name: string;
    value: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
    icon: React.ReactNode;
}

// from types/apparel.ts

// FIX: Add optional 'source' property to distinguish library models from user-saved models.
export interface AIModel {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  region: string;
  country: string;
  gender: 'Male' | 'Female';
  source?: 'library' | 'user-saved';
  age?: number;
}

export type ApparelCategory = 'Top' | 'Bottom' | 'Full Body' | 'Outerwear' | 'Accessory' | 'Footwear' | 'Uncategorized';

export interface ApparelItem {
  id:string;
  base64: string; // Represents the Front View
  // FIX: Added missing optional properties for other apparel views.
  backViewBase64?: string | null;
  detailViewBase64?: string | null;
  description: string;
  category: ApparelCategory;
  isProcessing: boolean;
  isEditing?: boolean;
}

export interface ShotType {
  id: string;
  name: string;
  description: string;
  category: 'Standard' | 'Creative' | 'Detail';
}

export interface Expression {
  id: string;
  name: string;
  description: string;
}

export interface ProductInteraction {
  id: string;
  name: string;
  description?: string;
}

// FIX: Add missing Animation interface to resolve import errors.
export interface Animation {
  id: string;
  name: string;
  description: string;
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
  // FIX: Removed obsolete comment; properties are present.
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
  // FIX: Added missing prompt property to satisfy its usage in services/geminiService.ts
  prompt: string;
}

export interface PackShot {
  shotId: string;
  expressionId: string;
  cameraAngleId?: string;
  name: string; 
}

// FIX: Add 'pov' to EcommercePack type to support point-of-view packshots.
export type EcommercePack = 'none' | 'essential' | 'plus' | 'dynamic' | 'editorial' | 'pov';

// FIX: Add missing 'Look' interface for saving and applying creative settings.
export interface Look {
  id: string;
  name: string;
  controls: ApparelCreativeControls;
  scene: Scene;
}

// from types/product.ts

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
  modelInteractionType: ProductInteraction;
  customModelInteraction: string;
}

// FIX: Added missing StagedAsset type for product staging.
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
  // FIX: Added missing stagedAssets property.
  stagedAssets?: StagedAsset[];
}

export type ProductEcommercePack = 'none' | 'essential' | 'plus';

export interface ProductPackShot {
  name: string;
  cameraAngleId: string;
  focalLengthId?: string;
}

// FIX: Add missing SceneSuggestion interface to resolve import error.
export interface SceneSuggestion {
  conceptName: string;
  sceneDescription: string;
  previewPrompt: string;
  previewImageB64?: string | null;
}

// from types/design.ts

export interface DesignInput {
  id:string;
  base64: string; 
  name: string;
}

export type DesignPlacement = 'frontCenter' | 'leftChest' | 'rightChest' | 'frontTopCenter' | 'backCenter' | 'fullFront' | 'leftSleeve';
export type MockupStyle = 'hanging' | 'flatLay' | 'folded';
export type FabricStyle = 'standard' | 'heavy' | 'vintage' | 'acidWash';
export type DesignLightingStyle = 'studio' | 'dramatic' | 'topDown';
export type DesignCameraAngle = 'front' | 'angled' | 'hero' | 'detail' | 'back';
export type PrintStyle = 'screen' | 'embroidery' | 'vintage' | 'puff';

export interface DesignSceneTemplate {
  id: string;
  name: string;
  description: string;
  scene: Partial<Scene>;
  photography: {
    lightingStyle: DesignLightingStyle;
    cameraAngle: DesignCameraAngle;
  }
}

interface DesignSideControls {
  placement: DesignPlacement;
  scale: number; // percentage 5-200
  rotation: number; // degrees -180 to 180
  offsetX: number; // percentage -50 to 50
  offsetY: number; // percentage -50 to 50
}

export interface DesignPlacementControls {
  // Placement
  front: DesignSideControls;
  back: DesignSideControls;
  // Realism
  fabricBlend: number; // percentage 0-100
  wrinkleConform: boolean;
  // Material Engine
  mockupStyle: MockupStyle;
  fabricStyle: FabricStyle;
  shirtColor: string; // hex code
  apparelType: string; // e.g., "Oversized heavy cotton t-shirt"
  printStyle: PrintStyle;
  // Photography
  lightingStyle: DesignLightingStyle;
  cameraAngle: DesignCameraAngle;
  // Batch
  isMockupPackActive: boolean;
}

// from types/auth.ts
// FIX: Add 'free' to UserPlan to support the free tier defined in permissionsService.
export type UserPlan = 'free' | 'solo' | 'studio' | 'brand';

export interface User {
  id: string;
  email: string;
  plan: UserPlan;
  generationsUsed: number;
  // FIX: Add missing properties for daily usage tracking to resolve type errors in App.tsx and AuthContext.tsx.
  dailyGenerationsUsed: number;
  lastGenerationDate: string;
}
// FIX: Add missing ReimagineCreativeControls interface.
// from types/reimagine.ts
export interface ReimagineCreativeControls {
    newModelDescription: string;
    newBackgroundDescription: string;
    // FIX: Add missing newProductDescription property to resolve type errors.
    newProductDescription: string;
    newPoseDescription: string;
    negativePrompt: string;
    customPrompt: string;
}
// FIX: Add missing ReimagineState interface to resolve import error.
// from types/reimagine.ts
export interface ReimagineState {
  reimagineSourcePhoto: string | null;
  newModelPhoto: string | null;
  // FIX: Add missing newProductPhoto property to resolve type errors.
  newProductPhoto: string | null;
  reimagineControls: ReimagineCreativeControls;
}

// from types/photoshoot.ts
export interface PhotoshootConcept {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface GeneratedPhotoshootImage {
  id: string;
  conceptId: string;
  url?: string;
  status: 'pending' | 'done' | 'error';
  error?: string;
}
// from types/chat.ts
// FIX: Add missing ChatMessage interface to resolve import errors.
export interface ChatMessage {
  role: "user" | "model";
  parts: Part[];
}

// FIX: Add ChatSession interface for chat management.
export interface ChatSession {
  id: string;
  title: string;
  history: ChatMessage[];
  createdAt: number;
}
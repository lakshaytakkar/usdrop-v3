import type React from 'react';

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

export interface Aperture {
  id: string;
  name: string;
  description: string;
}

export interface Scene {
  background: Background;
  lighting: Lighting;
  timeOfDay: 'Sunrise' | 'Midday' | 'Golden Hour' | 'Twilight' | 'Night' | null;
  sceneProps: string;
  environmentalEffects: string;
}

export type GenerationMode = 'image';

// FIX: Add 'chat' to support the Chat Studio mode.
export type StudioMode = 'apparel' | 'product' | 'design' | 'reimagine' | 'product-scene-generator' | 'photoshoot' | 'chat' | 'logo-studio';

export interface AspectRatio {
    id: string;
    name: string;
    value: '1:1' | '3:4' | '4:3' | '9:16' | '16:9';
    icon: React.ReactNode;
}

export interface FocalLength {
  id: string;
  name: string;
  description: string;
}

export interface ColorGrade {
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
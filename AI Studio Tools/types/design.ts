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
import type { DesignPlacement, MockupStyle, FabricStyle, DesignLightingStyle, DesignCameraAngle, PrintStyle } from '../types';

export const PRINT_STYLE_OPTIONS: { readonly id: PrintStyle; readonly name: string; }[] = [
    { id: 'screen', name: 'Screen Print' },
    { id: 'embroidery', name: 'Embroidery' },
    { id: 'vintage', name: 'Vintage/Cracked' },
    { id: 'puff', name: 'Puff Print' },
];

export const DESIGN_PLACEMENT_OPTIONS: { readonly id: DesignPlacement; readonly name: string; readonly defaultScale: number; }[] = [
    { id: 'frontTopCenter', name: 'Top Center', defaultScale: 30 },
    { id: 'leftChest', name: 'Left Chest', defaultScale: 25 },
    { id: 'rightChest', name: 'Right Chest', defaultScale: 25 },
    { id: 'frontCenter', name: 'Front Center (Middle)', defaultScale: 80 },
    { id: 'fullFront', name: 'Full Front', defaultScale: 110 },
    { id: 'leftSleeve', name: 'Left Sleeve', defaultScale: 20 },
    { id: 'backCenter', name: 'Back Center', defaultScale: 85 },
];

export const MOCKUP_STYLE_OPTIONS: { readonly id: MockupStyle; readonly name: string; }[] = [
    { id: 'hanging', name: 'Hanging' },
    { id: 'flatLay', name: 'Flat Lay' },
    { id: 'folded', name: 'Folded' },
];

export const FABRIC_STYLE_OPTIONS: { readonly id: FabricStyle; readonly name: string; }[] = [
    { id: 'standard', name: 'Standard Jersey' },
    { id: 'heavy', name: 'Heavy Cotton' },
    { id: 'vintage', name: 'Vintage Wash' },
    { id: 'acidWash', name: 'Acid Wash' },
];

export const DESIGN_LIGHTING_STYLE_OPTIONS: { readonly id: DesignLightingStyle; readonly name: string; }[] = [
    { id: 'studio', name: 'Studio Softbox' },
    { id: 'dramatic', name: 'Dramatic Side' },
    { id: 'topDown', name: 'Top-Down' },
];

export const DESIGN_CAMERA_ANGLE_OPTIONS: { readonly id: DesignCameraAngle; readonly name: string; }[] = [
    { id: 'front', name: 'Eye-Level Front' },
    { id: 'back', name: 'Eye-Level Back' },
    { id: 'angled', name: 'Angled View' },
    { id: 'hero', name: 'Hero Shot' },
    { id: 'detail', name: 'Design Close-up' },
];

export const MOCKUP_PACK_SHOTS_3: { name: string; angle: DesignCameraAngle; lighting: DesignLightingStyle; view: 'front' }[] = [
    { name: 'Front View', angle: 'front', lighting: 'studio', view: 'front' },
    { name: 'Angled View', angle: 'angled', lighting: 'studio', view: 'front' },
    { name: 'Detail View', angle: 'detail', lighting: 'dramatic', view: 'front' },
];

export const MOCKUP_PACK_SHOTS_4: { name: string; angle: DesignCameraAngle; lighting: DesignLightingStyle; view: 'front' | 'back' }[] = [
    { name: 'Front View', angle: 'front', lighting: 'studio', view: 'front' },
    { name: 'Back View', angle: 'back', lighting: 'studio', view: 'back' },
    { name: 'Angled View', angle: 'angled', lighting: 'studio', view: 'front' },
    { name: 'Detail View (Front)', angle: 'detail', lighting: 'dramatic', view: 'front' },
];
// FIX: Import 'ProductEcommercePack' and 'ProductPackShot' types to resolve TypeScript errors.
import type { Surface, CameraAngle, Lighting, Material, ProductEcommercePack, ProductPackShot, ProductInteraction } from '../types';

export const PRODUCT_INTERACTION_LIBRARY: ProductInteraction[] = [
    { id: 'pi1', name: 'Holding', description: 'holding the product in their hands, presenting it towards the camera.' },
    { id: 'pi2', name: 'Wearing', description: 'wearing the product as it is intended to be worn (e.g., a watch on the wrist, a necklace around the neck).' },
    { id: 'pi3', name: 'Presenting', description: 'presenting the product on a tray or open palm.' },
    { id: 'pi4', name: 'Interacting', description: 'interacting with the product, such as opening a container or using a device.' },
    { id: 'custom', name: 'Custom...' },
];

export const SURFACE_LIBRARY: Surface[] = [
    { id: 'surf1', name: 'Marble Slab', description: 'placed on a clean, white marble slab with subtle grey veining.' },
    { id: 'surf2', name: 'Polished Wood', description: 'placed on a dark, polished wood surface with rich grain.' },
    { id: 'surf3', name: 'Textured Concrete', description: 'placed on a neutral grey, textured concrete surface for a modern, industrial look.' },
    { id: 'surf4', name: 'Brushed Metal', description: 'placed on a brushed metal surface that catches the light with a soft sheen.' },
    { id: 'surf5', name: 'Black Slate', description: 'placed on a dark, matte black slate surface for a dramatic, high-contrast look.' },
];

export const PRODUCT_MATERIAL_LIBRARY: Material[] = [
    // FIX: Added missing 'category' property to align with the 'Material' type definition.
    { id: 'mat1', name: 'Matte', description: 'a non-reflective, matte material finish.', category: 'Standard' },
    // FIX: Added missing 'category' property to align with the 'Material' type definition.
    { id: 'mat2', name: 'Glossy', description: 'a shiny, glossy plastic or ceramic material.', category: 'Standard' },
    // FIX: Added missing 'category' property to align with the 'Material' type definition.
    { id: 'mat3', name: 'Metallic', description: 'a reflective, brushed or polished metallic material.', category: 'Standard' },
    // FIX: Added missing 'category' property to align with the 'Material' type definition.
    { id: 'mat4', name: 'Glass', description: 'a transparent or semi-transparent glass material.', category: 'Standard' },
    { id: 'mat_art_1', name: 'Shining Marble', description: 'an ultra-detailed sculpture made of shining marble. The surface should be smooth and reflective, emphasizing its luster. The lighting should enhance the sculpture\'s contours and textures.', category: 'Artistic' },
    { id: 'mat_art_2', name: 'Cast Bronze', description: 'a sculpture made of cast bronze with a slight patina. The lighting should catch the metallic sheen and highlight the form.', category: 'Artistic' },
    { id: 'mat_art_3', name: 'Carved Wood', description: 'an intricate sculpture hand-carved from a single piece of dark wood, showing the grain and texture of the material.', category: 'Artistic' },
];


export const CAMERA_ANGLES_LIBRARY_PRODUCT: CameraAngle[] = [
    { id: 'cap1', name: 'Eye-Level', description: 'shot from a neutral, eye-level angle, as if sitting on a table.' },
    { id: 'cap2', name: 'Top-Down (Flat Lay)', description: 'shot from directly above in a flat-lay composition.' },
    { id: 'cap3', name: 'Hero Shot (Low Angle)', description: 'shot from a slightly low angle to give the product a powerful, heroic presence.' },
    { id: 'cap4', name: '45-Degree E-commerce', description: 'shot from a standard 45-degree angle, a classic for e-commerce.' },
];

export const LIGHTING_PRESETS_PRODUCT: Lighting[] = [
  { id: 'lp1', name: 'Clean E-commerce', description: 'bright, even, and nearly shadowless lighting, perfect for clear catalog shots against a simple background.' },
  { id: 'lp2', name: 'Dramatic Product', description: 'a single, hard light source from the side, creating deep shadows and highlighting texture.' },
  { id: 'lp3', name: 'Natural Window Light', description: 'soft, diffused, directional light as if from a large nearby window.' },
  { id: 'lp4', name: 'Studio Ring Light', description: 'direct, even light from the front, creating a distinct circular catchlight on reflective surfaces.' },
  { id: 'lp5', name: 'Luxe & Moody', description: 'low-key lighting with soft, focused spotlights to create a luxurious and mysterious mood.' },
];

export const PRODUCT_SHADOW_OPTIONS: { readonly id: 'None' | 'Soft' | 'Hard'; readonly name: string; description: string }[] = [
    { id: 'Soft', name: 'Soft', description: 'a soft, diffused shadow, as if from an overcast day or large studio light.' },
    { id: 'Hard', name: 'Hard', description: 'a hard, defined shadow, as if from direct sunlight.' },
    { id: 'None', name: 'None', description: 'no shadow should be cast by the product.' },
];

export const PRODUCT_ECOMMERCE_PACKS: Record<ProductEcommercePack, { name: string; description: string; shots: ProductPackShot[] }> = {
    'none': { name: 'None', description: '', shots: [] },
    'essential': { 
        name: 'Essential Pack', 
        description: '4 standard shots for product listings.',
        shots: [
            { name: 'Front View', cameraAngleId: 'cap1' }, // Eye-Level
            { name: '45-Degree View', cameraAngleId: 'cap4' }, // 45-Degree
            { name: 'Top-Down View', cameraAngleId: 'cap2' }, // Top-Down
            { name: 'Hero View', cameraAngleId: 'cap3' }, // Hero Shot (Low Angle)
        ]
    },
    'plus': { 
        name: 'Plus Pack', 
        description: '6 shots including detailed and side views.',
        shots: [
            { name: 'Front View', cameraAngleId: 'cap1', focalLengthId: 'fl2' }, // 50mm
            { name: 'Angled View (Left)', cameraAngleId: 'cap4', focalLengthId: 'fl2' }, // 45-Degree
            { name: 'Angled View (Right)', cameraAngleId: 'cap4', focalLengthId: 'fl2'}, // 45-Degree, prompt will need to specify right
            { name: 'Top-Down View', cameraAngleId: 'cap2', focalLengthId: 'fl2' }, // Top-Down
            { name: 'Hero View', cameraAngleId: 'cap3', focalLengthId: 'fl1' }, // Hero with Wide 35mm
            { name: 'Detail Shot', cameraAngleId: 'cap1', focalLengthId: 'fl5' } // Eye-Level with Telephoto 135mm for detail
        ]
    },
};

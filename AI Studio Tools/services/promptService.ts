import type { AIModel, ApparelItem, Scene, GenerationMode, AspectRatio, ApparelCreativeControls, ProductCreativeControls, DesignPlacementControls, DesignInput, StagedAsset, ReimagineCreativeControls } from '../types';
import { FABRIC_STYLE_OPTIONS, MOCKUP_STYLE_OPTIONS, DESIGN_LIGHTING_STYLE_OPTIONS, DESIGN_CAMERA_ANGLE_OPTIONS, PRINT_STYLE_OPTIONS, DESIGN_PLACEMENT_OPTIONS } from '../constants';

interface BasePromptParams {
    styleDescription?: string;
    aspectRatio: AspectRatio['value'];
}

interface ApparelPromptParams extends BasePromptParams {
    studioMode: 'apparel';
    uploadedModelImage: string | null;
    selectedModels: AIModel[];
    apparel: ApparelItem[];
    scene: Scene;
    generationMode: GenerationMode;
    promptedModelDescription: string;
    modelLightingDescription: string | null;
    apparelControls: ApparelCreativeControls;
    baseLookImageB64?: string | null;
    modelReferenceImage?: string | null;
}

interface ProductPromptParams extends BasePromptParams {
    studioMode: 'product';
    productImage: string | null;
    stagedAssets: StagedAsset[];
    scene: Scene;
    generationMode: GenerationMode;
    productControls: ProductCreativeControls;
    // Added for on-model product shots
    uploadedModelImage: string | null;
    selectedModels: AIModel[];
    promptedModelDescription: string;
    modelReferenceImage?: string | null;
}

interface DesignPromptParams extends BasePromptParams {
    studioMode: 'design';
    mockupImage: DesignInput;
    designImage: DesignInput;
    backDesignImage: DesignInput | null;
    designPlacementControls: DesignPlacementControls;
    scene: Scene;
    shotView: 'front' | 'back';
}

interface ReimaginePromptParams extends BasePromptParams {
    studioMode: 'reimagine';
    reimagineSourcePhoto: string;
    newModelPhoto: string | null;
    newProductPhoto: string | null;
    reimagineControls: ReimagineCreativeControls;
}


type PromptGenerationParams = ApparelPromptParams | ProductPromptParams | DesignPromptParams | ReimaginePromptParams;


const parseDataUrl = (dataUrl: string) => {
    const match = dataUrl.match(/^data:(.*?);base64,(.*)$/);
    if (!match) {
        throw new Error("Invalid data URL");
    }
    return {
        mimeType: match[1],
        data: match[2],
    };
};

const getAspectRatioPrompt = (aspectRatio: AspectRatio['value']): string => {
    switch (aspectRatio) {
        case '1:1':
            return `The final image output MUST have a square orientation with an aspect ratio of exactly 1:1 (e.g., 1024px width by 1024px height).`;
        case '4:3':
            return `The final image output MUST have a landscape orientation with an aspect ratio of exactly 4:3 (e.g., 1024px width by 768px height).`;
        case '16:9':
            return `The final image output MUST have a wide landscape orientation with an aspect ratio of exactly 16:9 (e.g., 1280px width by 720px height).`;
        case '9:16':
            return `The final image output MUST have a tall portrait orientation with an aspect ratio of exactly 9:16 (e.g., 720px width by 1280px height).`;
        case '3:4':
        default:
            return `The final image output MUST have a portrait orientation with an aspect ratio of exactly 3:4 (e.g., 1024px width by 1365px height).`;
    }
};

export const promptService = {
    generatePrompt: (params: PromptGenerationParams): { parts: any[] } => {
        const parts: any[] = [];
        
        // ===================================
        // --- RE-IMAGINE MODE PROMPT LOGIC ---
        // ===================================
        if (params.studioMode === 'reimagine') {
            const { reimagineSourcePhoto, newModelPhoto, newProductPhoto, reimagineControls, aspectRatio, styleDescription } = params;
            const { newModelDescription, newBackgroundDescription, newProductDescription, newPoseDescription, customPrompt } = reimagineControls;

            // --- Custom Prompt Override ---
            if (customPrompt && customPrompt.trim() !== '') {
                let textPrompt = `**PRIMARY GOAL:** You will receive a text prompt and potentially multiple images (reference photo, new model, new product). Your critical mission is to follow the text prompt to create a photorealistic image, using the provided images as assets for context.\n\n`;

                textPrompt += `**USER PROMPT:**\n${customPrompt.trim()}`;

                parts.push({ text: textPrompt });
                
                // Add all relevant images, order is important
                if (reimagineSourcePhoto) {
                    const { mimeType, data } = parseDataUrl(reimagineSourcePhoto);
                    parts.push({ inlineData: { mimeType, data } }); // First image is reference
                }
                if (newModelPhoto) {
                    const { mimeType, data } = parseDataUrl(newModelPhoto);
                    parts.push({ inlineData: { mimeType, data } }); // Second image is new model
                }
                if (newProductPhoto) {
                    const { mimeType, data } = parseDataUrl(newProductPhoto);
                    parts.push({ inlineData: { mimeType, data } }); // Third is new product
                }
                
                return { parts };
            }
            // --- End Custom Prompt Override ---

            if (!newModelPhoto && !newModelDescription.trim() && !newBackgroundDescription.trim() && !newProductPhoto && !newProductDescription.trim() && !newPoseDescription.trim()) {
                throw new Error("Please describe or upload a new model, product, pose, or background.");
            }

            let textPrompt = `**AI PHOTOSHOOT - SWAP DIRECTIVE**

**CRITICAL MISSION:** You are an expert AI photo editor. Your task is to modify a reference image based on a specific set of swap instructions. You may be asked to swap the model, the product/apparel, the background, the pose, or a combination of these.

**ASSET BREAKDOWN (Order is CRITICAL):**
- **IMAGE 1 (Reference Photo):** This is the source for the **POSE** (unless overridden).
${newModelPhoto ? `- **IMAGE 2 (New Model Photo):** This is the source for the new person's **FACE and IDENTITY**.\n` : ''}
${newProductPhoto ? `- **IMAGE ${newModelPhoto ? '3' : '2'} (New Product Photo):** This is the source for the new **PRODUCT or APPAREL**.\n` : ''}
---
**DETAILED INSTRUCTIONS (Execute in this order):**
`;

            // 1. Model Swap Logic
            if (newModelPhoto) {
                textPrompt += `- **1. MODEL SWAP (PHOTO-BASED):** Your highest priority is to replace the person in Image 1 with the person from Image 2. The face, hair, and physical identity must be a perfect match to Image 2.\n`;
                 if (newModelDescription.trim()) {
                     textPrompt += `  - **Styling Note:** After swapping the model, apply this styling: "${newModelDescription.trim()}".\n`;
                }
            } else if (newModelDescription.trim()) {
                textPrompt += `- **1. MODEL SWAP (DESCRIPTION-BASED):** Replace the person in Image 1 with a new person who perfectly matches this description: "${newModelDescription.trim()}".\n`;
            } else {
                textPrompt += `- **1. MODEL PRESERVATION:** The person from Image 1 must be preserved with 100% accuracy. Do not change them.\n`;
            }

            // 2. Pose Logic
            if (newPoseDescription && newPoseDescription.trim()) {
                textPrompt += `- **2. POSE CHANGE:** The person must be posed as follows: "${newPoseDescription.trim()}". This instruction overrides the pose in the reference image.\n`;
            } else {
                textPrompt += `- **2. POSE PRESERVATION:** The person MUST be in the exact same pose as the person in Image 1.\n`;
            }

            // 3. Product/Apparel Swap Logic
            if (newProductPhoto || newProductDescription.trim()) {
                const productImageRef = newModelPhoto ? '(Image 3)' : '(Image 2)';
                const productSource = newProductPhoto ? `the New Product/Apparel Photo ${productImageRef}` : `this description: "${newProductDescription.trim()}"`;
                textPrompt += `- **3. PRODUCT/APPAREL SWAP:** Identify the primary product or apparel item featured in the reference photo. Replace that item with a new one that perfectly matches ${productSource}. The new item must be integrated realistically, matching the original's position and scale, and be worn or held naturally by the person.\n`;
            } else {
                // If no product swap, instruct to keep the original outfit
                textPrompt += `- **3. OUTFIT PRESERVATION:** The person must wear the exact same outfit from Image 1.\n`;
            }

            // 4. Background Swap Logic
            if (newBackgroundDescription.trim()) {
                textPrompt += `- **4. BACKGROUND SWAP:** Replace the background of the reference image with a new, photorealistic scene that perfectly matches this description: "${newBackgroundDescription.trim()}". The person, their pose, and their outfit (or new apparel) must be seamlessly integrated into this new background with realistic lighting and shadows.\n`;
            } else {
                textPrompt += `- **4. BACKGROUND PRESERVATION:** The background from the reference image must be preserved.\n`;
            }

            // 5. Final Quality
            textPrompt += `
---
**FINAL IMAGE STYLE & QUALITY**
- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}
- **QUALITY:** This is a professional photoshoot. The final output must be an ultra-high-quality, hyperrealistic, and tack-sharp photograph.
${styleDescription ? `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}".\n` : ''}`;


            parts.push({ text: textPrompt });
            
            // Add source photo first
            const { mimeType: sourceMime, data: sourceData } = parseDataUrl(reimagineSourcePhoto);
            parts.push({ inlineData: { mimeType: sourceMime, data: sourceData } });
            
            // Add new model photo if it exists
            if (newModelPhoto) {
                 const { mimeType: modelMime, data: modelData } = parseDataUrl(newModelPhoto);
                 parts.push({ inlineData: { mimeType: modelMime, data: modelData } });
            }

            // Add new product photo if it exists
            if (newProductPhoto) {
                 const { mimeType: productMime, data: productData } = parseDataUrl(newProductPhoto);
                 parts.push({ inlineData: { mimeType: productMime, data: productData } });
            }

            return { parts };
        }
        
        // =======================================================
        // --- APPAREL MODE - CONSISTENT PACK GENERATION LOGIC ---
        // =======================================================
        if (params.studioMode === 'apparel' && params.baseLookImageB64) {
            const { baseLookImageB64, scene, apparelControls, aspectRatio, styleDescription } = params;
            const {
                shotType, expression, aperture, focalLength, fabric, cameraAngle,
                lightingDirection, lightQuality, catchlightStyle, isHyperRealismEnabled,
                cinematicLook, styleStrength, colorGrade, hairStyle, makeupStyle, garmentStyling
            } = apparelControls;

            let textPrompt = `**APPAREL RE-POSE DIRECTIVE**

**PRIMARY GOAL:** You are provided with a reference image of a model wearing a complete outfit. Your critical mission is to generate a new photograph of the *same model* wearing the *exact same outfit*, but with a new pose and in a new scene as described below.

**NON-NEGOTIABLE RULES:**
1.  **IDENTITY & OUTFIT PRESERVATION:** Replicate the model's identity (face, body, hair) and the entire outfit (all clothing, colors, textures) from the reference image with 100% accuracy. Do NOT change the clothing.
2.  **SETTINGS ARE LAW:** You MUST follow the new POSE, SCENE, and CAMERA instructions below. These settings override the pose and scene from the reference image.

---
**1. MODEL & OUTFIT (Source: First Image)**
- **MISSION:** Use the provided image as the definitive source for the model's appearance and their complete wardrobe.

---
`;
            // POSE & STYLING
            textPrompt += `**2. POSE & STYLING (Source: User Settings)**
- **POSE (Body Language):** The model must be positioned exactly as described: ${shotType.description}.
- **EXPRESSION:** The model's facial expression must be: ${expression.description}.
`;
            if (hairStyle.trim()) textPrompt += `- **HAIR:** The model's hair is styled as: "${hairStyle.trim()}".\n`;
            if (makeupStyle.trim()) textPrompt += `- **MAKEUP:** The model's makeup is a "${makeupStyle.trim()}" look.\n`;
            if (garmentStyling.trim()) textPrompt += `- **GARMENT STYLING:** The clothing should be styled as follows: ${garmentStyling.trim()}.\n`;
            if (fabric.id !== 'fab1') textPrompt += `- **FABRIC TEXTURE:** The primary garment(s) should have the texture of ${fabric.description}\n`;
            textPrompt += '\n';

            // SCENE & LIGHTING
            const isCustomBackground = scene.background.id === 'custom' && scene.background.type === 'image';
            const backgroundPrompt = isCustomBackground
                ? `in the environment depicted in the FINAL image provided`
                : scene.background.type === 'image' ? `in a photorealistic ${scene.background.name}` : `against a simple studio background with a ${scene.background.name.toLowerCase()} color.`;
            
            let lightingPrompt = `Apply ${scene.lighting.description}.`;
            if (lightingDirection.id !== 'ld1') lightingPrompt += ` The main light source is positioned ${lightingDirection.description}.`;
            if (lightQuality.id !== 'lq1') lightingPrompt += ` The light quality is ${lightQuality.description}.`;
            lightingPrompt += ` The final image should feature ${catchlightStyle.description}.`;
            lightingPrompt += ' The model, apparel, and background must all be lit from the same light source and direction to create a cohesive and realistic photograph.';

            textPrompt += `**3. SCENE & LIGHTING (Source: User Settings)**
- **BACKGROUND:** The scene is set ${backgroundPrompt}.
- **LIGHTING (CRITICAL):** ${lightingPrompt}
`;
            if(scene.sceneProps.trim()) textPrompt += `- **PROPS:** The scene must include: ${scene.sceneProps.trim()}.\n`;
            if(scene.environmentalEffects.trim()) textPrompt += `- **EFFECTS:** The scene should have these atmospheric effects: ${scene.environmentalEffects.trim()}.\n`;
            textPrompt += '\n';

            // CAMERA & LENS
            textPrompt += `**4. CAMERA & LENS (Source: User Settings)**
- **CAMERA ANGLE:** ${cameraAngle.description}.
- **APERTURE:** ${aperture.description}.
- **FOCAL LENGTH:** ${focalLength.description}.
\n`;

            // FINAL IMAGE STYLE & QUALITY
            textPrompt += `**5. FINAL IMAGE STYLE & QUALITY (Source: User Settings)**
- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}
- **QUALITY:** This is a professional photoshoot. The final output must be an ultra-high-quality, hyperrealistic, and tack-sharp photograph.
`;
            if (styleDescription) textPrompt += `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}". Apply this style with an influence of approximately ${styleStrength}%.\n`;
            if (colorGrade.id !== 'cg_none') textPrompt += `- **COLOR GRADE:** Apply a professional color grade with the following style: ${colorGrade.description}\n`;
            if (cinematicLook) textPrompt += `**CINEMATIC LOOK (ENABLED):** The image must have a cinematic quality, emulating a still from a high-budget film with fine, realistic film grain.\n`;
            if (isHyperRealismEnabled) textPrompt += `**HYPER-REALISM MODE (ENABLED):** Pay extreme attention to micro-details like skin pores, fabric weave, and ensure all anatomy is 100% accurate.\n`;
            
            parts.push({ text: textPrompt });
            const { mimeType, data } = parseDataUrl(baseLookImageB64);
            parts.push({ inlineData: { mimeType, data } });

            if (isCustomBackground) {
                 const { mimeType, data } = parseDataUrl(scene.background.value);
                 parts.push({ inlineData: { mimeType, data } });
            }

            return { parts };
        }

        // =======================================================
        // --- PRODUCT MODE - CONSISTENT PACK GENERATION LOGIC ---
        // =======================================================
        if (params.studioMode === 'product' && params.modelReferenceImage) {
            const { modelReferenceImage, scene, productControls, aspectRatio, styleDescription } = params;
            const {
                shotType, expression, aperture, focalLength, cameraAngle,
                lightingDirection, lightQuality, catchlightStyle, isHyperRealismEnabled,
                cinematicLook, styleStrength, colorGrade,
                modelInteractionType, customModelInteraction
            } = productControls;

            let interactionPrompt = modelInteractionType.id === 'custom' ? customModelInteraction.trim() : (modelInteractionType.description || 'interacting with the product');
            if (modelInteractionType.id === 'custom' && !interactionPrompt) {
                interactionPrompt = 'holding the product towards the camera.'; // Fallback
            }

            let textPrompt = `**ON-MODEL PRODUCT RE-POSE DIRECTIVE**

**PRIMARY GOAL:** You are provided with a reference image of a model with a product. Your critical mission is to generate a new photograph of the *same model* with the *exact same product*, but with a new pose and in a new scene as described below.

**NON-NEGOTIABLE RULES:**
1.  **IDENTITY & PRODUCT PRESERVATION:** Replicate the model's identity (face, body, hair) and the product (including how it's held/worn) from the reference image with 100% accuracy. Do NOT change the product.
2.  **SETTINGS ARE LAW:** You MUST follow the new POSE, SCENE, and CAMERA instructions below. These settings override the pose and scene from the reference image.

---
**1. MODEL & PRODUCT (Source: First Image)**
- **MISSION:** Use the provided image as the definitive source for the model's appearance and the product they are holding/wearing.

---
**2. POSE & INTERACTION (Source: User Settings)**
- **POSE (Body Language):** The model must be positioned exactly as described: ${shotType.description}.
- **EXPRESSION:** The model's facial expression must be: ${expression.description}.
- **PRODUCT INTERACTION:** During the new pose, the model's interaction with the product should be consistent with this description: ${interactionPrompt}.
\n`;

            // SCENE & LIGHTING
            const isCustomBackground = scene.background.id === 'custom' && scene.background.type === 'image';
            const backgroundPrompt = isCustomBackground
                ? `in the environment depicted in the FINAL image provided`
                : scene.background.type === 'image' ? `in a photorealistic ${scene.background.name}` : `against a simple studio background with a ${scene.background.name.toLowerCase()} color.`;
            
            let lightingPrompt = `Apply ${scene.lighting.description}.`;
            if (lightingDirection.id !== 'ld1') lightingPrompt += ` The main light source is positioned ${lightingDirection.description}.`;
            if (lightQuality.id !== 'lq1') lightingPrompt += ` The light quality is ${lightQuality.description}.`;
            lightingPrompt += ` The final image should feature ${catchlightStyle.description}.`;
            lightingPrompt += ' The model, product, and background must all be lit from the same light source and direction for a cohesive photograph.';

            textPrompt += `**3. SCENE & LIGHTING (Source: User Settings)**
- **BACKGROUND:** The scene is set ${backgroundPrompt}.
- **LIGHTING (CRITICAL):** ${lightingPrompt}
`;
            if(scene.sceneProps.trim()) textPrompt += `- **PROPS:** The scene must include: ${scene.sceneProps.trim()}.\n`;
            if(scene.environmentalEffects.trim()) textPrompt += `- **EFFECTS:** The scene should have these atmospheric effects: ${scene.environmentalEffects.trim()}.\n`;
            textPrompt += '\n';

            // CAMERA & LENS
            textPrompt += `**4. CAMERA & LENS (Source: User Settings)**
- **CAMERA ANGLE:** ${cameraAngle.description}.
- **APERTURE:** ${aperture.description}.
- **FOCAL LENGTH:** ${focalLength.description}.
\n`;

            // FINAL IMAGE STYLE & QUALITY
            textPrompt += `**5. FINAL IMAGE STYLE & QUALITY (Source: User Settings)**
- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}
- **QUALITY:** This is a professional product photoshoot. The final output must be an ultra-high-quality, hyperrealistic photograph.
`;
            if (styleDescription) textPrompt += `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}".\n`;
            if (colorGrade.id !== 'cg_none') textPrompt += `- **COLOR GRADE:** Apply a professional color grade with the following style: ${colorGrade.description}\n`;
            if (cinematicLook) textPrompt += `**CINEMATIC LOOK (ENABLED):** The image must have a cinematic quality, emulating a still from a high-budget film.\n`;
            if (isHyperRealismEnabled) textPrompt += `**HYPER-REALISM MODE (ENABLED):** Pay extreme attention to micro-details like skin pores, product textures, and ensure all anatomy is 100% accurate.\n`;

            parts.push({ text: textPrompt });
            const { mimeType, data } = parseDataUrl(modelReferenceImage);
            parts.push({ inlineData: { mimeType, data } });

            if (isCustomBackground) {
                 const { mimeType, data } = parseDataUrl(scene.background.value);
                 parts.push({ inlineData: { mimeType, data } });
            }

            return { parts };
        }
        
        // ===================================
        // --- DESIGN MODE PROMPT LOGIC ---
        // ===================================
        if (params.studioMode === 'design') {
            const { mockupImage, designImage, backDesignImage, designPlacementControls, scene, aspectRatio, styleDescription, shotView } = params;
            
            const activeDesignImage = (shotView === 'back' && backDesignImage) ? backDesignImage : designImage;
            const activePlacementControls = shotView === 'back' ? designPlacementControls.back : designPlacementControls.front;

            // Get text descriptions from IDs
            const fabricStyle = FABRIC_STYLE_OPTIONS.find(f => f.id === designPlacementControls.fabricStyle)?.name || 'standard cotton';
            const mockupStyle = MOCKUP_STYLE_OPTIONS.find(m => m.id === designPlacementControls.mockupStyle)?.name || 'hanging';
            const lightingStyle = DESIGN_LIGHTING_STYLE_OPTIONS.find(l => l.id === designPlacementControls.lightingStyle)?.name || 'studio softbox lighting';
            const cameraAngleOption = DESIGN_CAMERA_ANGLE_OPTIONS.find(c => c.id === designPlacementControls.cameraAngle);
            const printStyle = PRINT_STYLE_OPTIONS.find(p => p.id === designPlacementControls.printStyle)?.name || 'screen printed';

            let cameraAnglePrompt = `The photograph is shot from a ${cameraAngleOption?.name || 'eye-level front view'}.`;
            if (designPlacementControls.cameraAngle === 'detail') {
                 cameraAnglePrompt = `**CAMERA ANGLE (CRITICAL DETAIL SHOT):** The photograph is an extreme close-up, tightly framed *only* on the design area. The design should fill most of the frame. Show the intricate details of the "${printStyle}" print style on the fabric texture.`;
            } else if (shotView === 'back') {
                 cameraAnglePrompt += ' This is a view of the BACK of the garment.';
            }

            let mockupAndMaterialPrompt = `**MOCKUP & MATERIAL (Based on the FIRST reference image):**
- **Apparel Style (CRITICAL):** The final image must represent a garment that perfectly matches this detailed description: "${designPlacementControls.apparelType}". This description defines the complete look, including the cut, style, and any color patterns (like color blocking).
- **Base Color:** The garment's primary color should be this hex code: ${designPlacementControls.shirtColor}. However, the text description above is the priority and overrides this color if specific colors or patterns are mentioned.
- **Fabric Type:** The garment must look like it's made of ${fabricStyle}. Pay attention to the texture and weight.
- **Presentation Style:** The garment should be presented in a professional ${mockupStyle} style.`;

            if (shotView === 'back') {
                mockupAndMaterialPrompt += `
- **VIEWPOINT (MANDATORY):** You are generating a photograph of the **BACK** of the garment. The provided MOCKUP image is a reference for the garment's general style, color, and material ONLY. You must creatively render the back view of this garment based on the front view provided.`;
            } else {
                mockupAndMaterialPrompt += `
- The overall shape, fit, and wrinkles should be inspired by the provided MOCKUP image.`;
            }
            
            const { placement, scale, rotation, offsetX, offsetY } = activePlacementControls;
            const placementName = DESIGN_PLACEMENT_OPTIONS.find(p => p.id === placement)?.name || 'center';

            let sizeDescriptor = '';
            if (scale < 20) {
                sizeDescriptor = 'very small, like a tag-sized logo (approx 1-2 inches wide)';
            } else if (scale < 40) {
                sizeDescriptor = 'small, like a standard chest logo (approx. 3-4 inches wide)';
            } else if (scale < 70) {
                sizeDescriptor = 'medium, as a standard graphic for the front of a t-shirt (approx. 8-10 inches wide)';
            } else if (scale < 100) {
                sizeDescriptor = 'large, covering a significant portion of the chest area (approx. 11-12 inches wide)';
            } else {
                sizeDescriptor = 'extra-large, as an oversized or full-front print covering most of the printable area of the garment';
            }

            let designAndPlacementPrompt = `**DESIGN & PLACEMENT (Based on the SECOND reference image):**`;
            if (shotView === 'back') {
                designAndPlacementPrompt += `
- **Design Application (CRITICAL BACK VIEW):** The artwork provided in the DESIGN image is the **BACK PRINT**. You MUST place this design on the **BACK** of the garment you are generating. Do not place this design on the front.`;
            } else {
                designAndPlacementPrompt += `
- **Design Application (FRONT VIEW):** Take the artwork from the DESIGN image and place it on the **FRONT** of the garment.`;
            }
            designAndPlacementPrompt += `
- **Print Style:** The design should look like it was applied using a "${printStyle}" method. It needs to have the correct texture and finish (e.g., flat for screen print, textured for embroidery).
- **Placement (CRITICAL):** The design must be placed on the **${shotView}** of the garment, centered on the **${placementName}** area.
- **Size (CRITICAL):** The final printed size of the design on the garment must be **${sizeDescriptor}**. The provided DESIGN image should be scaled appropriately to achieve this size.
- **Fine-Tuning Adjustments (Apply AFTER placement and sizing):**
    - **Rotation:** After placing and sizing, rotate the design by exactly ${rotation} degrees.
    - **Offset:** After rotating, nudge the design horizontally by ${offsetX}% of the garment's width and vertically by ${offsetY}% of the garment's height. (A negative horizontal offset moves it left, a negative vertical offset moves it up).
- **Realism:** The design must blend realistically with the fabric. It should have a ${designPlacementControls.fabricBlend}% blend with the underlying fabric texture. It must ${designPlacementControls.wrinkleConform ? '' : 'NOT '}conform to the fabric's wrinkles, folds, lighting, and shadows.`;

            const isImageBackground = scene.background.type === 'image';
            const backgroundPrompt = isImageBackground
                ? `The garment is photographed within a realistic ${scene.background.name.toLowerCase()} environment. **CRITICAL PHOTOGRAPHY STYLE:** The background MUST be artistically blurred (bokeh), creating a shallow depth-of-field effect. The mockup itself must be the only sharp object in focus.`
                : `The garment should be set against a clean, simple ${scene.background.name.toLowerCase()} studio background. The background color/gradient should be subtle and complement the t-shirt.`;

            let textPrompt = `**PROFESSIONAL MOCKUP GENERATION**
**PRIMARY GOAL:** You are provided with two reference images: a MOCKUP of a blank garment, and a DESIGN to be placed on it. Your critical mission is to generate a new, ultra-photorealistic product photograph of the garment with the design applied, based on the following detailed instructions.

${mockupAndMaterialPrompt}

${designAndPlacementPrompt}

**PHOTOGRAPHY & SCENE:**
- **Lighting:** The scene must be lit with ${lightingStyle}.
- **Camera Angle:** ${cameraAnglePrompt}
- **Background:** ${backgroundPrompt}

**FINAL IMAGE STYLE & QUALITY:**
- **Aspect Ratio (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}
- **Quality:** The final output must be an ultra-high-quality, hyperrealistic, and tack-sharp photograph, indistinguishable from a real product photo shot for a high-end e-commerce brand.
${styleDescription ? `- **Stylistic Goal:** The final image must match the artistic style described as: "${styleDescription}".\n` : ''}`;

            parts.push({ text: textPrompt });
            const { mimeType: mockupMime, data: mockupData } = parseDataUrl(mockupImage.base64);
            parts.push({ inlineData: { mimeType: mockupMime, data: mockupData } });
            
            const { mimeType: designMime, data: designData } = parseDataUrl(activeDesignImage.base64);
            parts.push({ inlineData: { mimeType: designMime, data: designData } });
            
            return { parts };
        }

        const {
            generationMode,
            styleDescription,
            aspectRatio,
        } = params;

        const creativeControls = params.studioMode === 'apparel' ? params.apparelControls : params.productControls;

        // --- Custom Prompt Override ---
        if (creativeControls.customPrompt && creativeControls.customPrompt.trim() !== '') {
            let customPromptText = `**PRIMARY GOAL:** You will receive a text prompt and potentially multiple images (model, product, apparel, background). Your critical mission is to follow the text prompt to create a photorealistic image, using the provided images as assets.\n\n`;
            
            // Add model description context if available
            if ((params.studioMode === 'apparel' || params.studioMode === 'product') && params.selectedModels && params.selectedModels.length > 0) {
                customPromptText += `**MODEL CONTEXT:** The person in the final image must be generated to perfectly match this description: "${params.selectedModels[0].description}". Use the provided model reference image (if any) to get the facial identity correct.\n\n`;
            }

            customPromptText += `**USER PROMPT:**\n${creativeControls.customPrompt}`;
            
            parts.push({ text: customPromptText });
            
            // Add all relevant images
            // Model Image (from upload OR selected library model)
            if ((params.studioMode === 'apparel' || params.studioMode === 'product') && params.uploadedModelImage) {
                 const { mimeType, data } = parseDataUrl(params.uploadedModelImage);
                 parts.push({ inlineData: { mimeType, data } });
            }
            
            // Product Image
            if (params.studioMode === 'product' && params.productImage) {
                 const { mimeType, data } = parseDataUrl(params.productImage);
                 parts.push({ inlineData: { mimeType, data } });
            }

            // Apparel Images
            if (params.studioMode === 'apparel') {
                 for (const item of params.apparel) {
                    const { mimeType, data } = parseDataUrl(item.base64);
                    parts.push({ inlineData: { mimeType, data } });
                }
            }
            
            // Custom Background Image
            const isCustomBackground = params.scene.background.id === 'custom' && params.scene.background.type === 'image';
            if (isCustomBackground) {
                 const { mimeType, data } = parseDataUrl(params.scene.background.value);
                 parts.push({ inlineData: { mimeType, data } });
            }
            
            return { parts };
        }
        // --- End Custom Prompt Override ---

        // ===================================
        // --- PRODUCT MODE PROMPT LOGIC ---
        // ===================================
        if (params.studioMode === 'product') {
            const {stagedAssets, scene, productControls, uploadedModelImage, selectedModels, promptedModelDescription, productImage, modelReferenceImage} = params;
            const isModelSelected = !!uploadedModelImage || (selectedModels && selectedModels.length > 0) || !!promptedModelDescription.trim();

            if (isModelSelected) {
                // --- ON-MODEL PRODUCT SHOT ---
                if (!productImage) throw new Error("Product image is required for an on-model shot.");
                
                const { modelInteractionType, customModelInteraction } = productControls;
                let interactionPrompt = '';
                
                if (modelInteractionType.id === 'custom') {
                    if (!customModelInteraction.trim()) {
                        interactionPrompt = 'holding the product in their hands, presenting it towards the camera.';
                    } else {
                        interactionPrompt = customModelInteraction.trim();
                    }
                } else {
                    interactionPrompt = modelInteractionType.description || 'interacting with the product.'; // Fallback just in case
                }

                const {
                    shotType, expression, aperture, focalLength, cameraAngle,
                    lightingDirection, lightQuality, catchlightStyle, isHyperRealismEnabled,
                    cinematicLook, styleStrength, colorGrade
                } = productControls;

                let textPrompt = `**ON-MODEL PRODUCT PHOTOSHOOT DIRECTIVE**\n\n**PRIMARY GOAL:** Create a photorealistic image of a model interacting with a product based on the provided assets and detailed instructions.\n\n---`;

                 // --- 1. MODEL ---
                if (uploadedModelImage) {
                    textPrompt += `\n**1. MODEL IDENTITY (Source: First Image)**\n- **FACE & BODY (CRITICAL):** Recreate the person from the first image with perfect accuracy.\n- **IGNORE:** Ignore any clothing, background, or pose in the reference image.\n`;
                    const { mimeType, data } = parseDataUrl(uploadedModelImage);
                    parts.push({ inlineData: { mimeType, data } });
                } else if (selectedModels && selectedModels.length > 0) {
                    const selectedModel = selectedModels[0];
                    textPrompt += `\n**1. MODEL IDENTITY (Source: Text Description)**\n- **MISSION:** Generate a model that perfectly and exclusively matches this description: ${selectedModel.description}.\n`;
                } else if (promptedModelDescription.trim()){
                    textPrompt += `\n**1. MODEL IDENTITY (Source: Text Description)**\n- **MISSION:** Generate a model that perfectly and exclusively matches this description: ${promptedModelDescription}.\n`;
                } else {
                     throw new Error("No model specified for on-model product prompt generation.");
                }

                // --- 2. PRODUCT & INTERACTION ---
                textPrompt += `\n**2. PRODUCT & INTERACTION (Source: Second Image + User Settings)**\n- **PRODUCT:** The image features the product from the second image.\n- **INTERACTION (CRITICAL):** The model must be interacting with the product as follows: ${interactionPrompt}.\n`;
                const { mimeType, data } = parseDataUrl(productImage);
                parts.push({ inlineData: { mimeType, data } });

                 // --- 3. POSE ---
                textPrompt += `\n**3. POSE (Source: User Settings)**\n- **POSE (Body Language):** The model must be positioned exactly as described: ${shotType.description}.\n- **EXPRESSION:** The model's facial expression must be: ${expression.description}.\n`;

                // --- 4. SCENE & LIGHTING ---
                // ... (Copied & adapted from apparel logic)
                const isCustomBackground = scene.background.id === 'custom' && scene.background.type === 'image';
                const backgroundPrompt = isCustomBackground ? `in the environment depicted in the FINAL image provided` : scene.background.type === 'image' ? `in a photorealistic ${scene.background.name}` : `against a simple studio background with a ${scene.background.name.toLowerCase()} color.`;
                let lightingPrompt = `Apply ${scene.lighting.description}.`;
                if (lightingDirection.id !== 'ld1') lightingPrompt += ` The main light source is positioned ${lightingDirection.description}.`;
                if (lightQuality.id !== 'lq1') lightingPrompt += ` The light quality is ${lightQuality.description}.`;
                lightingPrompt += ` The final image should feature ${catchlightStyle.description}. The model, product, and background must all be lit from the same source for a cohesive photograph.`;
                textPrompt += `\n**4. SCENE & LIGHTING (Source: User Settings)**\n- **BACKGROUND:** The scene is set ${backgroundPrompt}.\n- **LIGHTING (CRITICAL):** ${lightingPrompt}\n`;

                // --- 5. CAMERA & LENS ---
                textPrompt += `\n**5. CAMERA & LENS (Source: User Settings)**\n- **CAMERA ANGLE:** ${cameraAngle.description}.\n- **APERTURE:** ${aperture.description}.\n- **FOCAL LENGTH:** ${focalLength.description}.\n`;

                // --- 6. FINAL IMAGE STYLE & QUALITY ---
                textPrompt += `\n**6. FINAL IMAGE STYLE & QUALITY (Source: User Settings)**\n- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}\n- **QUALITY:** This is a professional product photoshoot. The final output must be an ultra-high-quality, hyperrealistic photograph.\n`;
                if (styleDescription) textPrompt += `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}".\n`;
                if (colorGrade.id !== 'cg_none') textPrompt += `- **COLOR GRADE:** Apply a professional color grade with the following style: ${colorGrade.description}\n`;
                if (cinematicLook) textPrompt += `**CINEMATIC LOOK (ENABLED):** The image must have a cinematic quality, emulating a still from a high-budget film.\n`;
                if (isHyperRealismEnabled) textPrompt += `**HYPER-REALISM MODE (ENABLED):** Pay extreme attention to micro-details like skin pores, product textures, and ensure all anatomy is 100% accurate.\n`;
                
                parts.unshift({ text: textPrompt });
                if (isCustomBackground) {
                    const { mimeType: bgMime, data: bgData } = parseDataUrl(scene.background.value);
                    parts.push({ inlineData: { mimeType: bgMime, data: bgData } });
                }

                return { parts };

            } else {
                 // --- STAGED PRODUCT SHOT (FIXED Logic) ---
                if (!stagedAssets || stagedAssets.length === 0) throw new Error("No product assets specified for prompt generation.");
                
                const {
                    aperture, focalLength, cameraAngle, lightingDirection, lightQuality, catchlightStyle,
                    isHyperRealismEnabled, cinematicLook, styleStrength, colorGrade,
                    productShadow, customProps, surface, productMaterial,
                } = productControls;

                const isCustomBackground = scene.background.id === 'custom' && scene.background.type === 'image';
                const backgroundPrompt = isCustomBackground ? `in the environment depicted in the FINAL image provided` : scene.background.type === 'image' ? `in a photorealistic ${scene.background.name}` : `on a clean surface against a simple studio background with a ${scene.background.name.toLowerCase()} color.`;
                
                let lightingPrompt = '';
                if (scene.timeOfDay) {
                    const timeOfDayDescriptions = {
                        'Sunrise': 'The lighting should evoke early morning sunrise, with soft, warm, low-angle light creating long, gentle shadows.',
                        'Midday': 'The lighting should be bright, direct midday sun from high above, creating harsh, defined shadows.',
                        'Golden Hour': 'The lighting must be warm, golden hour sunlight from the side, creating a beautiful, soft glow.',
                        'Twilight': 'The scene is lit by the cool, soft, ambient light of twilight (blue hour), with very soft or no distinct shadows.',
                        'Night': 'The scene is set at night, with dramatic, artificial light sources like streetlights or neon signs, creating high contrast.'
                    };
                    lightingPrompt = timeOfDayDescriptions[scene.timeOfDay];
                } else {
                    lightingPrompt = `Apply ${scene.lighting.description}.`;
                    if (lightingDirection.id !== 'ld1') lightingPrompt += ` The main light source is positioned ${lightingDirection.description}.`;
                    if (lightQuality.id !== 'lq1') lightingPrompt += ` The light quality is ${lightQuality.description}.`;
                }
                lightingPrompt += ` The final image should feature ${catchlightStyle.description}. The product and background must all be lit from the same light source and direction to create a cohesive and realistic photograph.`;

                let textPrompt = `**PRODUCT PHOTOSHOOT DIRECTIVE**\n\n**PRIMARY GOAL:** Create a photorealistic image of a product staged in a scene, based on the provided assets and detailed instructions.\n\n---`;
            
                textPrompt += `\n**1. PRODUCT & STAGING (Source: Images + User Settings)**\n`;
                const productAsset = stagedAssets.find(a => a.id === 'product');
                const companionAssets = stagedAssets.filter(a => a.id !== 'product');
                
                if (productAsset) {
                    textPrompt += `- **PRIMARY PRODUCT:** The main product is shown in the first provided image. It should be rendered with a material that looks like ${productMaterial.description}\n`;
                }
                if (companionAssets.length > 0) {
                    textPrompt += `- **COMPANION ASSETS:** The scene also includes ${companionAssets.length} other item(s), provided in subsequent images.\n`;
                }
                if (stagedAssets.length > 0) {
                    textPrompt += `- **COMPOSITION:** The assets must be arranged as follows, described by their center coordinates and scale relative to the canvas: `;
                    stagedAssets.forEach(asset => {
                        textPrompt += `Asset '${asset.id}' is at (x: ${asset.x.toFixed(0)}%, y: ${asset.y.toFixed(0)}%) with a scale of ${asset.scale.toFixed(0)}% and z-index of ${asset.z}. `;
                    });
                    textPrompt += `\n`;
                }

                textPrompt += `\n**2. SCENE & ENVIRONMENT (Source: User Settings)**\n`;
                if (surface.id === 'surf_none') {
                    textPrompt += `- **SURFACE:** ${surface.description}\n`;
                } else {
                    textPrompt += `- **SURFACE:** The product ${surface.description}\n`;
                }
                textPrompt += `- **BACKGROUND:** The scene is set ${backgroundPrompt}.\n`;
                textPrompt += `- **LIGHTING (CRITICAL):** ${lightingPrompt}\n`;
                if (productShadow !== 'None') {
                    textPrompt += `- **SHADOW:** The product must cast a ${productShadow.toLowerCase()} shadow.\n`;
                }
                if(customProps.trim()) textPrompt += `- **PROPS:** The scene must also include: ${customProps.trim()}.\n`;
                if(scene.environmentalEffects.trim()) textPrompt += `- **EFFECTS:** The scene should have these atmospheric effects: ${scene.environmentalEffects.trim()}.\n`;
                textPrompt += `\n`;

                textPrompt += `**3. CAMERA & LENS (Source: User Settings)**\n`;
                textPrompt += `- **CAMERA ANGLE:** ${cameraAngle.description}.\n`;
                textPrompt += `- **APERTURE:** ${aperture.description}.\n`;
                textPrompt += `- **FOCAL LENGTH:** ${focalLength.description}.\n`;
                textPrompt += `\n`;

                textPrompt += `**4. FINAL IMAGE STYLE & QUALITY (Source: User Settings)**\n`;
                textPrompt += `- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}\n`;
                textPrompt += `- **QUALITY:** This is a professional product photoshoot. The final output must be an ultra-high-quality, hyperrealistic photograph.\n`;
                if (styleDescription) textPrompt += `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}". Apply this style with an influence of approximately ${styleStrength}%.\n`;
                if (colorGrade.id !== 'cg_none') textPrompt += `- **COLOR GRADE:** Apply a professional color grade with the following style: ${colorGrade.description}\n`;
                if (cinematicLook) textPrompt += `**CINEMATIC LOOK (ENABLED):** The image must have a cinematic quality, emulating a still from a high-budget film.\n`;
                if (isHyperRealismEnabled) textPrompt += `**HYPER-REALISM MODE (ENABLED):** Pay extreme attention to micro-details like product textures, material finishes, and ensure all reflections are realistic.\n`;
                
                parts.push({ text: textPrompt });
                
                const sortedAssets = [...stagedAssets].sort((a, b) => a.id === 'product' ? -1 : (b.id === 'product' ? 1 : 0));
                sortedAssets.forEach(asset => {
                    const { mimeType, data } = parseDataUrl(asset.base64);
                    parts.push({ inlineData: { mimeType, data } });
                });

                if (isCustomBackground) {
                    const { mimeType, data } = parseDataUrl(scene.background.value);
                    parts.push({ inlineData: { mimeType, data } });
                }

                return { parts };
            }
        }
        
        // ===================================
        // --- APPAREL MODE PROMPT LOGIC ---
        // ===================================
        if (params.studioMode === 'apparel') {
            const { uploadedModelImage, selectedModels, apparel, scene, generationMode, promptedModelDescription, modelLightingDescription, apparelControls } = params;
            
            if(apparel.length === 0) throw new Error("At least one apparel item is required.");

            let textPrompt = `**APPAREL PHOTOSHOOT DIRECTIVE**\n\n**PRIMARY GOAL:** Create a photorealistic image of a model wearing the provided apparel in a scene, based on the following detailed instructions.\n\n---`;

            // --- 1. MODEL ---
            if (uploadedModelImage) {
                textPrompt += `\n**1. MODEL IDENTITY (Source: First Image)**\n- **FACE & BODY (CRITICAL):** Recreate the person from the first image with perfect accuracy.\n- **IGNORE:** Ignore any clothing, background, or pose in the reference image.\n`;
                const { mimeType, data } = parseDataUrl(uploadedModelImage);
                parts.push({ inlineData: { mimeType, data } });
            } else if (selectedModels && selectedModels.length > 0) {
                const selectedModel = selectedModels[0];
                textPrompt += `\n**1. MODEL IDENTITY (Source: Text Description)**\n- **MISSION:** Generate a model that perfectly and exclusively matches this description: ${selectedModel.description}.\n`;
            } else if (promptedModelDescription.trim()){
                 textPrompt += `\n**1. MODEL IDENTITY (Source: Text Description)**\n- **MISSION:** Generate a model that perfectly and exclusively matches this description: ${promptedModelDescription}.\n`;
            } else {
                 throw new Error("No model specified for apparel prompt generation.");
            }

            // --- 2. APPAREL ---
            textPrompt += `\n**2. APPAREL (Source: Subsequent Images)**\n- **MISSION (CRITICAL):** The model MUST wear the clothing item(s) from the subsequent images. You are to extract **ONLY the garment** from each apparel image and **COMPLETELY IGNORE any person, mannequin, or background** present in those apparel images. The AI must accurately represent the style, color, and graphics of the clothing on the correct model, which is defined *only* in the 'MODEL IDENTITY' section.\n- **LAYERING:** Items are listed from innermost to outermost layer.\n`;
            apparel.forEach((item, index) => {
                textPrompt += `- **Item ${index + 1}:** ${item.description || `Apparel item ${index + 1}`}. Use the provided image for this item as the definitive reference.\n`;
                if(item.backViewBase64) textPrompt += `  - A back view image is also provided for 360-degree accuracy.\n`;
                if(item.detailViewBase64) textPrompt += `  - A detail view image is also provided for texture and small features.\n`;
            });
            textPrompt += '\n';

            // Push apparel images after model image
            apparel.forEach(item => {
                const { mimeType, data } = parseDataUrl(item.base64);
                parts.push({ inlineData: { mimeType, data } });
                if(item.backViewBase64) {
                    const { mimeType: backMime, data: backData } = parseDataUrl(item.backViewBase64);
                    parts.push({ inlineData: { mimeType: backMime, data: backData } });
                }
                 if(item.detailViewBase64) {
                    const { mimeType: detailMime, data: detailData } = parseDataUrl(item.detailViewBase64);
                    parts.push({ inlineData: { mimeType: detailMime, data: detailData } });
                }
            });

            // --- 3. POSE & STYLING ---
            const { shotType, expression, fabric, hairStyle, makeupStyle, garmentStyling } = apparelControls;
            textPrompt += `**3. POSE & STYLING (Source: User Settings)**
- **POSE (Body Language):** The model must be positioned exactly as described: ${shotType.description}.
- **EXPRESSION:** The model's facial expression must be: ${expression.description}.
`;
            if (hairStyle.trim()) textPrompt += `- **HAIR:** The model's hair is styled as: "${hairStyle.trim()}".\n`;
            if (makeupStyle.trim()) textPrompt += `- **MAKEUP:** The model's makeup is a "${makeupStyle.trim()}" look.\n`;
            if (garmentStyling.trim()) textPrompt += `- **GARMENT STYLING:** The clothing should be styled as follows: ${garmentStyling.trim()}.\n`;
            if (fabric.id !== 'fab1') textPrompt += `- **FABRIC TEXTURE:** The primary garment(s) should have the texture of ${fabric.description}\n`;
            textPrompt += '\n';

            // --- 4. SCENE & LIGHTING ---
            const isCustomBackground = scene.background.id === 'custom' && scene.background.type === 'image';
            const backgroundPrompt = isCustomBackground
                ? `in the environment depicted in the FINAL image provided`
                : scene.background.type === 'image' ? `in a photorealistic ${scene.background.name}` : `against a simple studio background with a ${scene.background.name.toLowerCase()} color.`;
            
            let lightingPrompt = '';
            const { lightingDirection, lightQuality, catchlightStyle } = apparelControls;

            if (scene.timeOfDay) {
                 const timeOfDayDescriptions = {
                    'Sunrise': 'The lighting should evoke early morning sunrise, with soft, warm, low-angle light creating long, gentle shadows.',
                    'Midday': 'The lighting should be bright, direct midday sun from high above, creating harsh, defined shadows.',
                    'Golden Hour': 'The lighting must be warm, golden hour sunlight from the side, creating a beautiful, soft glow.',
                    'Twilight': 'The scene is lit by the cool, soft, ambient light of twilight (blue hour), with very soft or no distinct shadows.',
                    'Night': 'The scene is set at night, with dramatic, artificial light sources like streetlights or neon signs, creating high contrast.'
                };
                lightingPrompt = timeOfDayDescriptions[scene.timeOfDay];
            } else if (scene.lighting.isDynamic && modelLightingDescription) {
                 lightingPrompt = `Match the lighting style from the original model's photo, which is described as: "${modelLightingDescription}".`;
            } else {
                lightingPrompt = `Apply ${scene.lighting.description}.`;
            }
            if (lightingDirection.id !== 'ld1') lightingPrompt += ` The main light source is positioned ${lightingDirection.description}.`;
            if (lightQuality.id !== 'lq1') lightingPrompt += ` The light quality is ${lightQuality.description}.`;
            lightingPrompt += ` The final image should feature ${catchlightStyle.description}.`;
            lightingPrompt += ' The model, apparel, and background must all be lit from the same light source and direction to create a cohesive and realistic photograph.';

            textPrompt += `**4. SCENE & LIGHTING (Source: User Settings)**
- **BACKGROUND:** The scene is set ${backgroundPrompt}.
- **LIGHTING (CRITICAL):** ${lightingPrompt}
`;
            if(scene.sceneProps.trim()) textPrompt += `- **PROPS:** The scene must include: ${scene.sceneProps.trim()}.\n`;
            if(scene.environmentalEffects.trim()) textPrompt += `- **EFFECTS:** The scene should have these atmospheric effects: ${scene.environmentalEffects.trim()}.\n`;
            textPrompt += '\n';
            
            if (isCustomBackground) {
                 const { mimeType, data } = parseDataUrl(scene.background.value);
                 parts.push({ inlineData: { mimeType, data } });
            }

            // --- 5. CAMERA & LENS ---
            const { cameraAngle, aperture, focalLength } = apparelControls;
            textPrompt += `**5. CAMERA & LENS (Source: User Settings)**
- **CAMERA ANGLE:** ${cameraAngle.description}.
- **APERTURE:** ${aperture.description}.
- **FOCAL LENGTH:** ${focalLength.description}.
\n`;

            // --- 6. FINAL IMAGE STYLE & QUALITY ---
            const { isHyperRealismEnabled, cinematicLook, styleStrength, colorGrade } = apparelControls;
            textPrompt += `**6. FINAL IMAGE STYLE & QUALITY (Source: User Settings)**
- **ASPECT RATIO (CRITICAL):** ${getAspectRatioPrompt(aspectRatio)}
- **QUALITY:** This is a professional photoshoot. The final output must be an ultra-high-quality, hyperrealistic, and tack-sharp photograph.
`;
            if (styleDescription) textPrompt += `- **STYLISTIC GOAL:** The final image must match the artistic style described as: "${styleDescription}". Apply this style with an influence of approximately ${styleStrength}%.\n`;
            if (colorGrade.id !== 'cg_none') textPrompt += `- **COLOR GRADE:** Apply a professional color grade with the following style: ${colorGrade.description}\n`;
            if (cinematicLook) textPrompt += `**CINEMATIC LOOK (ENABLED):** The image must have a cinematic quality, emulating a still from a high-budget film with fine, realistic film grain.\n`;
            if (isHyperRealismEnabled) textPrompt += `**HYPER-REALISM MODE (ENABLED):** Pay extreme attention to micro-details like skin pores, fabric weave, and ensure all anatomy is 100% accurate.\n`;
            
            parts.unshift({ text: textPrompt });
            return { parts };
        }

        return { parts };
    },
};
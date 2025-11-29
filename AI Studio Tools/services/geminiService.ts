import { GoogleGenAI, Type, Modality } from "@google/genai";
// FIX: Import PhotoshootConcept to be used in the new generateConceptSuggestions method.
import type { AspectRatio, ArtDirectorSuggestion, ApparelCategory, AIModel, SceneSuggestion, PhotoshootConcept } from "../types";
import { BACKGROUNDS_LIBRARY, LIGHTING_PRESETS, SHOT_TYPES_LIBRARY, EXPRESSIONS, APERTURES_LIBRARY, FOCAL_LENGTHS_LIBRARY, CAMERA_ANGLES_LIBRARY, COLOR_GRADING_PRESETS } from "../constants";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using mock service.");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

// Helper to parse Data URL
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


// --- MOCK FUNCTIONS for development without API KEY ---
const mockGenerateImage = async (baseParts: any[], aspectRatio: AspectRatio['value'], numberOfImages: number, negativePrompt: string | undefined, onImageGenerated: (imageB64: string, index: number) => void): Promise<void> => {
    console.log("--- MOCK API CALL: generatePhotoshootImage ---");
    console.log("Parts:", baseParts);
    console.log("Aspect Ratio:", aspectRatio);
    console.log("Number of Images:", numberOfImages);
    if (negativePrompt) console.log("Negative Prompt:", negativePrompt);
    
    const textPart = baseParts.find(p => p.text)?.text || '';

    let width = 1024;
    let height = 1365; // default 3:4
    if (aspectRatio === '1:1') { width = 1024; height = 1024; }
    if (aspectRatio === '4:3') { width = 1024; height = 768; }
    if (aspectRatio === '16:9') { width = 1280; height = 720; }
    
    const generationPromises = Array.from({ length: numberOfImages }).map(async (_, i) => {
        // Simulate varying generation times
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1500));
        
        const seed = (textPart.length % 100) + i;
        const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
            onImageGenerated(base64, i);
        } catch (error) {
            console.error("Error fetching mock image:", error);
            // In a real scenario, you might want to signal an error for this specific image
        }
    });
    
    await Promise.all(generationPromises);
};

const mockGenerateWithImagen = async (prompt: string, aspectRatio: AspectRatio['value']): Promise<string> => {
    console.log("--- MOCK API CALL: generateWithImagen ---");
    console.log("Prompt:", prompt);
    console.log("Aspect Ratio:", aspectRatio);
    await new Promise(resolve => setTimeout(resolve, 2000));
    let width = 1024;
    let height = 1365; // default 3:4
    if (aspectRatio === '1:1') { width = 1024; height = 1024; }
    if (aspectRatio === '4:3') { width = 1024; height = 768; }
    if (aspectRatio === '16:9') { width = 1280; height = 720; }
    if (aspectRatio === '9:16') { width = 720; height = 1280; }
    const seed = (prompt.length % 100);
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

const mockDescribeImageStyle = async (imageB64: string): Promise<string> => {
    console.log("--- MOCK API CALL: describeImageStyle ---");
    await new Promise(resolve => setTimeout(resolve, 800));
    return "A moody, cinematic style with high contrast, desaturated colors, a slight blue tint in the shadows, and a soft, diffused lighting effect from the side. The overall feeling is melancholic and dramatic.";
};

const mockGetArtDirectorSuggestions = async (garmentImageB64: string): Promise<ArtDirectorSuggestion[]> => {
    console.log("--- MOCK API CALL: getArtDirectorSuggestion ---");
    await new Promise(resolve => setTimeout(resolve, 1200));
    return [
        {
            id: 'concept-1',
            conceptName: "E-commerce Clean",
            shotTypeId: SHOT_TYPES_LIBRARY[0].id, // Full Body Front
            lightingId: LIGHTING_PRESETS[1].id, // Studio Softbox
            backgroundId: BACKGROUNDS_LIBRARY[1].id, // Studio Grey
            expressionId: EXPRESSIONS[1].id, // Soft Smile
            apertureId: APERTURES_LIBRARY[2].id, // Deep (f/8)
            focalLengthId: FOCAL_LENGTHS_LIBRARY[2].id, // 50mm
            cameraAngleId: CAMERA_ANGLES_LIBRARY[0].id, // Eye-Level
            colorGradeId: COLOR_GRADING_PRESETS[3].id, // Vibrant & Punchy
            reasoning: "A clean, bright, and approachable look perfect for e-commerce. Studio lighting and a simple background ensure the garment is the hero of the shot.",
            prompt: "A fashion model wearing a [garment description], in a full-body shot from the front, standing confidently, with a soft smile. Shot in a studio with softbox lighting against a grey background. The image is shot with an 85mm lens at f/8 to keep everything in focus. The final image has a vibrant and punchy color grade."
        },
        {
            id: 'concept-2',
            conceptName: "Urban Lifestyle",
            shotTypeId: SHOT_TYPES_LIBRARY[4].id, // Walking Motion
            lightingId: LIGHTING_PRESETS[8].id, // Overcast Day
            backgroundId: BACKGROUNDS_LIBRARY[3].id, // City Street
            expressionId: EXPRESSIONS[3].id, // Joyful
            apertureId: APERTURES_LIBRARY[1].id, // Mid-range
            focalLengthId: FOCAL_LENGTHS_LIBRARY[1].id, // 35mm
            cameraAngleId: CAMERA_ANGLES_LIBRARY[0].id, // Eye-Level
            colorGradeId: COLOR_GRADING_PRESETS[0].id, // None
            reasoning: "A dynamic, in-motion shot that feels authentic and relatable. Best for social media or lookbooks to show the garment in a real-world context.",
            prompt: "A fashion model wearing a [garment description], captured in a dynamic walking pose on a city street with a joyful expression. The lighting is soft and even, as from an overcast day. Shot with a 35mm lens at f/4 for a natural, in-the-moment feel."
        },
        {
            id: 'concept-3',
            conceptName: "Dramatic Editorial",
            shotTypeId: SHOT_TYPES_LIBRARY[8].id, // Hero Pose
            lightingId: LIGHTING_PRESETS[2].id, // Dramatic Hard Light
            backgroundId: BACKGROUNDS_LIBRARY[7].id, // Brutalist Arch
            expressionId: EXPRESSIONS[4].id, // Serious
            apertureId: APERTURES_LIBRARY[0].id, // Shallow
            focalLengthId: FOCAL_LENGTHS_LIBRARY[3].id, // 85mm
            cameraAngleId: CAMERA_ANGLES_LIBRARY[1].id, // Low Angle
            colorGradeId: COLOR_GRADING_PRESETS[2].id, // High-Contrast B&W
            reasoning: "A powerful, high-fashion concept. The low-angle hero pose combined with dramatic hard light and a B&W grade creates a striking, artistic, and memorable image.",
            prompt: "Black and white editorial photo of a fashion model wearing a [garment description], standing in a powerful hero pose. The background is a brutalist architectural arch. The lighting is dramatic and hard, creating strong shadows. The model has a serious expression. Shot from a low angle with an 85mm lens at f/1.8 for a blurred background."
        },
        {
            id: 'concept-4',
            conceptName: "Golden Hour Serenity",
            shotTypeId: SHOT_TYPES_LIBRARY[7].id, // Candid Look
            lightingId: LIGHTING_PRESETS[1].id, // Golden Hour
            backgroundId: BACKGROUNDS_LIBRARY[6].id, // Lush Forest
            expressionId: EXPRESSIONS[6].id, // Serene
            apertureId: APERTURES_LIBRARY[0].id, // Shallow
            focalLengthId: FOCAL_LENGTHS_LIBRARY[3].id, // 85mm
            cameraAngleId: CAMERA_ANGLES_LIBRARY[0].id, // Eye-Level
            colorGradeId: COLOR_GRADING_PRESETS[5].id, // Warm & Golden
            reasoning: "A warm, dreamy, and aspirational outdoor concept. The golden hour light creates a beautiful, soft glow, perfect for lifestyle brands.",
            prompt: "A fashion model wearing a [garment description], looking away from the camera with a serene expression. The scene is a lush forest during golden hour, with warm sunlight filtering through the trees. Shot with an 85mm portrait lens at f/1.8 to create a beautifully blurred background. The final image has a warm and golden color grade."
        },
        {
            id: 'concept-5',
            conceptName: "Architectural Lookbook",
            shotTypeId: SHOT_TYPES_LIBRARY[5].id, // Elegant Lean
            lightingId: LIGHTING_PRESETS[14].id, // Window Light
            backgroundId: BACKGROUNDS_LIBRARY[4].id, // Modern Interior
            expressionId: EXPRESSIONS[0].id, // Neutral
            apertureId: APERTURES_LIBRARY[1].id, // Mid-range
            focalLengthId: FOCAL_LENGTHS_LIBRARY[1].id, // 35mm
            cameraAngleId: CAMERA_ANGLES_LIBRARY[0].id, // Eye-Level
            colorGradeId: COLOR_GRADING_PRESETS[6].id, // Cool & Crisp
            reasoning: "A sophisticated and clean concept that blends fashion with minimalist architecture. Soft window light provides a high-end feel.",
            prompt: "A fashion model wearing a [garment description], leaning elegantly inside a modern interior with a neutral expression. The scene is lit by soft, directional window light. Shot with a 35mm wide-angle lens at f/4 to capture the environment. The final image has a cool and crisp color grade."
        }
    ];
};

const mockGenerativeEdit = async (params: { originalImageB64: string, maskImageB64: string, prompt: string, apparelImageB64?: string | null }): Promise<string> => {
    console.log("--- MOCK API CALL: generativeEdit ---");
    console.log("Prompt:", params.prompt);
    if(params.apparelImageB64) console.log("With Apparel Reference!");
    // Just return the original image for the mock
    await new Promise(resolve => setTimeout(resolve, 1500));
    return params.originalImageB64;
};

const mockRemoveBackground = async (imageB64: string): Promise<string> => {
    console.log("--- MOCK API CALL: removeBackground ---");
    // Just return the original image for the mock to simulate a "failed" or no-op cutout
    await new Promise(resolve => setTimeout(resolve, 1000));
    return imageB64;
};

const mockIsolateGarment = async (imageB64: string): Promise<string> => {
    console.log("--- MOCK API CALL: isolateGarment ---");
    await new Promise(resolve => setTimeout(resolve, 1500));
    // For mock, just return the original. In a real scenario, this would be a processed image.
    return imageB64;
};


const mockAnalyzeApparel = async (imageB64: string): Promise<{ description: string, category: ApparelCategory }> => {
    console.log("--- MOCK API CALL: analyzeApparel ---");
    await new Promise(resolve => setTimeout(resolve, 900));
    const categories: ApparelCategory[] = ['Top', 'Bottom', 'Full Body', 'Outerwear'];
    const hashCode = imageB64.split("").reduce((acc, char) => char.charCodeAt(0) + ((acc << 5) - acc), 0);
    const index = Math.abs(hashCode) % categories.length;
    const category = categories[index];
    return {
        description: '',
        category: category,
    };
};


const mockGetSceneSuggestions = async (imageB64: string, productName: string): Promise<SceneSuggestion[]> => {
    console.log("--- MOCK API CALL: getSceneSuggestions for", productName, "---");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return [
        { 
            conceptName: "Everyday Carry", 
            sceneDescription: `The ${productName} is placed on a rustic wooden desk next to a leather-bound notebook and a steaming mug of coffee. Soft morning light streams in from a nearby window.`,
            previewPrompt: "A rustic wooden desk with a notebook and coffee mug, soft morning window light."
        },
        { 
            conceptName: "On The Go", 
            sceneDescription: `A person is seen from a first-person perspective, holding the ${productName} in their hand against a blurred city street background.`,
            previewPrompt: "First-person view of a hand against a blurred city street background."
        },
        { 
            conceptName: "Suspended in Time", 
            sceneDescription: `The ${productName} is floating mid-air, surrounded by slowly drifting particles of dust, illuminated by a single, dramatic spotlight from above against a dark background.`,
            previewPrompt: "Abstract photo of dust particles floating in a single spotlight against a dark background."
        },
        { 
            conceptName: "Material Focus", 
            sceneDescription: `An extreme macro shot focusing on the texture of the ${productName}'s material. The lighting is sharp and from the side to highlight every detail and imperfection.`,
            previewPrompt: "Extreme macro shot of brushed metal texture with sharp side lighting."
        },
        { 
            conceptName: "Minimalist Stand", 
            sceneDescription: `The ${productName} is displayed on a clean, white marble pedestal. The background is a seamless, soft grey studio backdrop, with bright, even, and shadowless e-commerce lighting.`,
            previewPrompt: "A white marble pedestal on a seamless soft grey studio background."
        },
    ];
};

const mockDescribeModel = async (imageB64: string): Promise<Pick<AIModel, 'name' | 'description' | 'gender'>> => {
    console.log("--- MOCK API CALL: describeModel ---");
    await new Promise(resolve => setTimeout(resolve, 1200));
    return {
        name: "Alex",
        gender: "Female",
        description: "A professional female model in her mid-20s, with sharp, defined cheekbones, striking blue eyes, and wavy brown hair styled in a side part. She has a confident, neutral expression. Her build is slender and athletic. Caucasian ethnicity."
    };
};

const mockSuggestLayering = async (items: {id: string}[]): Promise<string[]> => {
    console.log("--- MOCK API CALL: suggestLayering ---");
    await new Promise(resolve => setTimeout(resolve, 900));
    // Simple mock: reverse the order
    return items.map(item => item.id).reverse();
};

const mockGenerateConceptSuggestions = async (imageB64: string): Promise<PhotoshootConcept[]> => {
    console.log("--- MOCK API CALL: generateConceptSuggestions ---");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { id: 'concept-1', name: 'Urban Explorer', description: 'Model in a dynamic walking pose on a city street.', prompt: 'photo of the model from the reference image, dynamic walking pose on a busy city street, candid style, full body shot' },
        { id: 'concept-2', name: 'Minimalist Studio', description: 'Clean, high-fashion shot against a solid grey background.', prompt: 'photo of the model from the reference image, full body shot, standing against a solid light grey studio background, soft studio lighting' },
        { id: 'concept-3', name: 'Golden Hour Portrait', description: 'Warm, backlit portrait in a natural, outdoor setting.', prompt: 'photo of the model from the reference image, waist-up portrait, backlit by golden hour sun in a field of tall grass, dreamy look' },
        { id: 'concept-4', name: 'Moody Black & White', description: 'Dramatic, high-contrast black and white shot with strong shadows.', prompt: 'dramatic black and white photo of the model from the reference image, high-contrast lighting, intense expression, film grain' },
    ];
};

const mockNameProduct = async (imageB64: string): Promise<string> => {
    console.log("--- MOCK API CALL: nameProduct ---");
    await new Promise(resolve => setTimeout(resolve, 800));
    return "Silver Chronograph Watch";
};

const mockReverseEngineerPrompt = async (imageB64: string): Promise<string> => {
    console.log("--- MOCK API CALL: reverseEngineerPrompt ---");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return "A photorealistic medium shot of a fashion model with blonde hair, wearing a blue t-shirt, standing on a beach at sunset, dramatic golden hour lighting, shot with an 85mm portrait lens at f/1.8, cinematic style, shallow depth of field.";
};

// FIX: Add mock functions for video generation.
const mockGenerateVideo = async (): Promise<any> => {
    console.log("--- MOCK API CALL: generatePhotoshootVideo ---");
    await new Promise(resolve => setTimeout(resolve, 1000));
    return { id: 'mock-op-123', done: false };
};

const mockGetVideoOperationStatus = async (operation: any): Promise<any> => {
    console.log("--- MOCK API CALL: getVideoOperationStatus ---");
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
        ...operation, 
        done: true, 
        response: { 
            generatedVideos: [{ 
                video: { uri: 'https://example.com/mock-video.mp4' } 
            }] 
        } 
    };
};

const mockFetchVideoAsBlobUrl = async (downloadLink: string): Promise<string> => {
    console.log("--- MOCK API CALL: fetchVideoAsBlobUrl ---", downloadLink);
    await new Promise(resolve => setTimeout(resolve, 500));
    // In a real mock, you might fetch a placeholder video. Here, we'll just return a string.
    return "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4";
};


// --- END MOCK FUNCTIONS ---


export const geminiService = {
  generateWithImagen: async (prompt: string, aspectRatio: AspectRatio['value']): Promise<string> => {
      if (!ai) return mockGenerateWithImagen(prompt, aspectRatio);
      try {
          const response = await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: prompt,
              config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                  aspectRatio: aspectRatio,
              },
          });

          if (response.generatedImages && response.generatedImages.length > 0) {
              const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
              return `data:image/png;base64,${base64ImageBytes}`;
          }
          throw new Error("Imagen generation failed to return an image.");
      } catch (error) {
          console.error("Error generating with Imagen:", error);
          throw error;
      }
  },

  generateStyledImage: async (prompt: string, images: string[]): Promise<string> => {
    if (!ai) { // Mock function
        console.log("--- MOCK API CALL: generateStyledImage ---");
        console.log("Prompt:", prompt);
        await new Promise(resolve => setTimeout(resolve, 1500));
        const seed = (prompt.length % 100);
        const imageUrl = `https://picsum.photos/seed/${seed}/1024/1365`;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    try {
        const parts: any[] = [{ text: prompt }];
        for (const imageB64 of images) {
            const { mimeType, data } = parseDataUrl(imageB64);
            parts.push({ inlineData: { mimeType, data } });
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE],
                imageConfig: {
                    aspectRatio: '4:5'
                }
            },
        });

        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    return `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
        }
        throw new Error("Styled image generation failed to return an image.");

    } catch (error) {
        console.error("Error generating styled image with Gemini:", error);
        throw error;
    }
  },
  
  analyzeApparel: async (imageB64: string): Promise<{ description: string; category: ApparelCategory }> => {
    if (!ai) return mockAnalyzeApparel(imageB64);
    
    try {
        const { mimeType, data } = parseDataUrl(imageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { text: "You are a fashion expert. Analyze the image of the apparel item. Classify it into ONE of the following categories: Top, Bottom, Full Body, Outerwear, Accessory, Footwear. Return ONLY the JSON object." };
        
        const validCategories: ApparelCategory[] = ['Top', 'Bottom', 'Full Body', 'Outerwear', 'Accessory', 'Footwear'];

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        category: { type: Type.STRING, enum: validCategories },
                    },
                    required: ["category"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as { category: ApparelCategory };
        return {
            category: parsed.category || 'Uncategorized',
            description: ''
        };

    } catch(error) {
        console.error("Error analyzing apparel with Gemini:", error);
        return { category: 'Uncategorized', description: '' };
    }
  },

  suggestLayering: async (items: {id: string, description: string, category: ApparelCategory}[]): Promise<string[]> => {
    if (!ai) return mockSuggestLayering(items);
    
    try {
        const itemsString = items.map(i => `ID: ${i.id}, CATEGORY: ${i.category}, DESCRIPTION: ${i.description}`).join('\n');
        const textPrompt = `You are an expert fashion stylist. I will provide you with a list of apparel items. Your task is to determine the correct layering order, from the innermost garment to the outermost. Consider the item's category and description.\n\nHere are the items:\n${itemsString}\n\nReturn ONLY a JSON object with a single key 'orderedIds' which is an array of the item IDs in the correct order.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        orderedIds: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["orderedIds"]
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as { orderedIds: string[] };
        return parsed.orderedIds || [];
    } catch(error) {
        console.error("Error suggesting layering from Gemini:", error);
        throw error;
    }
  },

  describeModel: async (imageB64: string): Promise<Pick<AIModel, 'name' | 'description' | 'gender'>> => {
    if (!ai) return mockDescribeModel(imageB64);

    try {
      const { mimeType, data } = parseDataUrl(imageB64);
      const imagePart = { inlineData: { mimeType, data } };
      const textPart = { text: "You are an expert model casting director. Analyze the image of the person. Generate a detailed, professional description suitable for recreating this person with an AI image generator. The description should include gender, estimated age, ethnicity, hair style and color, facial features (eyes, nose, jawline, etc.), and body type. Also suggest a plausible first name for the model. Return ONLY a JSON object with the required properties." };

      const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: { parts: [imagePart, textPart] },
          config: {
              responseMimeType: "application/json",
              responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                      name: { type: Type.STRING, description: "A plausible first name for the person in the image." },
                      gender: { type: Type.STRING, enum: ['Male', 'Female'] },
                      description: { type: Type.STRING, description: "A detailed, professional description of the model's appearance, including ethnicity, age, hair, facial features, and body type." }
                  },
                  required: ["name", "gender", "description"]
              }
          }
      });
      
      const jsonString = response.text.trim();
      return JSON.parse(jsonString) as Pick<AIModel, 'name' | 'description' | 'gender'>;

    } catch (error) {
        console.error("Error describing model with Gemini:", error);
        throw error;
    }
  },

  nameProduct: async (imageB64: string): Promise<string> => {
    if (!ai) return mockNameProduct(imageB64);
    try {
        const { mimeType, data } = parseDataUrl(imageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { text: "Analyze the image of the product. Provide a concise, descriptive name for it (e.g., 'Black leather handbag', 'Silver chronograph watch'). Return ONLY the name as a single line of text." };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error naming product:", error);
        throw error;
    }
  },

  getSceneSuggestions: async (imageB64: string, productName: string): Promise<SceneSuggestion[]> => {
    if (!ai) return mockGetSceneSuggestions(imageB64, productName);
    
    try {
        const { mimeType, data } = parseDataUrl(imageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { text: `You are an expert product photographer and prop stylist. The product is a "${productName}". Analyze the provided product image. 
    
        Generate 5 unique, professional, and distinct scene concepts for this product, one for each of the following categories:
        1.  **Use Case:** A scene showing the product in its natural environment or being used.
        2.  **With a Person:** A lifestyle concept describing how a person would interact with the product (do not show the person in the preview).
        3.  **Creative Photoshoot:** An abstract, artistic, or editorial concept that is visually striking.
        4.  **Close-up Detail:** A concept focusing on a macro shot of the product's material or a key feature.
        5.  **Clean E-commerce:** A simple, front-facing e-commerce style shot but with an interesting surface or minimal prop.
        
        For each concept, provide:
        1. 'conceptName': A short, evocative name (e.g., "Morning Ritual", "Urban Carry").
        2. 'sceneDescription': A detailed prompt for the final image generation. Describe the surface, props, and lighting style. For the "With a Person" concept, describe the interaction here.
        3. 'previewPrompt': A simple, abstract prompt to generate a visual preview of the scene's key elements and mood. Do NOT mention the product or person in the preview prompt.
    
        Return ONLY the JSON object.` };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            conceptName: { type: Type.STRING, description: "A short, evocative name for the scene concept." },
                            sceneDescription: { type: Type.STRING, description: "A detailed description of the scene, props, and lighting for the final image generation." },
                            previewPrompt: { type: Type.STRING, description: "A simple, abstract prompt to generate a visual preview of the scene's elements and mood." }
                        },
                        required: ["conceptName", "sceneDescription", "previewPrompt"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as SceneSuggestion[];
        return parsed || [];

    } catch(error) {
        console.error("Error getting scene suggestions from Gemini:", error);
        throw error;
    }
  },

  removeBackground: async (imageB64: string): Promise<string> => {
    if (!ai) return mockRemoveBackground(imageB64);
    try {
      const { mimeType, data } = parseDataUrl(imageB64);
      const imagePart = { inlineData: { mimeType, data } };
      const textPart = { text: "Your task is to act as an expert photo editor. You will be given an image of a product. Your sole mission is to perfectly isolate the main product from its background. Return a new image where the isolated product is placed on a pure white background (#FFFFFF). The output image MUST have the exact same dimensions as the input image. Do not add any shadows or effects. The product itself must not be altered." };

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [textPart, imagePart] },
          config: {
              responseModalities: [Modality.IMAGE, Modality.TEXT],
          },
      });

      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
      }
      throw new Error("Background removal failed to return an image.");
    } catch(error) {
        console.error("Error removing background with Gemini:", error);
        throw error;
    }
  },

  isolateGarment: async (imageB64: string): Promise<string> => {
    if (!ai) return mockIsolateGarment(imageB64);
    try {
      const { mimeType, data } = parseDataUrl(imageB64);
      const imagePart = { inlineData: { mimeType, data } };
      const textPart = { text: "You are an expert photo editor. Your task is to perfectly isolate the apparel item(s) from the person wearing them. Remove the person completely and place the isolated garment(s) onto a clean, neutral grey background (#cccccc) in a flat-lay style. The output image must have the same dimensions as the input. Do not alter the apparel itself." };

      const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [textPart, imagePart] },
          config: {
              responseModalities: [Modality.IMAGE],
          },
      });

      if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
      }
      throw new Error("Garment isolation failed to return an image.");
    } catch(error) {
        console.error("Error isolating garment with Gemini:", error);
        throw error;
    }
  },

  describeImageStyle: async (imageB64: string): Promise<string> => {
    if (!ai) return mockDescribeImageStyle(imageB64);

    try {
      const { mimeType, data } = parseDataUrl(imageB64);
      const imagePart = {
        inlineData: {
          mimeType,
          data,
        },
      };
      const textPart = {
        text: 'You are a professional photographer. Describe the lighting in this image in detail. Focus on the light quality (hard, soft), direction (front, side, back), color (warm, cool), and any specific characteristics like catchlights in the eyes or atmospheric effects. Be descriptive and evocative, as if explaining the setup to another photographer.'
      };

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
      });
      
      return response.text;
    } catch (error) {
      console.error("Error describing image style with Gemini:", error);
      throw error;
    }
  },

  getArtDirectorSuggestions: async (garmentImageB64: string): Promise<ArtDirectorSuggestion[]> => {
    if (!ai) return mockGetArtDirectorSuggestions(garmentImageB64);

    const validShotTypeIds = SHOT_TYPES_LIBRARY.map(p => p.id);
    const validLightingIds = LIGHTING_PRESETS.map(l => l.id);
    const validBackgroundIds = BACKGROUNDS_LIBRARY.map(b => b.id);
    const validExpressionIds = EXPRESSIONS.map(e => e.id);
    const validApertureIds = APERTURES_LIBRARY.map(a => a.id);
    const validFocalLengthIds = FOCAL_LENGTHS_LIBRARY.map(f => f.id);
    const validCameraAngleIds = CAMERA_ANGLES_LIBRARY.map(c => c.id);
    const validColorGradeIds = COLOR_GRADING_PRESETS.map(c => c.id);

    try {
        const { mimeType, data } = parseDataUrl(garmentImageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { 
          text: `You are an expert fashion Art Director. Analyze the provided garment image. Based on its style, suggest FIVE distinct and varied photoshoot concepts.

          For each concept, provide:
          1.  A unique 'conceptName' (e.g., "Urban Lifestyle").
          2.  Simple 'reasoning' (max 20 words) on why the concept fits the garment's style.
          3.  A complete, copyable 'prompt' for an AI image generator. This prompt MUST incorporate all the specific photoshoot settings for that concept, including pose, background, lighting, camera settings, and color grade. Use "[garment description]" as a placeholder for the clothing.

          You MUST generate one concept for EACH of the following five categories:
          1.  **E-commerce Clean:** Bright, product-focused, on a minimal studio background.
          2.  **Urban Lifestyle:** Candid, relatable, in a modern city environment.
          3.  **Dramatic Editorial:** A moody, high-fashion, artistic concept.
          4.  **Golden Hour Natural:** A warm, inviting outdoor shot during golden hour.
          5.  **Architectural Lookbook:** A sophisticated shot in a modern architectural setting.

          Return ONLY a JSON array containing exactly FIVE objects. Each object in the array must have all the required properties.

          Valid Shot Type IDs: ${validShotTypeIds.join(', ')}
          Valid Lighting IDs: ${validLightingIds.join(', ')}
          Valid Background IDs: ${validBackgroundIds.join(', ')}
          Valid Expression IDs: ${validExpressionIds.join(', ')}
          Valid Aperture IDs: ${validApertureIds.join(', ')}
          Valid Focal Length IDs: ${validFocalLengthIds.join(', ')}
          Valid Camera Angle IDs: ${validCameraAngleIds.join(', ')}
          Valid Color Grade IDs: ${validColorGradeIds.join(', ')}
          `
        };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                       type: Type.OBJECT,
                       properties: {
                            id: { type: Type.STRING, description: "A unique identifier for the concept, e.g., 'concept-1'."},
                            conceptName: { type: Type.STRING, description: "A short, catchy name for the creative concept, like 'Golden Hour Dream' or 'Urban Edge'." },
                            shotTypeId: { type: Type.STRING, description: `One of: ${validShotTypeIds.join(', ')}` },
                            lightingId: { type: Type.STRING, description: `One of: ${validLightingIds.join(', ')}` },
                            backgroundId: { type: Type.STRING, description: `One of: ${validBackgroundIds.join(', ')}` },
                            expressionId: { type: Type.STRING, description: `One of: ${validExpressionIds.join(', ')}` },
                            apertureId: { type: Type.STRING, description: `One of: ${validApertureIds.join(', ')}` },
                            focalLengthId: { type: Type.STRING, description: `One of: ${validFocalLengthIds.join(', ')}` },
                            cameraAngleId: { type: Type.STRING, description: `One of: ${validCameraAngleIds.join(', ')}` },
                            colorGradeId: { type: Type.STRING, description: `One of: ${validColorGradeIds.join(', ')}` },
                            reasoning: { type: Type.STRING, description: "A simple rationale for the creative choices (max 20 words)." },
                            prompt: { type: Type.STRING, description: "A complete, copyable prompt for an AI image generator that includes all settings." }
                       },
                       required: ["id", "conceptName", "shotTypeId", "lightingId", "backgroundId", "expressionId", "apertureId", "focalLengthId", "cameraAngleId", "colorGradeId", "reasoning", "prompt"]
                   }
                },
            },
        });

        const jsonString = response.text.trim();
        const suggestions = JSON.parse(jsonString) as ArtDirectorSuggestion[];

        // Validate IDs to ensure Gemini didn't hallucinate
        for (const suggestion of suggestions) {
            if (!validShotTypeIds.includes(suggestion.shotTypeId) ||
                !validLightingIds.includes(suggestion.lightingId) ||
                !validBackgroundIds.includes(suggestion.backgroundId) ||
                !validExpressionIds.includes(suggestion.expressionId) ||
                !validApertureIds.includes(suggestion.apertureId) ||
                !validFocalLengthIds.includes(suggestion.focalLengthId) ||
                !validCameraAngleIds.includes(suggestion.cameraAngleId) ||
                !validColorGradeIds.includes(suggestion.colorGradeId)) {
                console.warn("Gemini returned invalid IDs in a suggestion, falling back to mock.", suggestion);
                return mockGetArtDirectorSuggestions(garmentImageB64); // fallback
            }
        }

        return suggestions;
    } catch (error) {
        console.error("Error getting art director suggestion:", error);
        // fallback to mock on error to avoid breaking the flow
        return mockGetArtDirectorSuggestions(garmentImageB64);
    }
  },

  generateDynamicPOVShots: async (): Promise<{ name: string; description: string }[]> => {
    if (!ai) { // Mock implementation for development
        console.log("--- MOCK API CALL: generateDynamicPOVShots ---");
        await new Promise(resolve => setTimeout(resolve, 1000));
        return [
            { name: "Morning Coffee POV", description: "A first-person view holding a warm mug of coffee, looking down at the outfit. The lighting is soft morning window light." },
            { name: "City Explorer", description: "A point-of-view shot looking down at feet wearing stylish sneakers, with interesting city pavement visible. The outfit is visible in the lower half of the frame." },
            { name: "Mirror Check", description: "A casual point-of-view shot taking a photo in a rustic, full-length mirror, phone partially visible." },
            { name: "Working Hands", description: "A top-down point-of-view of hands typing on a laptop, with the sleeves and torso of the outfit clearly in frame." },
        ];
    }
    
    try {
        const textPrompt = `You are a creative director for a trendy social media fashion brand. Your task is to generate 4 unique, creative, and distinct point-of-view (POV) photo concepts. These shots should feel authentic and be suitable for platforms like Instagram.

For each concept, provide a short, catchy 'name' and a detailed 'description'. The description should be written as an instruction for an AI image generator, clearly explaining the pose, action, and environment from a first-person perspective.

Return ONLY a JSON array of 4 objects.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: textPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING, description: "A short, catchy name for the POV concept." },
                            description: { type: Type.STRING, description: "A detailed prompt-style description of the POV shot." }
                        },
                        required: ["name", "description"]
                    }
                }
            }
        });
        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as { name: string; description: string }[];
        if (parsed.length !== 4) {
            throw new Error("AI did not return exactly 4 POV shot concepts.");
        }
        return parsed;

    } catch(error) {
        console.error("Error generating dynamic POV shots:", error);
        throw error; // Let the caller handle fallback
    }
  },

  generateConceptSuggestions: async (imageB64: string): Promise<PhotoshootConcept[]> => {
    if (!ai) return mockGenerateConceptSuggestions(imageB64);
    
    try {
        const { mimeType, data } = parseDataUrl(imageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { text: `You are a world-class fashion photographer and art director. Analyze the provided image of a person. 
        
Generate FOUR unique, creative, and distinct photoshoot concepts inspired by the person in the image.

For each concept, provide:
1. 'id': A unique identifier string (e.g., "concept-1").
2. 'name': A short, evocative name for the concept (e.g., "Urban Explorer").
3. 'description': A one-sentence summary of the concept.
4. 'prompt': A detailed, descriptive prompt for an AI image generator to create the final image. This prompt MUST start with "photo of the model from the reference image..." to ensure the person's identity is preserved.

Return ONLY a JSON array of four objects.` };

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            id: { type: Type.STRING },
                            name: { type: Type.STRING },
                            description: { type: Type.STRING },
                            prompt: { type: Type.STRING }
                        },
                        required: ["id", "name", "description", "prompt"]
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        const parsed = JSON.parse(jsonString) as PhotoshootConcept[];
        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("AI did not return valid concepts.");
        }
        return parsed;

    } catch(error) {
        console.error("Error generating photoshoot concepts from Gemini:", error);
        throw error;
    }
  },

  generatePhotoshootImage: async (baseParts: any[], aspectRatio: AspectRatio['value'], numberOfImages: number, negativePrompt: string | undefined, onImageGenerated: (imageB64: string, index: number) => void): Promise<void> => {
    if (!ai) return mockGenerateImage(baseParts, aspectRatio, numberOfImages, negativePrompt, onImageGenerated);

    try {
      for (let i = 0; i < numberOfImages; i++) {
        // Deep copy parts to avoid mutation across loop iterations
        const parts = JSON.parse(JSON.stringify(baseParts));
        const textPart = parts.find((part: any) => 'text' in part);

        if (textPart) {
          let finalRequirements = `\n\n**Final Image Requirements:**`;
          if (negativePrompt && negativePrompt.trim() !== '') {
            finalRequirements += `\n- **AVOID:** Do not include the following elements: ${negativePrompt}.`;
          }
          // Add a unique seed for each image to ensure variety
          finalRequirements += `\n- Generation Seed: ${Math.random()}`;

          if (finalRequirements !== `\n\n**Final Image Requirements:**`) {
            textPart.text += finalRequirements;
          }
        }
        
        try {
            const response = await ai.models.generateContent({
              model: 'gemini-2.5-flash-image',
              contents: { parts },
              config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
                imageConfig: {
                  aspectRatio: aspectRatio,
                },
              },
            });
            
            let imageFound = false;
            if (response.candidates && response.candidates.length > 0) {
                for (const part of response.candidates[0].content.parts) {
                    if (part.inlineData) {
                        const base64ImageBytes: string = part.inlineData.data;
                        const mimeType = part.inlineData.mimeType;
                        const imageB64 = `data:${mimeType};base64,${base64ImageBytes}`;
                        onImageGenerated(imageB64, i);
                        imageFound = true;
                        break;
                    }
                }
            }
            if (!imageFound) {
                console.warn("No image found in a Gemini response for index " + i, response);
                // The UI will show a placeholder for the failed image.
            }
        } catch(error) {
            console.error(`Error generating image at index ${i}:`, error);
            // Continue to the next image even if one fails.
        }
      }
    } catch (error) {
      console.error("Error setting up image generation with Gemini:", error);
      throw error;
    }
  },

  generativeEdit: async (params: { originalImageB64: string, maskImageB64: string, prompt: string, apparelImageB64?: string | null }): Promise<string> => {
    if (!ai) return mockGenerativeEdit(params);

    try {
        const { originalImageB64, maskImageB64, prompt, apparelImageB64 } = params;

        const originalImageParts = parseDataUrl(originalImageB64);
        const maskImageParts = parseDataUrl(maskImageB64);

        const parts = [];

        // Common parts for both scenarios
        const originalImagePart = { inlineData: { mimeType: originalImageParts.mimeType, data: originalImageParts.data } };
        const maskImagePart = { inlineData: { mimeType: maskImageParts.mimeType, data: maskImageParts.data } };
        
        if (apparelImageB64) {
            // SCENARIO 1: Inpainting with Apparel Reference
            const apparelImageParts = parseDataUrl(apparelImageB64);
            const apparelReferencePart = { inlineData: { mimeType: apparelImageParts.mimeType, data: apparelImageParts.data } };

            const textPart = {
                text: `**INPAINTING WITH APPAREL REFERENCE TASK:**
You will receive THREE images and a text instruction.
1. The **SOURCE IMAGE** to be edited.
2. The **APPAREL REFERENCE IMAGE** containing a garment.
3. The **MASK IMAGE**, where the white area indicates the region to be modified.

**CRITICAL MISSION:** Your task is to take the garment from the APPAREL REFERENCE IMAGE and realistically paint it onto the SOURCE IMAGE, but ONLY within the masked area. The garment should fit the model's body naturally, with correct lighting, shadows, and wrinkles. Use the following text instruction for additional guidance: "${prompt}". Do NOT change any part of the image outside the masked area.`
            };
            
            parts.push(textPart, originalImagePart, apparelReferencePart, maskImagePart);

        } else {
            // SCENARIO 2: Standard Inpainting
            const textPart = {
                text: `**INPAINTING/GENERATIVE EDIT TASK:** 
You are given two images and a text instruction. 
The first image is the source image to be edited. 
The second image is a mask, where the white area indicates the region to be modified. 
Your task is to apply the following instruction ONLY within the masked area of the source image, blending the result seamlessly: "${prompt}". 
Do NOT change any part of the image outside the masked area.`
            };

            parts.push(textPart, originalImagePart, maskImagePart);
        }

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType;
                    return `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
        }

        const textFeedback = response?.text?.trim() || "No text feedback received.";
        throw new Error(`Generative edit failed. Feedback: ${textFeedback}`);

    } catch (error) {
        console.error("Error performing generative edit with Gemini:", error);
        throw error;
    }
  },
  
  reverseEngineerPrompt: async (imageB64: string): Promise<string> => {
    if (!ai) return mockReverseEngineerPrompt(imageB64);
    
    try {
        const { mimeType, data } = parseDataUrl(imageB64);
        const imagePart = { inlineData: { mimeType, data } };
        const textPart = { text: "You are an expert prompt engineer for advanced generative AI image models. Analyze the provided image in detail. Your task is to create a descriptive, high-quality prompt that could generate a similar image. Describe the subject, composition, style (e.g., photography, illustration, 3D render), lighting, camera angle, lens, and any other relevant artistic details. The output must be ONLY the prompt text, without any preamble or explanation." };
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: { parts: [imagePart, textPart] },
        });
        
        return response.text.trim();
    } catch (error) {
        console.error("Error reverse engineering prompt:", error);
        throw error;
    }
  },

  // FIX: Add missing video generation functions to resolve errors in sharedStore.ts
  generatePhotoshootVideo: async (prompt: string, aspectRatio: AspectRatio['value'], imageB64: string): Promise<any> => {
      if (!ai) return mockGenerateVideo();
      try {
          const { mimeType, data } = parseDataUrl(imageB64);
          
          let operation = await ai.models.generateVideos({
              model: 'veo-3.1-fast-generate-preview',
              prompt: prompt,
              image: {
                  imageBytes: data,
                  mimeType: mimeType,
              },
              config: {
                  numberOfVideos: 1,
                  resolution: '720p',
                  aspectRatio: aspectRatio as '16:9' | '9:16',
              }
          });
          return operation;
      } catch (error) {
          console.error("Error generating video:", error);
          throw error;
      }
  },

  getVideoOperationStatus: async (operation: any): Promise<any> => {
      if (!ai) return mockGetVideoOperationStatus(operation);
      try {
          return await ai.operations.getVideosOperation({ operation: operation });
      } catch (error) {
          console.error("Error getting video operation status:", error);
          throw error;
      }
  },

  fetchVideoAsBlobUrl: async (downloadLink: string): Promise<string> => {
      if (!API_KEY) return mockFetchVideoAsBlobUrl(downloadLink);
      try {
          const response = await fetch(`${downloadLink}&key=${API_KEY}`);
          if (!response.ok) {
              throw new Error(`Failed to fetch video: ${response.statusText}`);
          }
          const blob = await response.blob();
          return URL.createObjectURL(blob);
      } catch (error) {
          console.error("Error fetching video blob:", error);
          throw error;
      }
  },
  
  parseDataUrl, // Export for use in other services
};
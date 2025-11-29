import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY environment variable not set. Using mock service.");
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

// Mock function for development
const mockGenerateWithImagen = async (prompt: string, aspectRatio: string): Promise<string> => {
    console.log("--- MOCK API CALL: generateWithImagen ---");
    await new Promise(resolve => setTimeout(resolve, 2000));
    let width = 1024;
    let height = 1365;
    if (aspectRatio === '1:1') { width = 1024; height = 1024; }
    if (aspectRatio === '4:5') { width = 1024; height = 1280; }
    if (aspectRatio === '16:9') { width = 1280; height = 720; }
    if (aspectRatio === '9:16') { width = 720; height = 1280; }
    if (aspectRatio === '3:4') { width = 768; height = 1024; }
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

const mockGenerateStyledImage = async (prompt: string, images: string[]): Promise<string> => {
    console.log("--- MOCK API CALL: generateStyledImage ---");
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
};

const mockGenerateConceptSuggestions = async (imageB64: string): Promise<Array<{ id: string; name: string; description: string; prompt: string }>> => {
    console.log("--- MOCK API CALL: generateConceptSuggestions ---");
    await new Promise(resolve => setTimeout(resolve, 1500));
    return [
        { id: 'concept-1', name: 'Urban Explorer', description: 'Model in a dynamic walking pose on a city street.', prompt: 'photo of the model from the reference image, dynamic walking pose on a busy city street, candid style, full body shot' },
        { id: 'concept-2', name: 'Minimalist Studio', description: 'Clean, high-fashion shot against a solid grey background.', prompt: 'photo of the model from the reference image, full body shot, standing against a solid light grey studio background, soft studio lighting' },
        { id: 'concept-3', name: 'Golden Hour Portrait', description: 'Warm, backlit portrait in a natural, outdoor setting.', prompt: 'photo of the model from the reference image, waist-up portrait, backlit by golden hour sun in a field of tall grass, dreamy look' },
        { id: 'concept-4', name: 'Moody Black & White', description: 'Dramatic, high-contrast black and white shot with strong shadows.', prompt: 'dramatic black and white photo of the model from the reference image, high-contrast lighting, intense expression, film grain' },
    ];
};

export const geminiService = {
  generateWithImagen: async (prompt: string, aspectRatio: string): Promise<string> => {
      if (!ai) return mockGenerateWithImagen(prompt, aspectRatio);
      try {
          const response = await ai.models.generateImages({
              model: 'imagen-4.0-generate-001',
              prompt: prompt,
              config: {
                  numberOfImages: 1,
                  outputMimeType: 'image/png',
                  aspectRatio: aspectRatio as any,
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
    if (!ai) return mockGenerateStyledImage(prompt, images);
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

  generateConceptSuggestions: async (imageB64: string): Promise<Array<{ id: string; name: string; description: string; prompt: string }>> => {
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
        const parsed = JSON.parse(jsonString) as Array<{ id: string; name: string; description: string; prompt: string }>;
        if (!Array.isArray(parsed) || parsed.length === 0) {
            throw new Error("AI did not return valid concepts.");
        }
        return parsed;
    } catch(error) {
        console.error("Error generating photoshoot concepts from Gemini:", error);
        throw error;
    }
  },

  parseDataUrl, // Export for use in other services
};


import { GoogleGenAI, Type, Modality } from "@google/genai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

if (!API_KEY) {
  console.warn("GEMINI_API_KEY or API_KEY environment variable not set. Using mock service.");
  console.warn("Please set NEXT_PUBLIC_GEMINI_API_KEY, GEMINI_API_KEY, or API_KEY in your .env file");
} else {
  console.log("Gemini API key found, using real API");
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

const mockGenerateStyledImage = async (prompt: string, images: string[], aspectRatio: string = '4:5'): Promise<string> => {
    console.log("--- MOCK API CALL: generateStyledImage ---");
    console.log("Aspect Ratio:", aspectRatio);
    await new Promise(resolve => setTimeout(resolve, 1500));
    let width = 1024;
    let height = 1280; // default 4:5
    if (aspectRatio === '1:1') { width = 1024; height = 1024; }
    if (aspectRatio === '4:5') { width = 1024; height = 1280; }
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
              const image = response.generatedImages[0].image;
              if (!image || !image.imageBytes) {
                  throw new Error("Imagen generation failed to return image bytes.");
              }
              return `data:image/png;base64,${image.imageBytes}`;
          }
          throw new Error("Imagen generation failed to return an image.");
      } catch (error) {
          console.error("Error generating with Imagen:", error);
          throw error;
      }
  },

  generateStyledImage: async (prompt: string, images: string[], aspectRatio: string = '4:5'): Promise<string> => {
    if (!ai) {
      console.warn("AI client not initialized, using mock service");
      return mockGenerateStyledImage(prompt, images, aspectRatio);
    }
    
    try {
        console.log("Calling Gemini API with model: gemini-2.5-flash-image");
        console.log("Aspect ratio:", aspectRatio);
        console.log("Number of input images:", images.length);
        
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
                    aspectRatio: aspectRatio as '1:1' | '4:5' | '16:9' | '9:16'
                }
            },
        });

        // Log response structure for debugging
        console.log("API Response received. Structure:", {
            hasCandidates: !!response.candidates,
            candidatesLength: response.candidates?.length,
            responseKeys: Object.keys(response),
            firstCandidateKeys: response.candidates?.[0] ? Object.keys(response.candidates[0]) : null
        });

        // Check for safety ratings or blocked content
        if (response.candidates && response.candidates.length > 0) {
            const candidate = response.candidates[0];
            
            // Check for finish reason (safety blocking)
            if (candidate.finishReason && candidate.finishReason !== 'STOP') {
                const reason = candidate.finishReason;
                const safetyRatings = candidate.safetyRatings || [];
                console.error("Generation blocked. Finish reason:", reason);
                console.error("Safety ratings:", safetyRatings);
                throw new Error(`Image generation was blocked. Reason: ${reason}. This may be due to content safety filters.`);
            }
            
            // Get content - try different possible structures
            const content = candidate.content;
            
            if (!content) {
                console.error("Response structure:", {
                    candidateKeys: Object.keys(candidate),
                    finishReason: candidate.finishReason,
                    safetyRatings: candidate.safetyRatings
                });
                throw new Error("Response content is missing. The API may have blocked the request.");
            }
            
            if (!content.parts || !Array.isArray(content.parts) || content.parts.length === 0) {
                console.error("Response structure:", {
                    hasContent: !!content,
                    contentKeys: content ? Object.keys(content) : [],
                    hasParts: !!content?.parts,
                    partsType: typeof content?.parts,
                    partsLength: content?.parts?.length
                });
                throw new Error("Response parts are missing or empty.");
            }
            
            // Look for image in parts
            for (const part of content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const base64ImageBytes: string = part.inlineData.data;
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    if (!base64ImageBytes) {
                        continue; // Try next part
                    }
                    console.log("Successfully generated image from Gemini API");
                    return `data:${mimeType};base64,${base64ImageBytes}`;
                }
            }
            
            // If we get here, no image was found in parts
            console.error("No image found in response parts. Parts structure:", content.parts.map(p => ({
                hasInlineData: !!p.inlineData,
                hasText: !!p.text,
                keys: Object.keys(p)
            })));
            throw new Error("No image data found in API response parts.");
        }
        
        // No candidates in response
        console.error("No candidates in response. Full response:", JSON.stringify(response, null, 2));
        throw new Error("API response contains no candidates. The request may have been rejected.");
    } catch (error) {
        console.error("Error generating styled image with Gemini:", error);
        console.error("Error details:", error instanceof Error ? error.message : String(error));
        // Don't fall back to mock, throw the error so user knows it failed
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

        if (!response.text) {
            throw new Error("Response text is missing.");
        }
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


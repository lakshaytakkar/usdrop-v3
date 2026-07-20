import { GoogleGenAI, Modality } from "@google/genai";

/* Real Gemini-backed AI for usdrop (powers the Dropship Copilot + AI tools).
   Replaces the empty-key client mock. Key from env (same vars as product
   research). If unset, callers get a clear "not configured" error. */

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.VITE_GEMINI_API_KEY ||
  process.env.API_KEY;

const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;
const MODEL = "gemini-2.0-flash";

export const aiEnabled = !!genAI;

export async function generateText(prompt: string, system?: string): Promise<string> {
  if (!genAI) throw new Error("AI_NOT_CONFIGURED");
  const result = await genAI.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: system ? { systemInstruction: system } : {},
  });
  return (result.text || "").trim();
}

/* Image generation (banners, creatives). Returns a base64 data URL.
   Uses the Gemini image model (strong at rendering legible in-image text). */
const IMAGE_MODEL = "gemini-2.5-flash-image";

export async function generateImage(prompt: string): Promise<string> {
  if (!genAI) throw new Error("AI_NOT_CONFIGURED");
  const response = await genAI.models.generateContent({
    model: IMAGE_MODEL,
    contents: prompt,
    config: { responseModalities: [Modality.IMAGE, Modality.TEXT] },
  });
  const parts = response.candidates?.[0]?.content?.parts || [];
  for (const p of parts) {
    const inline = (p as any).inlineData;
    if (inline?.data) {
      const mime = inline.mimeType || "image/png";
      return `data:${mime};base64,${inline.data}`;
    }
  }
  throw new Error("NO_IMAGE");
}

/* Structured JSON generation (brand kits, etc.). */
export async function generateJSON(prompt: string): Promise<any> {
  if (!genAI) throw new Error("AI_NOT_CONFIGURED");
  const result = await genAI.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    config: { responseMimeType: "application/json" },
  });
  const t = (result.text || "").replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  return JSON.parse(t);
}

export interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export async function chat(messages: ChatMessage[], system: string): Promise<string> {
  if (!genAI) throw new Error("AI_NOT_CONFIGURED");
  const contents = messages
    .filter((m) => m.text && m.text.trim())
    .slice(-12) // keep the last few turns
    .map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.text }] }));
  const result = await genAI.models.generateContent({
    model: MODEL,
    contents,
    config: { systemInstruction: system },
  });
  return (result.text || "").trim();
}

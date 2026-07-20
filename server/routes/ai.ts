import { Express, Request, Response } from 'express';
import { requireAuth } from '../lib/auth';
import { aiEnabled, generateText, generateImage, generateJSON, chat, ChatMessage } from '../lib/ai-service';

/* Shopify banner presets — exact dimensions + a size description for the image prompt. */
const BANNER_PRESETS: Record<string, { label: string; w: number; h: number; desc: string }> = {
  hero_desktop: { label: "Desktop hero", w: 1920, h: 640, desc: "ultra-wide desktop hero banner (aspect ratio 3:1, landscape)" },
  hero_mobile: { label: "Mobile hero", w: 1080, h: 1350, desc: "mobile hero banner (aspect ratio 4:5, portrait)" },
  collection: { label: "Collection banner", w: 1200, h: 400, desc: "collection header banner (aspect ratio 3:1, landscape)" },
  announcement: { label: "Announcement bar", w: 1200, h: 120, desc: "thin announcement bar strip (very wide and short, aspect ratio 10:1)" },
  about_us: { label: "About-us image", w: 1200, h: 800, desc: "about-us brand lifestyle image (aspect ratio 3:2, landscape)" },
};

/* Phase B — AI Studio. Real Gemini-backed endpoints for the Dropship Copilot
   and the AI tool library (replaces the client-side mock). */

const COPILOT_SYSTEM = `You are the USDrop Dropship Copilot — an expert USA dropshipping mentor built into the USDrop platform.
Help users with product research, Shopify store setup, Meta/TikTok ads, pricing & margins, order fulfillment, and forming a US LLC.
USDrop offers, in one platform: free learning, 1:1 mentorship, AI-validated winning products, a done-for-you Shopify store ("Build Your Store"), US LLC formation, China-warehouse fulfillment, and an AI Studio. When relevant, point users to the right part of the platform.
Be concise, practical and actionable — short paragraphs or tight bullet lists. Avoid fluff. Never invent fake numbers; if unsure, say so.`;

/* Tool prompt builders. Each takes a free-form input object and returns a prompt. */
const TOOLS: Record<string, { system: string; build: (i: any) => string }> = {
  product_description: {
    system: "You are an expert e-commerce copywriter. Write high-converting, benefit-led Shopify product descriptions.",
    build: (i) => `Write a high-converting product description for a Shopify dropshipping store.
Product: ${i.product || i.title || "(unnamed)"}
${i.audience ? `Target audience: ${i.audience}` : ""}
${i.tone ? `Tone: ${i.tone}` : ""}
${i.features ? `Key features/benefits: ${i.features}` : ""}
Include: a punchy hook, 3-5 benefit bullets, and a short call to action. Keep it scannable. Output clean text (no markdown headers).`,
  },
  ad_copy: {
    system: "You are a performance marketer writing scroll-stopping paid social ad copy.",
    build: (i) => `Write 3 Facebook/TikTok ad variations for this dropshipping product.
Product: ${i.product || i.title}
${i.angle ? `Angle: ${i.angle}` : ""}
${i.audience ? `Audience: ${i.audience}` : ""}
Each variation: a hook line, 2-3 lines of body, and a CTA. Label them Variation 1/2/3.`,
  },
  email: {
    system: "You write friendly, effective e-commerce marketing emails.",
    build: (i) => `Write a marketing email for a dropshipping store.
Purpose: ${i.purpose || i.type || "promotion"}
${i.product ? `Product: ${i.product}` : ""}
${i.tone ? `Tone: ${i.tone}` : ""}
Include a subject line and the email body.`,
  },
  store_policy: {
    system: "You are a careful e-commerce operator drafting clear store policies.",
    build: (i) => `Write a clear, professional ${i.policy || i.type || "Shipping"} policy for a US dropshipping Shopify store.
${i.store ? `Store name: ${i.store}` : ""}
${i.details ? `Details: ${i.details}` : ""}
Keep it customer-friendly and realistic for dropshipping (shipping times, returns window, contact). Plain text.`,
  },
  seo: {
    system: "You are an e-commerce SEO specialist.",
    build: (i) => `Generate SEO for this product page.
Product: ${i.product || i.title}
Return: 1 SEO title (<=60 chars), 1 meta description (<=155 chars), and 8 keywords.`,
  },
};

export function registerAIRoutes(app: Express) {
  app.get('/api/ai/status', (_req: Request, res: Response) => {
    res.json({ enabled: aiEnabled });
  });

  // Tool generation (description, ad copy, email, policy, seo…).
  app.post('/api/ai/generate', requireAuth, async (req: Request, res: Response) => {
    try {
      const { tool, input } = req.body || {};
      const def = TOOLS[tool];
      if (!def) return res.status(400).json({ error: 'Unknown tool' });
      if (!aiEnabled) return res.status(503).json({ error: 'AI is not configured yet. Add a GEMINI_API_KEY.' });
      const text = await generateText(def.build(input || {}), def.system);
      return res.json({ text });
    } catch (err: any) {
      if (err?.message === 'AI_NOT_CONFIGURED') return res.status(503).json({ error: 'AI is not configured yet.' });
      console.error('AI generate error:', err);
      return res.status(500).json({ error: 'Generation failed. Please try again.' });
    }
  });

  // Banner generator — full AI image with baked-in text (Gemini image model).
  app.post('/api/ai/banner', requireAuth, async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      const preset = BANNER_PRESETS[b.preset];
      if (!preset) return res.status(400).json({ error: 'Unknown banner size' });
      if (!b.product && !b.headline) return res.status(400).json({ error: 'Add a product/niche or a headline.' });
      if (!aiEnabled) return res.status(503).json({ error: 'AI is not configured yet. Add a GEMINI_API_KEY.' });

      const prompt = [
        `Create a professional, high-converting ${preset.desc} for a Shopify e-commerce store.`,
        b.product ? `Niche / product: ${b.product}.` : "",
        b.headline ? `Render this MAIN HEADLINE text large and bold, spelled exactly: "${b.headline}".` : "",
        b.subheadline ? `Render this subheadline text, spelled exactly: "${b.subheadline}".` : "",
        b.cta ? `Include a clear call-to-action button with the exact text: "${b.cta}".` : "",
        b.promo ? `Include a small promo badge with the exact text: "${b.promo}".` : "",
        `Visual style: ${b.style || "clean, modern, premium e-commerce"}.`,
        b.colors ? `Use these brand colors: ${b.colors}.` : "",
        `Requirements: every piece of text must be spelled correctly, crisp and highly legible with strong contrast; balanced professional composition with a clear focal point and room for the text; realistic, appealing product or lifestyle imagery relevant to the niche; looks like a real premium storefront banner. Absolutely no gibberish text, no lorem ipsum, no watermarks, no logos of other brands.`,
      ].filter(Boolean).join(" ");

      const image = await generateImage(prompt);
      return res.json({ image, width: preset.w, height: preset.h, label: preset.label });
    } catch (err: any) {
      if (err?.message === 'AI_NOT_CONFIGURED') return res.status(503).json({ error: 'AI is not configured yet.' });
      if (err?.message === 'NO_IMAGE') return res.status(502).json({ error: 'The model did not return an image. Try again or tweak your prompt.' });
      console.error('AI banner error:', err);
      return res.status(500).json({ error: 'Banner generation failed. Please try again.' });
    }
  });

  // Logo generator (Gemini image model).
  app.post('/api/ai/logo', requireAuth, async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      if (!b.name) return res.status(400).json({ error: 'Enter a brand name.' });
      if (!aiEnabled) return res.status(503).json({ error: 'AI is not configured yet.' });
      const prompt = [
        `Design a clean, modern, professional brand logo for a store named "${b.name}".`,
        b.niche ? `Industry / niche: ${b.niche}.` : "",
        `Style: ${b.style || "minimal and premium"}.`,
        b.colors ? `Preferred colors: ${b.colors}.` : "",
        `Requirements: a memorable vector-style logo (icon + the brand name "${b.name}" spelled exactly and legibly), simple and balanced, centered on a plain solid white background, high contrast, no photorealism, no clutter, no extra text, no watermark. Suitable to use as a real e-commerce brand logo.`,
      ].filter(Boolean).join(" ");
      const image = await generateImage(prompt);
      return res.json({ image });
    } catch (err: any) {
      if (err?.message === 'AI_NOT_CONFIGURED') return res.status(503).json({ error: 'AI is not configured yet.' });
      if (err?.message === 'NO_IMAGE') return res.status(502).json({ error: 'No logo returned — try again.' });
      console.error('AI logo error:', err);
      return res.status(500).json({ error: 'Logo generation failed. Please try again.' });
    }
  });

  // Brand kit (palette, fonts, taglines, voice) — structured JSON.
  app.post('/api/ai/brand-kit', requireAuth, async (req: Request, res: Response) => {
    try {
      const b = req.body || {};
      if (!b.name) return res.status(400).json({ error: 'Enter a brand name.' });
      if (!aiEnabled) return res.status(503).json({ error: 'AI is not configured yet.' });
      const prompt = `You are a brand designer. Create a cohesive brand kit for an e-commerce store named "${b.name}" in the ${b.niche || 'general'} niche with a ${b.vibe || b.style || 'modern, premium'} vibe.
Return ONLY valid JSON in exactly this shape:
{
  "palette": [
    {"name":"Primary","hex":"#RRGGBB"},
    {"name":"Accent","hex":"#RRGGBB"},
    {"name":"Dark","hex":"#RRGGBB"},
    {"name":"Light","hex":"#RRGGBB"},
    {"name":"Neutral","hex":"#RRGGBB"}
  ],
  "fonts": {"heading":"<a real Google Font>","body":"<a real Google Font>"},
  "taglines": ["<short punchy tagline>", "<second>", "<third>"],
  "voice": "<two sentences describing the brand voice and tone>"
}
Make the palette harmonious and on-vibe. Hex values must be valid 6-digit hex.`;
      const kit = await generateJSON(prompt);
      return res.json({ kit });
    } catch (err: any) {
      if (err?.message === 'AI_NOT_CONFIGURED') return res.status(503).json({ error: 'AI is not configured yet.' });
      console.error('AI brand-kit error:', err);
      return res.status(500).json({ error: 'Brand kit generation failed. Please try again.' });
    }
  });

  // Dropship Copilot chat.
  app.post('/api/ai/chat', requireAuth, async (req: Request, res: Response) => {
    try {
      const messages: ChatMessage[] = Array.isArray(req.body?.messages) ? req.body.messages : [];
      if (messages.length === 0) return res.status(400).json({ error: 'No messages' });
      if (!aiEnabled) return res.status(503).json({ error: 'AI is not configured yet. Add a GEMINI_API_KEY.' });
      const reply = await chat(messages, COPILOT_SYSTEM);
      return res.json({ reply });
    } catch (err: any) {
      if (err?.message === 'AI_NOT_CONFIGURED') return res.status(503).json({ error: 'AI is not configured yet.' });
      console.error('AI chat error:', err);
      return res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  });
}

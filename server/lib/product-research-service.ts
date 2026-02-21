import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY =
  process.env.VITE_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  process.env.API_KEY;

if (!GEMINI_API_KEY) {
  console.warn("GEMINI_API_KEY or API_KEY not set. Product research will use mock data.");
}

const genAI = GEMINI_API_KEY ? new GoogleGenAI({ apiKey: GEMINI_API_KEY }) : null;

interface ResearchInput {
  title: string;
  description: string | null;
  buyPrice: number;
  sellPrice: number;
  category?: string;
}

const mockResearchProduct = async (input: ResearchInput): Promise<any> => {
  console.log("--- MOCK API CALL: researchProduct ---");
  await new Promise(resolve => setTimeout(resolve, 1500));

  const competitors = [
    { name: "Competitor A", price: input.sellPrice * 0.9, url: "https://example.com" },
    { name: "Competitor B", price: input.sellPrice * 1.1, url: "https://example.com" },
    { name: "Competitor C", price: input.sellPrice * 0.95, url: "https://example.com" },
  ];

  const prices = competitors.map(c => c.price);
  const minPrice = Math.min(...prices, input.sellPrice * 0.85);
  const maxPrice = Math.max(...prices, input.sellPrice * 1.15);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  return {
    competitor_pricing: {
      competitors,
      price_range: {
        min: Math.round(minPrice * 100) / 100,
        max: Math.round(maxPrice * 100) / 100,
        avg: Math.round(avgPrice * 100) / 100,
      }
    },
    seasonal_demand: `This product shows strong demand during ${["Q4 holiday season", "summer months", "spring", "back-to-school season"][Math.floor(Math.random() * 4)]}. Market analysis indicates ${["growing", "stable", "seasonal"][Math.floor(Math.random() * 3)]} interest patterns with peak periods aligning with ${["major shopping events", "seasonal trends", "cultural celebrations"][Math.floor(Math.random() * 3)]}.`,
    audience_targeting: {
      demographics: {
        age: ["18-24", "25-34", "35-44", "45-54"][Math.floor(Math.random() * 4)],
        gender: ["Unisex", "Male", "Female"][Math.floor(Math.random() * 3)]
      },
      interests: [
        "Home & Garden",
        "Lifestyle",
        "Technology",
        "Fashion",
        "Health & Wellness"
      ].slice(0, 3 + Math.floor(Math.random() * 2)),
      suggestions: [
        "Target audiences interested in practical solutions",
        "Focus on value-conscious consumers",
        "Consider lifestyle and hobby enthusiasts"
      ]
    },
    supplier_notes: `Recommended suppliers include AliExpress and Amazon. Shipping typically takes 7-14 days. Consider bulk ordering for better margins. Quality control recommended before large orders.`,
    social_proof: {
      likes: Math.floor(Math.random() * 5000) + 100,
      comments: Math.floor(Math.random() * 500) + 10,
      shares: Math.floor(Math.random() * 200) + 5,
      virality_score: Math.round((Math.random() * 0.4 + 0.3) * 100) / 100
    }
  };
};

export const productResearchService = {
  researchProduct: async (input: ResearchInput): Promise<any> => {
    if (!genAI) {
      return mockResearchProduct(input);
    }

    try {
      const prompt = `You are a product research analyst specializing in e-commerce and dropshipping. Analyze the following product and provide comprehensive market research in JSON format.

Product Information:
- Title: ${input.title}
- Description: ${input.description || "No description provided"}
- Buy Price: $${input.buyPrice}
- Sell Price: $${input.sellPrice}
- Category: ${input.category || "Uncategorized"}

Provide a detailed analysis in the following JSON structure:
{
  "competitor_pricing": {
    "competitors": [
      {"name": "Competitor Name", "price": 29.99, "url": "optional-url"}
    ],
    "price_range": {"min": 19.99, "max": 39.99, "avg": 29.99}
  },
  "seasonal_demand": "A 2-3 sentence summary of seasonal demand patterns and trends for this product",
  "audience_targeting": {
    "demographics": {"age": "25-34", "gender": "Unisex"},
    "interests": ["Interest 1", "Interest 2", "Interest 3"],
    "suggestions": ["Targeting suggestion 1", "Targeting suggestion 2"]
  },
  "supplier_notes": "Notes about suppliers, shipping options, fulfillment, and sourcing recommendations",
  "social_proof": {
    "likes": 1234,
    "comments": 56,
    "shares": 23,
    "virality_score": 0.75
  },
  "category_suggestion": {
    "slug": "category-slug-lowercase-with-dashes",
    "name": "Human Readable Category Name",
    "confidence": 0.0
  }
}

Return ONLY valid JSON, no markdown formatting or additional text.`;

      const result = await genAI.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = result.text;

      if (!text) {
        throw new Error("No content in Gemini API response");
      }

      let parsed: any;
      try {
        const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        parsed = JSON.parse(cleaned);
      } catch (parseError) {
        console.error("Failed to parse JSON response from Gemini:", text);
        throw new Error("Invalid JSON response from Gemini API");
      }

      return {
        competitor_pricing: parsed.competitor_pricing || null,
        seasonal_demand: parsed.seasonal_demand || null,
        audience_targeting: parsed.audience_targeting || null,
        supplier_notes: parsed.supplier_notes || null,
        social_proof: parsed.social_proof || null,
      };
    } catch (error) {
      console.error("Error researching product:", error);
      console.warn("Falling back to mock research data");
      return mockResearchProduct(input);
    }
  },
};

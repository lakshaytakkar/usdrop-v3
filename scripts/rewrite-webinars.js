const { GoogleGenAI } = require("@google/genai");
const fs = require("fs");
const path = require("path");

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC9rKVPyjfStBujsteycUCfoFxhALd88bk";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const mentorAttribution = ": by Mr. Suprans (Dropshipping Expert - 14 years experience as the Mentor in the webinar)";

async function rewriteWebinar(originalTitle, originalDescription) {
  const prompt = `You are a professional content writer specializing in educational webinar content. 

Rewrite the following webinar title and description to be more professional, standard, and engaging while maintaining the core meaning.

Original Title: ${originalTitle.replace(mentorAttribution, "").trim()}
Original Description: ${originalDescription}

Requirements:
1. Title: Make it professional, clear, and standardized. Keep it concise (max 80 characters). Use proper capitalization. Do NOT include the mentor attribution - that will be added separately.
2. Description: Rewrite it professionally with 4-5 key learning checkpoints. Format each checkpoint with a green checkmark emoji (✅) at the start. Make it engaging and value-focused.

Return ONLY a JSON object with this exact structure:
{
  "title": "Professional rewritten title",
  "description": "Professional description with ✅ checkpoints"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: { parts: [{ text: prompt }] },
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) {
      throw new Error("No response text");
    }

    const result = JSON.parse(response.text.trim());
    return {
      title: result.title + mentorAttribution,
      description: result.description,
    };
  } catch (error) {
    console.error(`Error rewriting webinar: ${error.message}`);
    // Return original if API fails
    return {
      title: originalTitle,
      description: originalDescription,
    };
  }
}

async function processWebinars() {
  const webinarsPath = path.join(__dirname, "../src/app/webinars/data/webinars.ts");
  const content = fs.readFileSync(webinarsPath, "utf8");

  // Extract webinars array
  const webinarsMatch = content.match(/export const sampleWebinars: Webinar\[\] = \[([\s\S]*?)\]/);
  if (!webinarsMatch) {
    console.error("Could not find webinars array");
    return;
  }

  // Parse webinars (simplified - we'll need to extract each one)
  const webinars = [];
  const webinarRegex = /\{[\s\S]*?id:\s*"([^"]+)",[\s\S]*?title:\s*`([^`]+)`,[\s\S]*?description:\s*"([^"]+)",[\s\S]*?url:\s*"([^"]+)",[\s\S]*?date:\s*new Date\(([^)]+)\),[\s\S]*?duration:\s*"([^"]+)",[\s\S]*?isUpcoming:\s*([^,}]+),[\s\S]*?\}/g;
  
  let match;
  while ((match = webinarRegex.exec(webinarsMatch[1])) !== null) {
    webinars.push({
      id: match[1],
      title: match[2],
      description: match[3],
      url: match[4],
      date: match[5],
      duration: match[6],
      isUpcoming: match[7].trim(),
    });
  }

  console.log(`Found ${webinars.length} webinars to process`);

  // Process in batches to avoid rate limits
  const batchSize = 5;
  const updatedWebinars = [];

  for (let i = 0; i < webinars.length; i += batchSize) {
    const batch = webinars.slice(i, i + batchSize);
    console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(webinars.length / batchSize)}...`);

    const batchPromises = batch.map(async (webinar) => {
      const rewritten = await rewriteWebinar(webinar.title, webinar.description);
      return {
        ...webinar,
        title: rewritten.title,
        description: rewritten.description,
      };
    });

    const batchResults = await Promise.all(batchPromises);
    updatedWebinars.push(...batchResults);

    // Small delay between batches
    if (i + batchSize < webinars.length) {
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }

  // Rebuild the file content
  let newContent = content.substring(0, content.indexOf("export const sampleWebinars"));
  newContent += "export const sampleWebinars: Webinar[] = [\n";

  updatedWebinars.forEach((webinar, index) => {
    const comment = index === 0 ? "  // Foundation & Onboarding (January 2025)" : "";
    if (comment) newContent += comment + "\n";
    
    newContent += `  {\n`;
    newContent += `    id: "${webinar.id}",\n`;
    newContent += `    title: \`${webinar.title}\`,\n`;
    newContent += `    description: "${webinar.description.replace(/"/g, '\\"')}",\n`;
    newContent += `    url: "${webinar.url}",\n`;
    newContent += `    date: new Date(${webinar.date}),\n`;
    newContent += `    duration: "${webinar.duration}",\n`;
    newContent += `    isUpcoming: ${webinar.isUpcoming},\n`;
    newContent += `  },\n`;
  });

  newContent += "]\n";

  // Write back to file
  fs.writeFileSync(webinarsPath, newContent, "utf8");
  console.log("Webinars file updated successfully!");
}

processWebinars().catch(console.error);



















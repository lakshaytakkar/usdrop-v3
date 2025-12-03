import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_KEY = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || "AIzaSyC9rKVPyjfStBujsteycUCfoFxhALd88bk";
const ai = new GoogleGenAI({ apiKey: API_KEY });

const mentorAttribution = ": by Mr. Suprans (Dropshipping Expert - 14 years experience as the Mentor in the webinar)";

async function rewriteWebinar(originalTitle, originalDescription) {
  const cleanTitle = originalTitle.replace(mentorAttribution, "").trim();
  
  const prompt = `You are a professional content writer specializing in educational webinar content for dropshipping businesses.

Rewrite the following webinar title and description to be more professional, standard, and engaging while maintaining the core meaning.

Original Title: ${cleanTitle}
Original Description: ${originalDescription}

Requirements:
1. Title: Make it professional, clear, and standardized. Keep it concise (max 80 characters). Use proper title case. Do NOT include any mentor attribution - that will be added separately. Make it consistent with professional webinar naming conventions.
2. Description: Rewrite it professionally with 4-5 key learning checkpoints. Format each checkpoint starting with a green checkmark emoji (✅) followed by a space. Make it engaging, value-focused, and professional. Each checkpoint should be a complete sentence.

Example format for description:
"Master the fundamentals of dropshipping with this comprehensive training session. ✅ Learn the complete framework and workflow structure. ✅ Understand essential concepts and best practices. ✅ Discover proven strategies for getting started. ✅ Get expert guidance on implementation."

Return ONLY a JSON object with this exact structure:
{
  "title": "Professional rewritten title without mentor attribution",
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
    console.error(`Error rewriting webinar "${cleanTitle}": ${error.message}`);
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

  // Extract webinars using a more robust regex
  const webinars = [];
  const lines = content.split("\n");
  let currentWebinar = null;
  let inWebinar = false;
  let currentField = null;
  let braceCount = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (line.startsWith("//") && line.includes("2025")) {
      // Section comment - we can use this for organization
      continue;
    }

    if (line.startsWith("{")) {
      inWebinar = true;
      currentWebinar = {};
      braceCount = 1;
      continue;
    }

    if (inWebinar) {
      if (line.includes("{")) braceCount++;
      if (line.includes("}")) braceCount--;

      if (line.match(/id:\s*"([^"]+)"/)) {
        currentWebinar.id = line.match(/id:\s*"([^"]+)"/)[1];
      } else if (line.match(/title:\s*`([^`]+)`/)) {
        currentWebinar.title = line.match(/title:\s*`([^`]+)`/)[1];
      } else if (line.match(/description:\s*"([^"]+)"/)) {
        currentWebinar.description = line.match(/description:\s*"([^"]+)"/)[1];
      } else if (line.match(/url:\s*"([^"]+)"/)) {
        currentWebinar.url = line.match(/url:\s*"([^"]+)"/)[1];
      } else if (line.match(/date:\s*new Date\(([^)]+)\)/)) {
        currentWebinar.date = line.match(/date:\s*new Date\(([^)]+)\)/)[1];
      } else if (line.match(/duration:\s*"([^"]+)"/)) {
        currentWebinar.duration = line.match(/duration:\s*"([^"]+)"/)[1];
      } else if (line.match(/isUpcoming:\s*([^,}]+)/)) {
        currentWebinar.isUpcoming = line.match(/isUpcoming:\s*([^,}]+)/)[1].trim();
      }

      if (braceCount === 0 && currentWebinar.id) {
        webinars.push(currentWebinar);
        inWebinar = false;
        currentWebinar = null;
      }
    }
  }

  console.log(`Found ${webinars.length} webinars to process`);

  // Process in batches to avoid rate limits
  const batchSize = 3;
  const updatedWebinars = [];

  for (let i = 0; i < webinars.length; i += batchSize) {
    const batch = webinars.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(webinars.length / batchSize);
    console.log(`\nProcessing batch ${batchNum}/${totalBatches} (webinars ${i + 1}-${Math.min(i + batchSize, webinars.length)})...`);

    const batchPromises = batch.map(async (webinar, idx) => {
      console.log(`  Rewriting: ${webinar.title.replace(mentorAttribution, "").substring(0, 50)}...`);
      const rewritten = await rewriteWebinar(webinar.title, webinar.description);
      return {
        ...webinar,
        title: rewritten.title,
        description: rewritten.description,
      };
    });

    const batchResults = await Promise.all(batchPromises);
    updatedWebinars.push(...batchResults);

    // Delay between batches to avoid rate limits
    if (i + batchSize < webinars.length) {
      console.log("  Waiting 3 seconds before next batch...");
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }

  // Rebuild the file content
  let newContent = `export interface Webinar {
  id: string
  title: string
  description: string
  url: string
  date: Date
  duration: string
  isUpcoming: boolean
}

const mentorAttribution = ": by Mr. Suprans (Dropshipping Expert - 14 years experience as the Mentor in the webinar)"

export const sampleWebinars: Webinar[] = [
`;

  // Add section comments and webinars
  let currentSection = "";
  updatedWebinars.forEach((webinar, index) => {
    // Determine section based on index ranges
    let section = "";
    if (index < 10) section = "  // Foundation & Onboarding (January 2025)";
    else if (index < 22) section = "\n  // Product Research & Selection (February 2025)";
    else if (index < 34) section = "\n  // Sourcing & Suppliers (March 2025)";
    else if (index < 53) section = "\n  // Meta Ads Series (April 2025)";
    else section = "\n  // Advanced Topics & Recent (May-June 2025)";

    if (section !== currentSection) {
      newContent += section + "\n";
      currentSection = section;
    }

    newContent += `  {\n`;
    newContent += `    id: "${webinar.id}",\n`;
    newContent += `    title: \`${webinar.title}\`,\n`;
    newContent += `    description: "${webinar.description.replace(/"/g, '\\"').replace(/\n/g, " ")}",\n`;
    newContent += `    url: "${webinar.url}",\n`;
    newContent += `    date: new Date(${webinar.date}),\n`;
    newContent += `    duration: "${webinar.duration}",\n`;
    newContent += `    isUpcoming: ${webinar.isUpcoming},\n`;
    newContent += `  },\n`;
  });

  newContent += "]\n";

  // Write back to file
  fs.writeFileSync(webinarsPath, newContent, "utf8");
  console.log("\n✅ Webinars file updated successfully!");
}

processWebinars().catch(console.error);










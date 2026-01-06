import fs from "fs/promises";
import path from "path";
import { geminiService } from "../src/lib/services/gemini-service";

type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16';

type Placeholder = {
  component: string;
  targetFile: string;
  src: string;
  prompt: string;
  aspectRatio: AspectRatio;
};

const ROOT = process.cwd();
const OUTPUT_DIR = path.join(ROOT, "public", "images", "landing", "generated");
const OVERWRITE = process.argv.includes("--overwrite");

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

function stripPromptPrefix(prompt: string) {
  return prompt.trim().replace(/^Prompt:\s*/i, "");
}

async function ensureOutputDir() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
}

function changeExt(filename: string, ext: string) {
  const parsed = path.parse(filename);
  return path.join(parsed.dir, `${parsed.name}${ext.startsWith(".") ? ext : `.${ext}`}`);
}

function buildOutputPath(originalSrc: string, fallbackName: string) {
  const originalName = path.basename(originalSrc);
  const name = originalName ? changeExt(originalName, ".png") : `${fallbackName}.png`;
  return path.join(OUTPUT_DIR, name);
}

function toPublicSrc(absPath: string) {
  const normalized = absPath.split(path.sep).join("/");
  const publicRoot = path.join(ROOT, "public").split(path.sep).join("/");
  const rel = normalized.startsWith(publicRoot)
    ? normalized.slice(publicRoot.length)
    : normalized;
  return rel.startsWith("/") ? rel : `/${rel}`;
}

function extractShowcasePlaceholders(content: string): Placeholder[] {
  const results: Placeholder[] = [];
  const regex = /{\s*[^}]*src:\s*["']([^"']+)["'][^}]*alt:\s*["'](Prompt:[^"']+)["'][^}]*}/g;
  let match: RegExpExecArray | null;
  let index = 0;
  while ((match = regex.exec(content))) {
    const [, src, prompt] = match;
    results.push({
      component: "StudioShowcase",
      targetFile: path.join(ROOT, "src", "app", "(marketing)", "components", "StudioShowcase.tsx"),
      src,
      prompt: stripPromptPrefix(prompt),
      aspectRatio: "1:1",
    });
    index += 1;
  }
  return results;
}

function extractHeroPlaceholders(content: string): Placeholder[] {
  const results: Placeholder[] = [];
  const altMatch = content.match(/alt=["'](Prompt:[^"']+)["']/);
  if (!altMatch) return results;

  let src = "/images/hero/browser-mockup.svg";
  const constMatch = content.match(/const\s+imgBrowserMockup\s*=\s*["']([^"']+)["']/);
  if (constMatch) {
    src = constMatch[1];
  }

  const inlineSrcMatch = content.match(/src=\{?["']?([^"'}\s]+)["']?\}?/);
  if (inlineSrcMatch && inlineSrcMatch[1].startsWith("/")) {
    src = inlineSrcMatch[1];
  }

  results.push({
    component: "Hero",
    targetFile: path.join(ROOT, "src", "app", "(marketing)", "components", "Hero.tsx"),
    src,
    prompt: stripPromptPrefix(altMatch[1]),
    aspectRatio: "16:9",
  });

  return results;
}

async function parsePlaceholders(): Promise<Placeholder[]> {
  const files = [
    path.join(ROOT, "src", "app", "(marketing)", "components", "StudioShowcase.tsx"),
    path.join(ROOT, "src", "app", "(marketing)", "components", "Hero.tsx"),
  ];

  const contents = await Promise.all(files.map((f) => fs.readFile(f, "utf8")));

  const placeholders: Placeholder[] = [];
  placeholders.push(...extractShowcasePlaceholders(contents[0]));
  placeholders.push(...extractHeroPlaceholders(contents[1]));

  return placeholders;
}

async function generateAndSaveImage(prompt: string, aspectRatio: AspectRatio, outputPath: string) {
  const dataUrl = await geminiService.generateImageFromPrompt(prompt, aspectRatio);
  const { data, mimeType } = geminiService.parseDataUrl(dataUrl);
  const buffer = Buffer.from(data, "base64");
  const finalPath = changeExt(outputPath, mimeType.includes("png") ? ".png" : ".png");
  await fs.writeFile(finalPath, buffer);
  return finalPath;
}

async function updateFileSrc(filePath: string, replacements: Array<{ from: string; to: string }>) {
  let content = await fs.readFile(filePath, "utf8");
  for (const { from, to } of replacements) {
    const safeFrom = from.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(safeFrom, "g");
    content = content.replace(regex, to);
  }
  await fs.writeFile(filePath, content, "utf8");
}

async function main() {
  console.log("🔍 Scanning components for image placeholders...");
  await ensureOutputDir();

  const placeholders = await parsePlaceholders();
  if (placeholders.length === 0) {
    console.log("No placeholders found. Exiting.");
    return;
  }

  console.log(`Found ${placeholders.length} placeholders.`);

  const replacementsByFile: Record<string, Array<{ from: string; to: string }>> = {};
  let success = 0;
  let failed = 0;

  for (let i = 0; i < placeholders.length; i++) {
    const ph = placeholders[i];
    const outputPath = buildOutputPath(ph.src, `${ph.component.toLowerCase()}-${i + 1}`);
    const publicSrc = toPublicSrc(outputPath);

    if (!OVERWRITE) {
      try {
        await fs.access(outputPath);
        console.log(`↪️  Skipping (exists): ${publicSrc}`);
        if (!replacementsByFile[ph.targetFile]) replacementsByFile[ph.targetFile] = [];
        replacementsByFile[ph.targetFile].push({ from: ph.src, to: publicSrc });
        continue;
      } catch {
        // file does not exist, continue to generate
      }
    }

    console.log(`🎨 (${i + 1}/${placeholders.length}) Generating image for ${ph.component}: "${ph.prompt}"`);
    try {
      const savedPath = await generateAndSaveImage(ph.prompt, ph.aspectRatio, outputPath);
      const finalPublicSrc = toPublicSrc(savedPath);
      if (!replacementsByFile[ph.targetFile]) replacementsByFile[ph.targetFile] = [];
      replacementsByFile[ph.targetFile].push({ from: ph.src, to: finalPublicSrc });
      success += 1;
    } catch (error) {
      failed += 1;
      console.error(`✗ Failed to generate for ${ph.component}:`, error instanceof Error ? error.message : String(error));
    }

    // Simple rate limiting to be gentle with the API.
    if (i < placeholders.length - 1) {
      await sleep(2000);
    }
  }

  // Apply file updates
  for (const [file, replacements] of Object.entries(replacementsByFile)) {
    await updateFileSrc(file, replacements);
    console.log(`✏️  Updated ${path.relative(ROOT, file)} with ${replacements.length} replacement(s).`);
  }

  console.log(`\n✅ Done. Generated: ${success}, Failed: ${failed}. Output: ${OUTPUT_DIR}`);
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});



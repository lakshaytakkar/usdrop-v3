/**
 * Script to generate USDrop AI Logo as PNG (without "Platform" text)
 * Run with: node scripts/generate-logo-png.mjs
 * 
 * Requires: puppeteer (install with: npm install --save-dev puppeteer)
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Try to import puppeteer, fallback to manual instructions if not available
let puppeteer;
try {
  puppeteer = await import('puppeteer');
} catch (e) {
  console.log('Puppeteer not found. Creating HTML file instead...');
  console.log('To generate PNG automatically, install puppeteer: npm install --save-dev puppeteer\n');
}

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USDrop AI Logo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: transparent;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            padding: 40px;
        }
        .logo-container {
            display: flex;
            align-items: baseline;
            gap: 4px;
        }
        .logo-usdrop {
            font-size: 48px;
            font-weight: 700;
            letter-spacing: -0.5px;
            color: #000000;
            line-height: 1;
        }
        .logo-ai {
            font-size: 48px;
            font-weight: 700;
            color: #2563eb;
            line-height: 1;
        }
    </style>
</head>
<body>
    <div class="logo-container">
        <span class="logo-usdrop">USDrop</span>
        <span class="logo-ai">AI</span>
    </div>
</body>
</html>`;

const outputDir = join(process.cwd(), 'public');
mkdirSync(outputDir, { recursive: true });

if (puppeteer) {
  // Use Puppeteer to generate PNG
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.default.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Wait for fonts to load
    await page.waitForTimeout(500);
    
    // Get the logo element
    const logoElement = await page.$('.logo-container');
    if (!logoElement) {
      throw new Error('Logo element not found');
    }
    
    // Take screenshot of the logo element
    const screenshot = await logoElement.screenshot({
      type: 'png',
      omitBackground: true, // Transparent background
    });
    
    const outputPath = join(outputDir, 'usdrop-ai-logo.png');
    writeFileSync(outputPath, screenshot);
    
    console.log(`✓ Logo PNG generated successfully!`);
    console.log(`  Saved to: ${outputPath}`);
    
    await browser.close();
  } catch (error) {
    console.error('Error generating PNG with Puppeteer:', error.message);
    console.log('\nFalling back to HTML file method...\n');
    // Fall through to HTML file creation
    const htmlPath = join(process.cwd(), 'usdrop-logo-temp.html');
    writeFileSync(htmlPath, htmlContent);
    console.log('HTML file created at:', htmlPath);
    console.log('Open it in a browser and take a screenshot of the logo.');
  }
} else {
  // Create HTML file for manual conversion
  const htmlPath = join(process.cwd(), 'usdrop-logo-temp.html');
  writeFileSync(htmlPath, htmlContent);
  
  console.log('HTML file created at:', htmlPath);
  console.log('\nTo convert to PNG:');
  console.log('1. Open the HTML file in a browser');
  console.log('2. Right-click on the logo and "Inspect Element"');
  console.log('3. In DevTools, right-click the .logo-container element');
  console.log('4. Select "Capture node screenshot"');
  console.log('5. Save the image as usdrop-ai-logo.png');
  console.log('\nOr install puppeteer for automatic generation:');
  console.log('  npm install --save-dev puppeteer');
  console.log('  node scripts/generate-logo-png.mjs');
}


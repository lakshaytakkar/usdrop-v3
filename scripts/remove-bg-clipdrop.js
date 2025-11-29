const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

// Use native fetch in Node.js 18+ or node-fetch
let fetch;
try {
  fetch = globalThis.fetch;
} catch {
  fetch = require('node-fetch');
}

async function removeBackground(imagePath, outputPath, apiKey) {
  const form = new FormData();
  form.append('image_file', fs.createReadStream(imagePath));

  try {
    const response = await fetch('https://clipdrop-api.co/remove-background/v1', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!response.ok) {
      const errorText = await response.text();
      let error;
      try {
        error = JSON.parse(errorText);
      } catch {
        error = { error: errorText };
      }
      throw new Error(`Clipdrop API error: ${JSON.stringify(error)}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(outputPath, buffer);
    console.log(`✅ Background removed! Saved to: ${outputPath}`);
    console.log(`📊 Credits remaining: ${response.headers.get('x-remaining-credits')}`);
    console.log(`💰 Credits consumed: ${response.headers.get('x-credits-consumed')}`);
  } catch (error) {
    console.error('❌ Error removing background:', error.message);
    throw error;
  }
}

// Usage
const imagePath = path.join(__dirname, '../public/image-studio-mascot-no-bg.png');
const outputPath = path.join(__dirname, '../public/image-studio-mascot-no-bg.png');
const apiKey = process.env.CLIPDROP_API_KEY;

if (!apiKey) {
  console.error('❌ CLIPDROP_API_KEY environment variable is required');
  console.log('💡 Set it with: $env:CLIPDROP_API_KEY="your_key_here" (PowerShell)');
  console.log('💡 Or: export CLIPDROP_API_KEY=your_key_here (Bash)');
  process.exit(1);
}

removeBackground(imagePath, outputPath, apiKey)
  .then(() => console.log('✨ Done!'))
  .catch((error) => {
    console.error('Failed:', error);
    process.exit(1);
  });


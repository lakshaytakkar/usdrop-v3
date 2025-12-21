const https = require('https');
const fs = require('fs');
const path = require('path');

const assets = {
  'image-overlay.png': 'https://www.figma.com/api/mcp/asset/a1f28c00-eb49-4684-8084-7da35f880f66',
  'ellipse-11806.svg': 'https://www.figma.com/api/mcp/asset/30b361d7-51d9-4353-98b0-d21c210e9992',
  'ellipse-11807.svg': 'https://www.figma.com/api/mcp/asset/d1d1ebbf-0c4f-4fef-874e-4239c62ab4cf',
  'ellipse-11809.svg': 'https://www.figma.com/api/mcp/asset/fa576ec2-1a8b-4570-b5b0-85d1db61162d',
  'discount.svg': 'https://www.figma.com/api/mcp/asset/aedfea8e-2353-4915-b0e2-5d82606117c8',
  'arrow-icon.svg': 'https://www.figma.com/api/mcp/asset/69b25639-b0ef-4265-a0b9-3d0d3b10aeb1'
};

const outputDir = path.join(__dirname, '..', 'public', 'images', 'hero');

// Ensure directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        return downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded: ${path.basename(filepath)}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

async function downloadAll() {
  console.log('Downloading hero background assets from Figma...\n');
  
  for (const [filename, url] of Object.entries(assets)) {
    const filepath = path.join(outputDir, filename);
    try {
      await downloadFile(url, filepath);
    } catch (error) {
      console.error(`✗ Failed to download ${filename}:`, error.message);
    }
  }
  
  console.log('\nDone! Update Hero.tsx to use local paths after downloading.');
}

downloadAll();




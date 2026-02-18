# Landing Page Images

This directory contains static images for the landing page.

## Downloading Images

You have two options to get the images:

### Option 1: Extract from Browser (If images are already loaded)

1. Navigate to the landing page (`/`) and wait for all images to generate and load
2. Open browser console (F12)
3. Copy and paste the entire contents of `scripts/extract-landing-images.js` into the console
4. Press Enter - all images will be downloaded automatically
5. Move the downloaded images to this directory (`public/images/landing/`)

### Option 2: Generate from Prompts (Recommended)

1. Make sure you have `NEXT_PUBLIC_GEMINI_API_KEY` or `GEMINI_API_KEY` set in your environment
2. Run: `npm run generate-landing-images`
3. Wait for all images to generate (this may take several minutes due to rate limiting)
4. Images will be saved to this directory automatically

## After Downloading/Generating

Once you have the images in this directory, you'll need to update the components to use static images instead of `GeneratedImage`. 

The script will generate images with names like:
- `hero-dashboard.png`
- `steps-discovery.png`
- `product-moon-lamp.png`
- etc.

You can then replace `<GeneratedImage prompt="..." />` with:
```tsx
<Image src="/images/landing/hero-dashboard.png" alt="..." />
```

Or use a regular img tag:
```tsx
<img src="/images/landing/hero-dashboard.png" alt="..." />
```


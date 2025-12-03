/**
 * Browser Console Script to Extract Landing Page Images
 * 
 * Instructions:
 * 1. Open your browser's developer console (F12)
 * 2. Navigate to the landing page and wait for all images to load
 * 3. Paste this entire script into the console and run it
 * 4. It will download all images with descriptive names
 */

(function() {
  console.log('Starting image extraction...');
  
  const images = [];
  const imgElements = document.querySelectorAll('img[src^="data:image"]');
  
  console.log(`Found ${imgElements.length} data URL images`);
  
  imgElements.forEach((img, index) => {
    const src = img.src;
    if (src.startsWith('data:image')) {
      // Try to find the prompt from the component
      let prompt = img.alt || `landing-image-${index + 1}`;
      
      // Try to find nearby text or data attributes
      const parent = img.closest('[class*="GeneratedImage"], [class*="generated"]');
      if (parent) {
        const promptAttr = parent.getAttribute('data-prompt') || parent.getAttribute('data-original-prompt');
        if (promptAttr) prompt = promptAttr;
      }
      
      // Generate a safe filename
      const filename = `landing-${prompt.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 50)}-${index + 1}.png`;
      
      images.push({ src, filename, prompt });
    }
  });
  
  console.log(`Extracted ${images.length} images`);
  
  // Download all images
  images.forEach((image, index) => {
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = image.src;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      console.log(`Downloaded: ${image.filename}`);
    }, index * 200); // Stagger downloads
  });
  
  console.log(`\nDownloading ${images.length} images...`);
  console.log('Images will be saved to your Downloads folder.');
  console.log('After downloading, move them to: usdrop-v3/public/images/landing/');
  
  return images;
})();


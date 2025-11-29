
/**
 * Resizes a base64 encoded image to a new scale using a canvas for high-quality downsampling.
 * If the scale is 100% or more, it returns the original image to avoid upscaling.
 * @param {string} base64Str - The base64 encoded image string.
 * @param {number} scale - The target scale percentage (e.g., 50 for 50%).
 * @returns {Promise<string>} A promise that resolves to the new, resized base64 string.
 */
export const resizeImage = (base64Str: string, scale: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If we're not downscaling, return the original to prevent quality loss from upscaling.
    if (scale >= 100) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      const newWidth = Math.floor(img.width * (scale / 100));
      const newHeight = Math.floor(img.height * (scale / 100));

      // Ensure dimensions are at least 1px
      canvas.width = Math.max(1, newWidth);
      canvas.height = Math.max(1, newHeight);

      // Draw the image onto the canvas with the new dimensions.
      // This step performs the high-quality downsampling.
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Export the canvas content back to a base64 string.
      // Use PNG to preserve transparency.
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => {
      reject(new Error(`Image could not be loaded for resizing: ${err}`));
    };
  });
};

/**
 * Resizes a base64 image to a target aspect ratio, cropping as needed.
 * @param {string} base64Str - The base64 image data URL.
 * @param {'1:1' | '4:5' | '16:9'} targetAspectRatio - The desired aspect ratio.
 * @returns {Promise<string>} A promise that resolves with the resized and cropped image data URL.
 */
export const resizeImageToAspectRatio = (base64Str: string, targetAspectRatio: '1:1' | '4:5' | '16:9'): Promise<string> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                return reject(new Error("Could not get canvas context"));
            }

            let targetWidth, targetHeight;
            if (targetAspectRatio === '1:1') {
                targetWidth = 1; targetHeight = 1;
            } else if (targetAspectRatio === '4:5') {
                targetWidth = 4; targetHeight = 5;
            } else { // 16:9
                targetWidth = 16; targetHeight = 9;
            }
            const targetRatio = targetWidth / targetHeight;
            const imgRatio = img.width / img.height;

            let sx, sy, sWidth, sHeight;

            if (imgRatio > targetRatio) {
                // Image is wider than target, crop sides
                sHeight = img.height;
                sWidth = img.height * targetRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else {
                // Image is taller than target, crop top/bottom
                sWidth = img.width;
                sHeight = img.width / targetRatio;
                sx = 0;
                sy = (img.height - sHeight) / 2;
            }
            
            // Set canvas to a reasonable resolution
            const outputResolution = 1024;
            canvas.width = targetAspectRatio === '1:1' ? outputResolution : (targetAspectRatio === '4:5' ? 820 : 1280);
            canvas.height = targetAspectRatio === '1:1' ? outputResolution : (targetAspectRatio === '4:5' ? 1024 : 720);

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = base64Str;
    });
};

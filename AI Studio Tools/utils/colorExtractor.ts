// Helper function to convert RGB to Hex
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => ('0' + c.toString(16)).slice(-2);
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Extracts the dominant (average) color from a base64 encoded image.
 * It does this by drawing the image onto a tiny 1x1 canvas and sampling the resulting pixel color.
 * @param {string} base64Image - The base64 encoded image string (e.g., from a FileReader).
 * @returns {Promise<string>} A promise that resolves to the hex color string (e.g., "#RRGGBB").
 */
export const getDominantColor = (base64Image: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Image;
    img.crossOrigin = "Anonymous";

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) {
        return reject(new Error('Could not get canvas context'));
      }

      // Set canvas to a single pixel
      canvas.width = 1;
      canvas.height = 1;

      // Draw the image down to the 1x1 canvas
      ctx.drawImage(img, 0, 0, 1, 1);

      // Get the pixel data
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;

      resolve(rgbToHex(r, g, b));
    };

    img.onerror = (err) => {
      reject(new Error(`Image could not be loaded for color extraction: ${err}`));
    };
  });
};

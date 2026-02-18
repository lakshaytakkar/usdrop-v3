/**
 * Resizes a base64 encoded image to a new scale using a canvas for high-quality downsampling.
 * If the scale is 100% or more, it returns the original image to avoid upscaling.
 */
export const resizeImage = (base64Str: string, scale: number): Promise<string> => {
  return new Promise((resolve, reject) => {
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

      canvas.width = Math.max(1, newWidth);
      canvas.height = Math.max(1, newHeight);

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/png'));
    };

    img.onerror = (err) => {
      reject(new Error(`Image could not be loaded for resizing: ${err}`));
    };
  });
};

/**
 * Resizes a base64 image to a target aspect ratio, cropping as needed.
 */
export const resizeImageToAspectRatio = (base64Str: string, targetAspectRatio: '1:1' | '4:5' | '16:9' | '9:16' | '3:4'): Promise<string> => {
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
            } else if (targetAspectRatio === '16:9') {
                targetWidth = 16; targetHeight = 9;
            } else if (targetAspectRatio === '9:16') {
                targetWidth = 9; targetHeight = 16;
            } else { // 3:4
                targetWidth = 3; targetHeight = 4;
            }
            const targetRatio = targetWidth / targetHeight;
            const imgRatio = img.width / img.height;

            let sx, sy, sWidth, sHeight;

            if (imgRatio > targetRatio) {
                sHeight = img.height;
                sWidth = img.height * targetRatio;
                sx = (img.width - sWidth) / 2;
                sy = 0;
            } else {
                sWidth = img.width;
                sHeight = img.width / targetRatio;
                sx = 0;
                sy = (img.height - sHeight) / 2;
            }
            
            const outputResolution = 1024;
            if (targetAspectRatio === '1:1') {
                canvas.width = outputResolution;
                canvas.height = outputResolution;
            } else if (targetAspectRatio === '4:5') {
                canvas.width = 820;
                canvas.height = 1024;
            } else if (targetAspectRatio === '16:9') {
                canvas.width = 1280;
                canvas.height = 720;
            } else if (targetAspectRatio === '9:16') {
                canvas.width = 720;
                canvas.height = 1280;
            } else { // 3:4
                canvas.width = 768;
                canvas.height = 1024;
            }

            ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.9));
        };
        img.onerror = reject;
        img.src = base64Str;
    });
};


/**
 * Converts a hex color string to an HSL color object.
 */
const hexToHsl = (hex: string): { h: number; s: number; l: number } => {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
};

/**
 * Converts an HSL color object to a hex color string.
 */
const hslToHex = (h: number, s: number, l: number): string => {
  s /= 100;
  l /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  const toHex = (c: number) => ('0' + Math.round(c * 255).toString(16)).slice(-2);
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
};

/**
 * Calculates a complementary color from a given hex color.
 * It shifts the hue by 180 degrees and adjusts lightness for better contrast.
 * @param {string} hex - The input hex color string.
 * @returns {string} The complementary hex color string.
 */
export const getComplementaryColor = (hex: string): string => {
  const hsl = hexToHsl(hex);
  const complementaryHue = (hsl.h + 180) % 360;

  // Adjust lightness for better visual pairing
  // If the original color is very dark or very light, push the complement towards the middle
  let complementaryLightness = hsl.l;
  if (hsl.l > 85) {
      complementaryLightness = 25;
  } else if (hsl.l < 15) {
      complementaryLightness = 75;
  }

  return hslToHex(complementaryHue, hsl.s, complementaryLightness);
};

/**
 * A utility function to wrap an async call with a retry mechanism,
 * specifically for handling API rate limit errors.
 * @param asyncFn The async function to execute.
 * @param options Configuration for retries, including an onRetry callback for UI updates.
 * @returns A promise that resolves with the result of the async function.
 */
export const withRetry = async <T>(
  asyncFn: () => Promise<T>,
  options: {
    maxRetries?: number;
    initialDelay?: number;
    onRetry?: (attempt: number, delay: number) => void;
  } = {}
): Promise<T> => {
  const { maxRetries = 3, initialDelay = 2000, onRetry } = options;
  let attempt = 0;
  while (attempt <= maxRetries) {
    try {
      return await asyncFn();
    } catch (error: any) {
      // Common ways APIs signal rate limiting
      const isRateLimitError =
        error.status === 429 ||
        (error.message && /rate limit|resource has been exhausted|too many requests/i.test(error.message));

      if (isRateLimitError && attempt < maxRetries) {
        attempt++;
        // Exponential backoff with a random jitter to prevent thundering herd
        const delay = initialDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        if (onRetry) {
          onRetry(attempt, delay);
        }
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        // If it's not a rate limit error or we've exhausted retries, re-throw the error.
        throw error;
      }
    }
  }
  // This line is theoretically unreachable but required for TypeScript's control flow analysis.
  throw new Error('Exceeded maximum retries.');
};

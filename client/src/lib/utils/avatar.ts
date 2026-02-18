/**
 * Generate a unique avatar URL using Dicebear Micah
 * Uses user ID or email as seed to ensure consistent avatars per user
 * Dicebear Micah generates beautiful, consistent avatars based on the seed
 */
export function getAvatarUrl(userId: string, email?: string): string {
  // Use email as seed if available, otherwise use userId
  // This ensures the same user always gets the same avatar
  const seed = email || userId;
  
  // Encode the seed to handle special characters properly
  const encodedSeed = encodeURIComponent(seed);
  
  // Return Dicebear Micah avatar URL with seed
  // Using PNG format for better compatibility with Next.js Image component
  return `https://api.dicebear.com/7.x/micah/png?seed=${encodedSeed}`;
}


/**
 * Generate a unique avatar URL from the avatar service
 * Uses user ID or email as seed to ensure consistent avatars per user
 * The service generates random avatars, so we use a hash of the user identifier
 * to ensure the same user always gets the same avatar
 */
export function getAvatarUrl(userId: string, email?: string): string {
  // Use email as seed if available, otherwise use userId
  // This ensures the same user always gets the same avatar
  const seed = email || userId;
  
  // Generate a simple hash from the seed to create a consistent number
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    const char = seed.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use the hash to generate a random-looking but consistent number
  // This ensures each user gets a consistent avatar
  const randomSeed = Math.abs(hash);
  
  // Return avatar URL with seed as query parameter
  // The service will generate a unique avatar based on the seed
  return `https://avatar.iran.liara.run/public?seed=${randomSeed}`;
}


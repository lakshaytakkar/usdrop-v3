export const DEFAULT_AVATAR_URL = "/images/default-avatar.png";

export function getAvatarUrl(userId: string, email?: string): string {
  return DEFAULT_AVATAR_URL;
}


/**
 * A simple utility for conditionally joining class names.
 * Replaces the need for `clsx` and `tailwind-merge` for basic cases.
 */
export function cn(...inputs: (string | undefined | null | false | 0)[]): string {
  return inputs.filter(Boolean).join(' ');
}

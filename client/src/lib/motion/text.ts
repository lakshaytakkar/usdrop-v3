/**
 * Text animation utilities
 * Character/word splitting for animations
 */

/**
 * Split text into words
 */
export function splitWords(text: string): string[] {
  return text.trim().split(/\s+/)
}

/**
 * Split text into characters
 */
export function splitCharacters(text: string): string[] {
  return text.split("")
}

/**
 * Split text into lines
 */
export function splitLines(text: string): string[] {
  return text.split("\n")
}

/**
 * Wrap each word in a span for animation
 */
export function wrapWords(text: string, className?: string): string {
  const words = splitWords(text)
  return words
    .map((word) => `<span class="${className || ""}">${word}</span>`)
    .join(" ")
}

/**
 * Wrap each character in a span for animation
 */
export function wrapCharacters(text: string, className?: string): string {
  const chars = splitCharacters(text)
  return chars
    .map((char) => {
      if (char === " ") return " "
      return `<span class="${className || ""}">${char}</span>`
    })
    .join("")
}

/**
 * Get text animation delay for staggered effects
 */
export function getStaggerDelay(
  index: number,
  baseDelay: number = 0.05
): number {
  return index * baseDelay
}




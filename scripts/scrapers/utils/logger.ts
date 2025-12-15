/**
 * Centralized logging utility for the scraper
 * Provides timestamped, color-coded console output
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS'

interface TimerEntry {
  startTime: number
  label: string
}

// ANSI color codes for Windows terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
}

const levelColors: Record<LogLevel, string> = {
  DEBUG: colors.gray,
  INFO: colors.cyan,
  WARN: colors.yellow,
  ERROR: colors.red,
  SUCCESS: colors.green,
}

const levelIcons: Record<LogLevel, string> = {
  DEBUG: '  ',
  INFO: 'i ',
  WARN: '! ',
  ERROR: 'X ',
  SUCCESS: '* ',
}

class Logger {
  private debugEnabled: boolean
  private timers: Map<string, TimerEntry> = new Map()
  private currentStep: number = 0
  private totalSteps: number = 0

  constructor(debugEnabled: boolean = false) {
    this.debugEnabled = debugEnabled || process.env.DEBUG === 'true'
  }

  private getTimestamp(): string {
    return new Date().toISOString()
  }

  private formatMessage(level: LogLevel, message: string): string {
    const timestamp = this.getTimestamp()
    const color = levelColors[level]
    const icon = levelIcons[level]
    return `${colors.dim}[${timestamp}]${colors.reset} ${color}[${icon}${level}]${colors.reset} ${message}`
  }

  private formatData(data: unknown): string {
    if (data === undefined) return ''
    if (typeof data === 'string') return data
    try {
      return JSON.stringify(data, null, 2)
    } catch {
      return String(data)
    }
  }

  debug(message: string, data?: unknown): void {
    if (!this.debugEnabled) return
    console.log(this.formatMessage('DEBUG', message))
    if (data !== undefined) {
      console.log(`${colors.gray}${this.formatData(data)}${colors.reset}`)
    }
  }

  info(message: string, data?: unknown): void {
    console.log(this.formatMessage('INFO', message))
    if (data !== undefined) {
      console.log(`${colors.dim}${this.formatData(data)}${colors.reset}`)
    }
  }

  warn(message: string, data?: unknown): void {
    console.log(this.formatMessage('WARN', message))
    if (data !== undefined) {
      console.log(`${colors.yellow}${this.formatData(data)}${colors.reset}`)
    }
  }

  error(message: string, error?: Error | unknown): void {
    console.log(this.formatMessage('ERROR', message))
    if (error) {
      if (error instanceof Error) {
        console.log(`${colors.red}${error.message}${colors.reset}`)
        if (this.debugEnabled && error.stack) {
          console.log(`${colors.dim}${error.stack}${colors.reset}`)
        }
      } else {
        console.log(`${colors.red}${this.formatData(error)}${colors.reset}`)
      }
    }
  }

  success(message: string, data?: unknown): void {
    console.log(this.formatMessage('SUCCESS', message))
    if (data !== undefined) {
      console.log(`${colors.green}${this.formatData(data)}${colors.reset}`)
    }
  }

  /**
   * Log a step in a multi-step process
   */
  step(stepNumber: number, totalSteps: number, description: string): void {
    this.currentStep = stepNumber
    this.totalSteps = totalSteps
    const progress = `[${stepNumber}/${totalSteps}]`
    console.log(this.formatMessage('INFO', `${colors.bright}Step ${progress}${colors.reset} ${description}`))
  }

  /**
   * Start a timer for performance measurement
   */
  startTimer(label: string): void {
    this.timers.set(label, {
      startTime: Date.now(),
      label,
    })
    this.debug(`Timer started: ${label}`)
  }

  /**
   * End a timer and log the duration
   */
  endTimer(label: string): number {
    const timer = this.timers.get(label)
    if (!timer) {
      this.warn(`Timer '${label}' not found`)
      return 0
    }
    const duration = Date.now() - timer.startTime
    this.timers.delete(label)
    const formatted = this.formatDuration(duration)
    this.debug(`Timer ended: ${label} (${formatted})`)
    return duration
  }

  /**
   * Format milliseconds into human-readable duration
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`
    const seconds = (ms / 1000).toFixed(1)
    return `${seconds}s`
  }

  /**
   * Print a visual divider
   */
  divider(title?: string): void {
    const line = '═'.repeat(60)
    if (title) {
      const padding = Math.max(0, (60 - title.length - 2) / 2)
      const paddedTitle = ' '.repeat(Math.floor(padding)) + title + ' '.repeat(Math.ceil(padding))
      console.log(`${colors.dim}╔${line}╗${colors.reset}`)
      console.log(`${colors.dim}║${colors.bright}${paddedTitle}${colors.reset}${colors.dim}║${colors.reset}`)
      console.log(`${colors.dim}╚${line}╝${colors.reset}`)
    } else {
      console.log(`${colors.dim}${'─'.repeat(62)}${colors.reset}`)
    }
  }

  /**
   * Log extracted field result
   */
  field(fieldName: string, value: unknown, success: boolean = true): void {
    const status = success ? colors.green + '✓' : colors.red + '✗'
    const valueStr = value === null || value === undefined
      ? `${colors.dim}null${colors.reset}`
      : typeof value === 'string' && value.length > 50
        ? `"${value.substring(0, 47)}..."`
        : typeof value === 'object'
          ? Array.isArray(value)
            ? `[${value.length} items]`
            : `{${Object.keys(value).length} keys}`
          : JSON.stringify(value)

    console.log(`  ${status}${colors.reset} ${colors.bright}${fieldName}:${colors.reset} ${valueStr}`)
  }

  /**
   * Log a selector attempt
   */
  selector(name: string, selector: string, found: boolean): void {
    const status = found ? colors.green + 'found' : colors.red + 'not found'
    this.debug(`Selector [${name}]: "${selector}" - ${status}${colors.reset}`)
  }

  /**
   * Log raw HTML snippet for debugging
   */
  html(label: string, htmlSnippet: string, maxLength: number = 500): void {
    if (!this.debugEnabled) return
    const truncated = htmlSnippet.length > maxLength
      ? htmlSnippet.substring(0, maxLength) + '...'
      : htmlSnippet
    console.log(`${colors.dim}[HTML: ${label}]${colors.reset}`)
    console.log(`${colors.gray}${truncated}${colors.reset}`)
  }

  /**
   * Log a screenshot capture
   */
  screenshot(path: string): void {
    this.info(`Screenshot saved: ${colors.cyan}${path}${colors.reset}`)
  }

  /**
   * Set debug mode
   */
  setDebug(enabled: boolean): void {
    this.debugEnabled = enabled
  }

  /**
   * Check if debug mode is enabled
   */
  isDebugEnabled(): boolean {
    return this.debugEnabled
  }
}

// Export singleton instance
export const logger = new Logger()

// Export class for custom instances
export { Logger }

// Export types
export type { LogLevel }

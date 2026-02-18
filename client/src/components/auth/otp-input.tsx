

import * as React from "react"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
  error?: boolean
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  className,
  error = false,
}: OTPInputProps) {
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])
  const [focusedIndex, setFocusedIndex] = React.useState<number | null>(0)

  // Split value into array of digits
  const digits = value.split("").slice(0, length)
  while (digits.length < length) {
    digits.push("")
  }

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    const digit = newValue.replace(/\D/g, "")
    
    if (digit.length > 1) {
      // Handle paste: take first digit
      const firstDigit = digit[0]
      const newDigits = [...digits]
      newDigits[index] = firstDigit
      onChange(newDigits.join(""))
      
      // Auto-focus next if available
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
      return
    }

    const newDigits = [...digits]
    newDigits[index] = digit
    onChange(newDigits.join(""))

    // Auto-focus next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newDigits = [...digits]
        newDigits[index] = ""
        onChange(newDigits.join(""))
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length)
    
    if (pastedData) {
      const newDigits = [...digits]
      for (let i = 0; i < pastedData.length && i < length; i++) {
        newDigits[i] = pastedData[i]
      }
      onChange(newDigits.join(""))
      
      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedData.length, length - 1)
      inputRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className={cn("flex gap-2 justify-center", className)}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={() => setFocusedIndex(index)}
          onBlur={() => setFocusedIndex(null)}
          disabled={disabled}
          className={cn(
            "h-12 w-12 text-center text-lg font-semibold rounded-md border bg-transparent transition-all",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] focus-visible:outline-none",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40"
              : "border-input",
            focusedIndex === index && "ring-ring/50 ring-[3px]"
          )}
          aria-label={`Digit ${index + 1} of ${length}`}
        />
      ))}
    </div>
  )
}


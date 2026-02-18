

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Field, FieldError, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Country codes with popular countries first
const COUNTRY_CODES = [
  // Popular countries first
  { code: "+1", country: "United States", flag: "🇺🇸" },
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+971", country: "UAE", flag: "🇦🇪" },
  { code: "+1", country: "Canada", flag: "🇨🇦", suffix: "CA" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+60", country: "Malaysia", flag: "🇲🇾" },
  { code: "+63", country: "Philippines", flag: "🇵🇭" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
  // Separator (other countries)
  { code: "---", country: "───────────", flag: "", disabled: true },
  { code: "+93", country: "Afghanistan", flag: "🇦🇫" },
  { code: "+355", country: "Albania", flag: "🇦🇱" },
  { code: "+213", country: "Algeria", flag: "🇩🇿" },
  { code: "+54", country: "Argentina", flag: "🇦🇷" },
  { code: "+43", country: "Austria", flag: "🇦🇹" },
  { code: "+880", country: "Bangladesh", flag: "🇧🇩" },
  { code: "+32", country: "Belgium", flag: "🇧🇪" },
  { code: "+55", country: "Brazil", flag: "🇧🇷" },
  { code: "+86", country: "China", flag: "🇨🇳" },
  { code: "+57", country: "Colombia", flag: "🇨🇴" },
  { code: "+45", country: "Denmark", flag: "🇩🇰" },
  { code: "+20", country: "Egypt", flag: "🇪🇬" },
  { code: "+358", country: "Finland", flag: "🇫🇮" },
  { code: "+33", country: "France", flag: "🇫🇷" },
  { code: "+30", country: "Greece", flag: "🇬🇷" },
  { code: "+852", country: "Hong Kong", flag: "🇭🇰" },
  { code: "+62", country: "Indonesia", flag: "🇮🇩" },
  { code: "+353", country: "Ireland", flag: "🇮🇪" },
  { code: "+972", country: "Israel", flag: "🇮🇱" },
  { code: "+39", country: "Italy", flag: "🇮🇹" },
  { code: "+81", country: "Japan", flag: "🇯🇵" },
  { code: "+962", country: "Jordan", flag: "🇯🇴" },
  { code: "+254", country: "Kenya", flag: "🇰🇪" },
  { code: "+965", country: "Kuwait", flag: "🇰🇼" },
  { code: "+52", country: "Mexico", flag: "🇲🇽" },
  { code: "+31", country: "Netherlands", flag: "🇳🇱" },
  { code: "+64", country: "New Zealand", flag: "🇳🇿" },
  { code: "+234", country: "Nigeria", flag: "🇳🇬" },
  { code: "+47", country: "Norway", flag: "🇳🇴" },
  { code: "+968", country: "Oman", flag: "🇴🇲" },
  { code: "+92", country: "Pakistan", flag: "🇵🇰" },
  { code: "+48", country: "Poland", flag: "🇵🇱" },
  { code: "+351", country: "Portugal", flag: "🇵🇹" },
  { code: "+974", country: "Qatar", flag: "🇶🇦" },
  { code: "+7", country: "Russia", flag: "🇷🇺" },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦" },
  { code: "+27", country: "South Africa", flag: "🇿🇦" },
  { code: "+82", country: "South Korea", flag: "🇰🇷" },
  { code: "+34", country: "Spain", flag: "🇪🇸" },
  { code: "+94", country: "Sri Lanka", flag: "🇱🇰" },
  { code: "+46", country: "Sweden", flag: "🇸🇪" },
  { code: "+41", country: "Switzerland", flag: "🇨🇭" },
  { code: "+66", country: "Thailand", flag: "🇹🇭" },
  { code: "+90", country: "Turkey", flag: "🇹🇷" },
  { code: "+380", country: "Ukraine", flag: "🇺🇦" },
  { code: "+84", country: "Vietnam", flag: "🇻🇳" },
]

interface PhoneStepProps {
  phoneNumber: string
  onChange: (phone: string) => void
  error?: string
}

export function PhoneStep({ phoneNumber, onChange, error }: PhoneStepProps) {
  const [countryCode, setCountryCode] = useState("+1")
  const [localNumber, setLocalNumber] = useState("")

  // Parse existing phone number on mount
  useEffect(() => {
    if (phoneNumber) {
      // Try to match a country code
      const match = phoneNumber.match(/^(\+\d{1,4})\s*(.*)$/)
      if (match) {
        setCountryCode(match[1])
        setLocalNumber(match[2])
      } else {
        setLocalNumber(phoneNumber)
      }
    }
  }, [])

  const handleCountryChange = (value: string) => {
    setCountryCode(value)
    onChange(`${value} ${localNumber}`.trim())
  }

  const handleNumberChange = (value: string) => {
    // Only allow digits, spaces, dashes, and parentheses
    const cleaned = value.replace(/[^\d\s\-()]/g, "")
    setLocalNumber(cleaned)
    onChange(`${countryCode} ${cleaned}`.trim())
  }

  return (
    <Field className="gap-3">
      <div className="space-y-1">
        <FieldLabel htmlFor="phone" className="text-base font-semibold">
          Let&apos;s start with your contact information
        </FieldLabel>
        <p className="text-sm text-muted-foreground">
          We&apos;ll use this to keep you updated on important account information and provide personalized support when you need it.
        </p>
      </div>
      <div className="space-y-2">
        <FieldLabel htmlFor="phone" className="text-sm font-medium">Phone Number</FieldLabel>
        <div className="flex gap-2">
          <Select value={countryCode} onValueChange={handleCountryChange}>
            <SelectTrigger className="w-[140px] h-10 text-sm">
              <SelectValue placeholder="Code" />
            </SelectTrigger>
            <SelectContent className="max-h-[300px]">
              {COUNTRY_CODES.map((country, index) => (
                country.disabled ? (
                  <SelectItem
                    key={`sep-${index}`}
                    value={`separator-${index}`}
                    disabled
                    className="text-muted-foreground text-xs"
                  >
                    Other Countries
                  </SelectItem>
                ) : (
                  <SelectItem
                    key={`${country.code}-${country.country}`}
                    value={country.suffix ? `${country.code}-${country.suffix}` : country.code}
                    className="text-sm"
                  >
                    <span className="flex items-center gap-2">
                      <span>{country.flag}</span>
                      <span>{country.code}</span>
                      <span className="text-muted-foreground text-xs truncate max-w-[60px]">
                        {country.country}
                      </span>
                    </span>
                  </SelectItem>
                )
              ))}
            </SelectContent>
          </Select>
          <Input
            id="phone"
            type="tel"
            placeholder="(555) 123-4567"
            value={localNumber}
            onChange={(e) => handleNumberChange(e.target.value)}
            className="flex-1 h-10 text-sm"
            aria-invalid={error ? "true" : "false"}
          />
        </div>
        <FieldError className="text-xs">{error}</FieldError>
      </div>
    </Field>
  )
}


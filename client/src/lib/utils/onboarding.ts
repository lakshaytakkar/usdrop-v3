export type EcommerceExperience = "none" | "beginner" | "intermediate" | "advanced" | "expert"

export type PreferredNiche = 
  | "fashion"
  | "electronics"
  | "home-garden"
  | "health-beauty"
  | "sports"
  | "toys-games"
  | "automotive"
  | "pet-supplies"
  | "food-beverage"
  | "other"

export interface OnboardingData {
  phone_number?: string
  ecommerce_experience?: EcommerceExperience
  preferred_niche?: PreferredNiche
}

export const ecommerceExperienceOptions: { value: EcommerceExperience; label: string }[] = [
  { value: "none", label: "None" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
]

export const preferredNicheOptions: { value: PreferredNiche; label: string }[] = [
  { value: "fashion", label: "Fashion" },
  { value: "electronics", label: "Electronics" },
  { value: "home-garden", label: "Home & Garden" },
  { value: "health-beauty", label: "Health & Beauty" },
  { value: "sports", label: "Sports" },
  { value: "toys-games", label: "Toys & Games" },
  { value: "automotive", label: "Automotive" },
  { value: "pet-supplies", label: "Pet Supplies" },
  { value: "food-beverage", label: "Food & Beverage" },
  { value: "other", label: "Other" },
]

export function validatePhoneNumber(phone: string): { valid: boolean; error?: string } {
  if (!phone) {
    return { valid: false, error: "Phone number is required" }
  }

  // Basic phone validation - allows international formats
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(phone)) {
    return { valid: false, error: "Invalid phone number format" }
  }

  // Remove non-digits for length check
  const digitsOnly = phone.replace(/\D/g, "")
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { valid: false, error: "Phone number must be between 10 and 15 digits" }
  }

  return { valid: true }
}


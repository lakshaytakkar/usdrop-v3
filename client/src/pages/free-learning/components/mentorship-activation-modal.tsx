import { useState } from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import {
  User, Mail, Phone, ChevronLeft, ChevronRight, Check,
  Rocket, Store, GraduationCap, TrendingUp, HelpCircle,
  DollarSign, Youtube, Users, Search, Share2, Sparkles,
  CheckCircle2
} from "lucide-react"

interface MentorshipActivationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface FormData {
  fullName: string
  email: string
  phone: string
  countryCode: string
  experienceLevel: string
  businessGoal: string
  monthlyBudget: string
  referralSource: string
}

const TOTAL_STEPS = 6

const experienceOptions = [
  { value: "none", label: "Complete Beginner", description: "I'm brand new to ecommerce", icon: HelpCircle },
  { value: "beginner", label: "Beginner", description: "I've researched but haven't started yet", icon: GraduationCap },
  { value: "intermediate", label: "Intermediate", description: "I have some sales but want to scale", icon: TrendingUp },
  { value: "advanced", label: "Advanced", description: "I run a profitable store already", icon: Store },
  { value: "expert", label: "Expert", description: "Multiple successful stores, looking for next level", icon: Rocket },
]

const goalOptions = [
  { value: "start_new", label: "Start a New Store", description: "Launch my first dropshipping store", icon: Rocket },
  { value: "scale_existing", label: "Scale Existing Store", description: "Take my current store to the next level", icon: TrendingUp },
  { value: "learn_dropshipping", label: "Learn Dropshipping", description: "Master the fundamentals first", icon: GraduationCap },
  { value: "build_brand", label: "Build a Brand", description: "Create a long-term branded business", icon: Store },
  { value: "other", label: "Other", description: "I have a different goal in mind", icon: HelpCircle },
]

const budgetOptions = [
  { value: "under_500", label: "Under $500", description: "Starting with a small budget" },
  { value: "500_2k", label: "$500 - $2,000", description: "Ready to invest in growth" },
  { value: "2k_5k", label: "$2,000 - $5,000", description: "Serious about scaling" },
  { value: "5k_10k", label: "$5,000 - $10,000", description: "Ready for aggressive growth" },
  { value: "10k_plus", label: "$10,000+", description: "All-in on scaling fast" },
]

const referralOptions = [
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "social_media", label: "Social Media", icon: Share2 },
  { value: "friend_referral", label: "Friend / Referral", icon: Users },
  { value: "google_search", label: "Google Search", icon: Search },
  { value: "other", label: "Other", icon: HelpCircle },
]

const countryCodes = [
  { code: "+1", country: "US" },
  { code: "+44", country: "UK" },
  { code: "+91", country: "IN" },
  { code: "+971", country: "AE" },
  { code: "+92", country: "PK" },
  { code: "+61", country: "AU" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+86", country: "CN" },
  { code: "+81", country: "JP" },
  { code: "+82", country: "KR" },
  { code: "+55", country: "BR" },
  { code: "+234", country: "NG" },
  { code: "+27", country: "ZA" },
  { code: "+966", country: "SA" },
  { code: "+65", country: "SG" },
  { code: "+60", country: "MY" },
  { code: "+62", country: "ID" },
  { code: "+63", country: "PH" },
  { code: "+20", country: "EG" },
]

export function MentorshipActivationModal({ open, onOpenChange }: MentorshipActivationModalProps) {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    countryCode: "+1",
    experienceLevel: "",
    businessGoal: "",
    monthlyBudget: "",
    referralSource: "",
  })

  const canProceed = () => {
    switch (step) {
      case 1: return formData.fullName.trim() !== "" && formData.email.trim() !== "" && formData.email.includes("@")
      case 2: return formData.experienceLevel !== ""
      case 3: return formData.businessGoal !== ""
      case 4: return formData.monthlyBudget !== ""
      case 5: return formData.referralSource !== ""
      default: return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch("/api/mentorship-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone || null,
          country_code: formData.countryCode,
          experience_level: formData.experienceLevel,
          business_goal: formData.businessGoal,
          monthly_budget: formData.monthlyBudget,
          referral_source: formData.referralSource,
        }),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setSubmitError(data.error || "Something went wrong. Please try again.")
      }
    } catch {
      setSubmitError("Network error. Please check your connection and try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    onOpenChange(false)
    if (submitted) {
      setStep(1)
      setSubmitted(false)
      setSubmitError(null)
      setFormData({
        fullName: "", email: "", phone: "", countryCode: "+1",
        experienceLevel: "", businessGoal: "", monthlyBudget: "", referralSource: "",
      })
    }
  }

  if (submitted) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0" aria-describedby={undefined}>
          <VisuallyHidden><DialogTitle>Application Submitted</DialogTitle></VisuallyHidden>
          <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-5">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
            <p className="text-sm text-gray-500 mb-6 max-w-sm">
              Thank you for your interest in our mentorship program. Our team will review your application and reach out within 24-48 hours.
            </p>
            <Button onClick={handleClose} data-testid="button-close-success" className="bg-blue-500 hover:bg-blue-600">
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-0" aria-describedby={undefined}>
        <VisuallyHidden><DialogTitle>Activate Mentorship</DialogTitle></VisuallyHidden>
        <div className="px-6 pt-6 pb-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-gray-900">Activate Mentorship</h2>
            <span className="text-xs text-gray-400">Step {step} of {TOTAL_STEPS}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-6 pb-6 min-h-[340px] flex flex-col">
          <div className="flex-1">
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Tell us about yourself</h3>
                  <p className="text-xs text-gray-500">We'll use this to personalize your mentorship experience.</p>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Full Name *</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        value={formData.fullName}
                        onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                        placeholder="Your full name"
                        className="pl-9"
                        data-testid="input-full-name"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="your@email.com"
                        className="pl-9"
                        data-testid="input-email"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-1 block">Phone Number</label>
                    <div className="flex gap-2">
                      <select
                        value={formData.countryCode}
                        onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value }))}
                        className="h-9 rounded-md border border-input bg-background px-2 text-xs w-[90px]"
                        data-testid="select-country-code"
                      >
                        {countryCodes.map(c => (
                          <option key={c.code} value={c.code}>{c.country} {c.code}</option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="Phone number"
                          className="pl-9"
                          data-testid="input-phone"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Your Ecommerce Experience</h3>
                  <p className="text-xs text-gray-500">This helps us match you with the right mentor.</p>
                </div>
                <div className="space-y-2">
                  {experienceOptions.map(opt => {
                    const Icon = opt.icon
                    const isSelected = formData.experienceLevel === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(prev => ({ ...prev, experienceLevel: opt.value }))}
                        data-testid={`card-experience-${opt.value}`}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                          "hover:border-blue-300 hover:bg-blue-50/50",
                          isSelected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                          <div className="text-xs text-gray-500">{opt.description}</div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">What's Your Main Goal?</h3>
                  <p className="text-xs text-gray-500">We'll tailor your mentorship plan accordingly.</p>
                </div>
                <div className="space-y-2">
                  {goalOptions.map(opt => {
                    const Icon = opt.icon
                    const isSelected = formData.businessGoal === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(prev => ({ ...prev, businessGoal: opt.value }))}
                        data-testid={`card-goal-${opt.value}`}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                          "hover:border-blue-300 hover:bg-blue-50/50",
                          isSelected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                        )}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                          <div className="text-xs text-gray-500">{opt.description}</div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Monthly Investment Budget</h3>
                  <p className="text-xs text-gray-500">How much are you planning to invest monthly in your business?</p>
                </div>
                <div className="space-y-2">
                  {budgetOptions.map(opt => {
                    const isSelected = formData.monthlyBudget === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(prev => ({ ...prev, monthlyBudget: opt.value }))}
                        data-testid={`card-budget-${opt.value}`}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all cursor-pointer",
                          "hover:border-blue-300 hover:bg-blue-50/50",
                          isSelected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn(
                          "w-9 h-9 rounded-lg flex items-center justify-center shrink-0",
                          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                        )}>
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-gray-900">{opt.label}</div>
                          <div className="text-xs text-gray-500">{opt.description}</div>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-blue-500 ml-auto shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 5 && (
              <div className="space-y-3">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">How Did You Hear About Us?</h3>
                  <p className="text-xs text-gray-500">This helps us reach more people like you.</p>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {referralOptions.map(opt => {
                    const Icon = opt.icon
                    const isSelected = formData.referralSource === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => setFormData(prev => ({ ...prev, referralSource: opt.value }))}
                        data-testid={`card-referral-${opt.value}`}
                        className={cn(
                          "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all cursor-pointer",
                          "hover:border-blue-300 hover:bg-blue-50/50",
                          isSelected ? "border-blue-500 bg-blue-50 shadow-sm" : "border-gray-100 bg-white"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-500"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{opt.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {step === 6 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Review Your Application</h3>
                  <p className="text-xs text-gray-500">Make sure everything looks right before submitting.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Name", value: formData.fullName },
                    { label: "Email", value: formData.email },
                    { label: "Phone", value: formData.phone ? `${formData.countryCode} ${formData.phone}` : "Not provided" },
                    { label: "Experience", value: experienceOptions.find(o => o.value === formData.experienceLevel)?.label || "" },
                    { label: "Goal", value: goalOptions.find(o => o.value === formData.businessGoal)?.label || "" },
                    { label: "Budget", value: budgetOptions.find(o => o.value === formData.monthlyBudget)?.label || "" },
                    { label: "Referral", value: referralOptions.find(o => o.value === formData.referralSource)?.label || "" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50">
                      <span className="text-xs text-gray-500">{item.label}</span>
                      <span className="text-xs font-semibold text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
            {step > 1 ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep(s => s - 1)}
                data-testid="button-back"
                className="text-gray-500"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            ) : (
              <div />
            )}

            {submitError && step === TOTAL_STEPS && (
              <p className="text-xs text-red-500 font-medium" data-testid="text-submit-error">{submitError}</p>
            )}

            {step < TOTAL_STEPS ? (
              <Button
                size="sm"
                onClick={() => setStep(s => s + 1)}
                disabled={!canProceed()}
                data-testid="button-next"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={handleSubmit}
                disabled={submitting}
                data-testid="button-submit-application"
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                {submitting ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-1 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-1" />
                    Submit Application
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

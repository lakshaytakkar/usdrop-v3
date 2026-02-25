import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, TrendingUp, BarChart3, Store, Palette, GraduationCap, Phone } from "lucide-react"

interface UpsellDialogProps {
  isOpen: boolean
  onClose: () => void
}

const features = [
  {
    icon: TrendingUp,
    title: "Product Research Suite",
    description: "AI-powered product discovery with real profit margins and competitor pricing.",
  },
  {
    icon: BarChart3,
    title: "Ad Intelligence & Studio",
    description: "Generate scroll-stopping ads and track competitor creatives across platforms.",
  },
  {
    icon: Store,
    title: "Competitor Store Analysis",
    description: "Spy on top-performing stores, their bestsellers, and pricing strategies.",
  },
  {
    icon: Palette,
    title: "AI Studio & Tools",
    description: "Full creative toolkit — whitelabelling, descriptions, policies, and invoices.",
  },
  {
    icon: GraduationCap,
    title: "Academy & Live Sessions",
    description: "Access all courses, recorded strategy sessions, and learning resources.",
  },
]

export function UpsellDialog({ isOpen, onClose }: UpsellDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[820px] p-0 overflow-hidden gap-0 border-0 rounded-[20px]" hideDefaultClose>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-8 md:p-10 flex flex-col">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:hidden z-10 text-gray-400 hover:text-gray-600 transition-colors"
              data-testid="button-close-upsell"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mb-8">
              <h2 className="text-[24px] sm:text-[28px] font-semibold text-black tracking-[-0.5px] leading-[1.2] mb-2">
                Unlock the Full Platform
              </h2>
              <p className="text-[14px] text-[#666] leading-relaxed">
                Everything you need to find, launch, and scale winning products — all in one plan.
              </p>
            </div>

            <div className="space-y-5 flex-1">
              {features.map((feature) => (
                <div key={feature.title} className="flex items-start gap-3.5" data-testid={`upsell-feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    <feature.icon className="h-[18px] w-[18px] text-[#333]" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-black leading-tight mb-0.5">
                      {feature.title}
                    </p>
                    <p className="text-[13px] text-[#888] leading-snug">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Button
                className="w-full h-12 text-[14px] font-semibold rounded-xl gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500"
                onClick={() => {
                  onClose()
                  window.open("https://calendly.com", "_blank")
                }}
                data-testid="button-get-callback"
              >
                <Phone className="h-4 w-4" />
                Get a Callback
              </Button>
              <p className="text-center text-[12px] text-[#999] mt-3">
                Speak with our team to activate your Pro access
              </p>
            </div>
          </div>

          <div className="relative hidden md:block">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 text-white/60 hover:text-white transition-colors"
              data-testid="button-close-upsell-desktop"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src="/images/ui/upsell-pro-bg.png"
              alt="USDrop Pro"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 via-purple-900/20 to-violet-900/30 mix-blend-overlay" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

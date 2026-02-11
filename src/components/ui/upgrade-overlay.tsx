"use client"

import { motion } from "motion/react"
import { Lock, Crown, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DURATION, EASING } from "@/lib/motion"

interface UpgradeOverlayProps {
  featureName: string
  featureDescription: string
  children?: React.ReactNode
}

export function UpgradeOverlay({
  featureName,
  featureDescription,
  children,
}: UpgradeOverlayProps) {
  const router = useRouter()

  return (
    <div className="relative w-full min-h-[60vh]">
      {children && (
        <div
          className="pointer-events-none select-none"
          style={{ filter: "blur(8px)" }}
          aria-hidden="true"
        >
          {children}
        </div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: DURATION.slow,
          ease: [...EASING.easeOut],
        }}
        className="absolute inset-0 z-50 flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-white/80 backdrop-blur-xl" />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: DURATION.slower,
            ease: [...EASING.easeOutExpo],
            delay: 0.1,
          }}
          className="relative z-10 flex flex-col items-center text-center max-w-md mx-auto px-6"
        >
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-100 mb-6">
            <Lock className="w-7 h-7 text-gray-600" />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <Crown className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-amber-600">
              Pro Feature
            </span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2 tracking-tight">
            {featureName}
          </h2>

          <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-sm">
            {featureDescription}
          </p>

          <Button
            onClick={() => router.push("/home")}
            className="bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 rounded-xl px-8 h-11 text-sm font-medium shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade to Pro
          </Button>

          <button
            onClick={() => router.back()}
            className="mt-4 flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Go Back
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

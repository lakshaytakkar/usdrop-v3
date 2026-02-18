

import { motion } from "motion/react"
import { Crown, Lock } from "lucide-react"
import { useRouter } from "@/hooks/use-router"
import { Button } from "@/components/ui/button"
import { DURATION, EASING } from "@/lib/motion"

interface LimitedDataOverlayProps {
  itemType: string
  visibleCount: number
}

export function LimitedDataOverlay({
  itemType,
  visibleCount,
}: LimitedDataOverlayProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: DURATION.slow,
        ease: [...EASING.easeOut],
      }}
      className="relative w-full"
    >
      <div className="h-32 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none" />

      <div className="flex flex-col items-center text-center pb-8 -mt-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gray-100 mb-4">
          <Lock className="w-4.5 h-4.5 text-gray-500" />
        </div>

        <p className="text-sm text-gray-500 mb-1">
          Showing {visibleCount} of many {itemType}
        </p>

        <p className="text-xs text-gray-400 mb-5">
          Upgrade to Pro to see all {itemType}
        </p>

        <Button
          onClick={() => router.push("/home")}
          className="bg-gradient-to-r from-gray-900 to-black text-white hover:from-gray-800 hover:to-gray-900 rounded-xl px-6 h-9 text-sm font-medium shadow-lg shadow-gray-900/20 transition-all hover:shadow-xl hover:shadow-gray-900/30"
        >
          <Crown className="w-3.5 h-3.5 mr-1.5" />
          Upgrade to Pro
        </Button>
      </div>
    </motion.div>
  )
}

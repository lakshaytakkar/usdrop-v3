import { Clock } from "lucide-react"

export function ComingSoonOverlay() {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-white/80 backdrop-blur-sm" data-testid="overlay-coming-soon">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <Clock className="h-8 w-8 text-blue-500" />
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Coming Soon</h2>
          <p className="mt-1.5 text-sm text-gray-500 max-w-xs mx-auto">
            We're working hard to bring this feature to you. Stay tuned for updates!
          </p>
        </div>
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500" />
          </span>
          <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">In Development</span>
        </div>
      </div>
    </div>
  )
}

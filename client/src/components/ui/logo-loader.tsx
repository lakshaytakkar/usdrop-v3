import { useState, useEffect } from "react"

export function LogoLoader({ message }: { message?: string }) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".")
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center gap-5 py-20" data-testid="loader-logo">
      <div className="flex items-baseline gap-1 select-none">
        <span className="text-[32px] font-bold tracking-tight text-foreground animate-logo-pulse">
          USDrop
        </span>
        <span className="text-[32px] font-bold text-blue-600 animate-logo-pulse-delayed">
          AI
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="block w-1.5 h-1.5 rounded-full bg-blue-500 animate-logo-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>

      {message && (
        <p className="text-[13px] text-[#999] font-medium tracking-wide">
          {message}{dots}
        </p>
      )}
    </div>
  )
}

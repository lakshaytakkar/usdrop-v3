

import { useMemo } from "react"

interface RevenueTrendChartProps {
  data: number[]
  width?: number
  height?: number
  className?: string
}

export function RevenueTrendChart({ 
  data, 
  width = 120, 
  height = 40,
  className = "" 
}: RevenueTrendChartProps) {
  const pathData = useMemo(() => {
    if (!data || data.length === 0) return ""

    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * (width - 4) + 2
      const y = height - 2 - ((value - min) / range) * (height - 4)
      return `${x},${y}`
    })

    return points.join(" ")
  }, [data, width, height])

  if (!data || data.length === 0) {
    return (
      <div 
        className={`flex items-center justify-center text-muted-foreground text-xs ${className}`}
        style={{ width, height }}
      >
        No data
      </div>
    )
  }

  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {/* Area */}
      <polygon
        points={`2,${height - 2} ${pathData} ${width - 2},${height - 2}`}
        fill="url(#trendGradient)"
        className="text-primary"
      />
      {/* Line */}
      <polyline
        points={pathData}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-primary"
      />
    </svg>
  )
}


import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-blue-100/60 animate-pulse rounded-md", className)}
      style={{ animationDuration: '1s' }}
      {...props}
    />
  )
}

export { Skeleton }

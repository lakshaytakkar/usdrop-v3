"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Logo({ className }: { className?: string }) {
    const pathname = usePathname()
    const isAdminRoute = pathname?.startsWith("/admin") ?? false
    
    return (
        <Link href="/" className={`flex items-baseline gap-1 ${className}`}>
            <span className="text-2xl font-bold tracking-tight text-foreground">USDrop</span>
            <span className="text-2xl font-bold text-blue-600">AI</span>
            <span className="ml-1 text-lg font-medium text-muted-foreground">
                {isAdminRoute ? "Admin" : "Studio"}
            </span>
        </Link>
    )
}

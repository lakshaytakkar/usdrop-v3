"use client"

import { usePathname } from "next/navigation"
import { ChatbotBubble } from "./chatbot-bubble"

export function ConditionalChatbotBubble() {
  const pathname = usePathname()
  
  // Don't show on landing page (root), admin pages, login, or signup pages
  // Only show for external logged-in users pages
  if (
    pathname === "/" || 
    pathname?.startsWith("/admin") || 
    pathname === "/login" || 
    pathname?.startsWith("/login") ||
    pathname === "/signup" ||
    pathname?.startsWith("/signup")
  ) {
    return null
  }
  
  return <ChatbotBubble />
}


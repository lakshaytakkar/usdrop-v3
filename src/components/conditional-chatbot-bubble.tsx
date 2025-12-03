"use client"

import { usePathname } from "next/navigation"
import { ChatbotBubble } from "./chatbot-bubble"

export function ConditionalChatbotBubble() {
  const pathname = usePathname()
  
  // Don't show on landing page (root) or admin pages
  if (pathname === "/" || pathname?.startsWith("/admin")) {
    return null
  }
  
  return <ChatbotBubble />
}


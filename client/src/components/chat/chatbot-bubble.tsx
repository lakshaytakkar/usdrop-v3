

import { useState, useRef } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { MessageCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { ChatbotDialog } from "./chatbot-dialog"

export function ChatbotBubble() {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  
  const fullText = "Hi, I am your Relationship Manager, if you need any help you can reach out to me"
  const relationshipManagerNumber = "+1 (555) 123-4567" // Replace with actual number
  const pocName = "Parth"

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2.5",
          "bg-background border border-border rounded-full shadow-lg",
          "px-3 py-2.5",
          "cursor-pointer"
        )}
        aria-label="Open chatbot"
      >
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-primary/20">
            <AvatarImage 
              src={`https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(pocName)}`} 
              alt={pocName} 
            />
            <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
              {pocName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          {/* Green online dot */}
          <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
        </div>
        
        <div className="flex flex-col items-start max-w-[180px]">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-sm font-semibold text-foreground">{pocName}</span>
            <span className="text-xs text-muted-foreground">(Relationship Manager)</span>
          </div>
          <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
            {fullText}
          </p>
        </div>
      </button>

      <ChatbotDialog 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        relationshipManagerNumber={relationshipManagerNumber}
        pocName={pocName}
        buttonRef={buttonRef}
      />
    </>
  )
}


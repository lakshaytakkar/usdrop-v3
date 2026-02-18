

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Send, Phone } from "lucide-react"
import { cn } from "@/lib/utils"

interface ChatbotDialogProps {
  isOpen: boolean
  onClose: () => void
  relationshipManagerNumber: string
  pocName: string
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  timestamp: Date
}

export function ChatbotDialog({ isOpen, onClose, relationshipManagerNumber, pocName, buttonRef }: ChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [ticketSubject, setTicketSubject] = useState("")
  const [ticketDescription, setTicketDescription] = useState("")
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [position, setPosition] = useState({ top: 0, right: 0 })
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dialogHeight = 450 // Smaller height
      const gap = 12
      const calculatedTop = buttonRect.top - dialogHeight - gap
      
      // Ensure dialog doesn't go above viewport
      const finalTop = calculatedTop < 20 ? 20 : calculatedTop
      
      setPosition({
        top: finalTop,
        right: window.innerWidth - buttonRect.right,
      })
    }
  }, [isOpen, buttonRef])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Show typing indicator first
      setIsTyping(true)
      
      // After a delay, show the initial message
      setTimeout(() => {
        setIsTyping(false)
        const initialMessage: Message = {
          id: "1",
          text: `Hello! I'm ${pocName}, your Relationship Manager. I'm here to help you with any questions or issues you might have. You can reach me directly at ${relationshipManagerNumber}. How can I assist you today?`,
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages([initialMessage])
      }, 1500) // 1.5 second typing delay
    }
  }, [isOpen, relationshipManagerNumber, pocName])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Show typing indicator
    setIsTyping(true)

    // Simulate bot response with typing delay
    setTimeout(() => {
      setIsTyping(false)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand. Would you like me to help you create a support ticket for this issue?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setShowTicketForm(true)
    }, 1500) // 1.5 second typing delay
  }

  const handleSubmitTicket = () => {
    if (!ticketSubject.trim() || !ticketDescription.trim()) return

    const ticketMessage: Message = {
      id: Date.now().toString(),
      text: `Ticket Created:\nSubject: ${ticketSubject}\nDescription: ${ticketDescription}`,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, ticketMessage])

    // Show typing indicator
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      const confirmationMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Thank you! Your ticket has been submitted. ${pocName} will get back to you soon. You can also reach out directly at the number provided above.`,
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, confirmationMessage])
      setShowTicketForm(false)
      setTicketSubject("")
      setTicketDescription("")
    }, 1500) // 1.5 second typing delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog positioned relative to button */}
      <div
        ref={dialogRef}
        className={cn(
          "fixed z-50 w-[380px] h-[450px] flex flex-col",
          "bg-background border border-border rounded-lg shadow-xl",
          "animate-in fade-in-0 slide-in-from-bottom-4 duration-300 ease-out"
        )}
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex-shrink-0">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={`https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(pocName)}`} 
                alt={pocName} 
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {pocName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-base font-semibold">{pocName}</h3>
              <div className="flex items-center gap-2 mt-1">
                <Phone className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{relationshipManagerNumber}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "bot" && (
                <Avatar className="h-8 w-8 flex-shrink-0">
                  <AvatarImage 
                    src={`https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(pocName)}`} 
                    alt={pocName} 
                  />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {pocName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={cn(
                  "rounded-lg px-4 py-2 max-w-[80%]",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-3 justify-start">
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarImage 
                  src={`https://api.dicebear.com/7.x/micah/png?seed=${encodeURIComponent(pocName)}`} 
                  alt={pocName} 
                />
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  {pocName.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted text-foreground rounded-lg px-4 py-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">Typing</span>
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1.4s' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '200ms', animationDuration: '1.4s' }} />
                    <span className="w-1.5 h-1.5 bg-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '400ms', animationDuration: '1.4s' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {showTicketForm && (
          <div className="px-6 py-4 border-t bg-muted/30 space-y-3">
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-xs">Ticket Subject</Label>
              <Input
                id="subject"
                placeholder="Enter ticket subject"
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                className="h-9 text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-xs">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your issue..."
                value={ticketDescription}
                onChange={(e) => setTicketDescription(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
              />
            </div>
            <Button
              onClick={handleSubmitTicket}
              className="w-full h-9"
              disabled={!ticketSubject.trim() || !ticketDescription.trim()}
            >
              Submit Ticket
            </Button>
          </div>
        )}

        {!showTicketForm && (
          <div className="px-6 py-4 border-t">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 h-10 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="h-10 w-10"
                disabled={!inputValue.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}


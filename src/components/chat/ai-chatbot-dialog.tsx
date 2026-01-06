"use client"

import { useState, useRef, useEffect } from "react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, Bot, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIChatbotDialogProps {
  isOpen: boolean
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement | null>
}

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  timestamp: Date
}

export function AIChatbotDialog({ isOpen, onClose, buttonRef }: AIChatbotDialogProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
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
      const dialogHeight = 500
      const gap = 12
      const calculatedTop = buttonRect.bottom + gap
      
      // Ensure dialog doesn't go below viewport
      const maxTop = window.innerHeight - dialogHeight - 20
      const finalTop = calculatedTop > maxTop ? maxTop : calculatedTop
      
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
          text: "Hello! I'm USDrop AI, your intelligent assistant. I'm here to help you with any questions about our platform, features, or how to get the most out of USDrop. How can I assist you today?",
          sender: "bot",
          timestamp: new Date(),
        }
        setMessages([initialMessage])
      }, 1500) // 1.5 second typing delay
    }
  }, [isOpen])

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

    // Simulate AI response with typing delay
    setTimeout(() => {
      setIsTyping(false)
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I understand your question. Let me help you with that. Could you provide a bit more detail so I can give you the most accurate answer?",
        sender: "bot",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
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
      {/* Overlay - positioned below topbar */}
      <div
        className="fixed top-16 left-0 right-0 bottom-0 z-[90] bg-black/50"
        onClick={onClose}
      />
      
      {/* Dialog positioned relative to button */}
      <div
        ref={dialogRef}
        className={cn(
          "fixed z-[95] w-[400px] h-[500px] flex flex-col",
          "bg-white border border-border rounded-2xl shadow-2xl",
          "animate-in fade-in-0 slide-in-from-top-4 duration-300 ease-out"
        )}
        style={{
          top: `${position.top}px`,
          right: `${position.right}px`,
        }}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0 bg-white rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-black/5 flex items-center justify-center border border-border">
                <Bot className="h-5 w-5 text-foreground" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold text-foreground">USDrop AI</h3>
              <p className="text-xs text-muted-foreground mt-0.5">Your intelligent assistant</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-white">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3",
                message.sender === "user" ? "justify-end" : "justify-start"
              )}
            >
              {message.sender === "bot" && (
                <div className="h-8 w-8 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-foreground" />
                </div>
              )}
              <div
                className={cn(
                  "rounded-2xl px-4 py-2.5 max-w-[80%]",
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground border border-border"
                )}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <span className={cn(
                  "text-xs mt-1.5 block",
                  message.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                )}>
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
              <div className="h-8 w-8 rounded-xl bg-muted border border-border flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-foreground" />
              </div>
              <div className="bg-muted text-foreground rounded-2xl px-4 py-2.5 border border-border">
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

        <div className="px-6 py-4 border-t border-border bg-white rounded-b-2xl">
          <div className="flex gap-2">
            <Input
              placeholder="Ask me anything..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 h-10 text-sm bg-background border-border rounded-xl"
            />
            <Button
              onClick={handleSendMessage}
              size="icon"
              className="h-10 w-10 bg-black text-white hover:bg-black/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!inputValue.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}


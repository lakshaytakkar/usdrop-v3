"use client"

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, Bot } from 'lucide-react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { motion, AnimatePresence } from 'motion/react';
import { DURATION, EASING } from '@/lib/motion';

interface Message {
  role: 'user' | 'model';
  text: string;
}

// Get API key from environment variables (same as gemini-service.ts)
const getApiKey = () => {
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || 
         process.env.NEXT_PUBLIC_API_KEY || 
         process.env.GEMINI_API_KEY || 
         process.env.API_KEY;
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: 'Hi there! I am your USDrop expert. Looking for winning products or help with scaling your store?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    const apiKey = getApiKey();
    if (!inputValue.trim() || isLoading || !apiKey) {
      if (!apiKey) {
        setMessages(prev => [...prev, { role: 'model', text: "API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables." }]);
      }
      return;
    }

    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey });
      const chat = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: {
          systemInstruction: `You are an expert dropshipping coach and support agent for "USDrop", the world's #1 dropshipping platform.
          Your goal is to help users find winning products, understand the features (AI Studio, Product Discovery, Store Research), and scale their business.
          Tone: Energetic, professional, encouraging, and knowledgeable about e-commerce trends.
          USDrop features: Real-time product analysis, AI content generation (images/ads), Supplier management, Profit calculator.
          Competitors: We are better than Zendrop because we offer all-in-one AI tools and better data.
          Pricing: Mention the 14-day free trial.`,
        },
      });

      const response: GenerateContentResponse = await chat.sendMessage({ 
        message: userMsg 
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I'm analyzing the market... could you repeat that?" }]);
    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, I'm having trouble connecting to the product database." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut", delay: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-blue-600 text-white shadow-xl shadow-blue-500/30 hover:bg-blue-700 flex items-center justify-center"
      >
        <motion.div
          animate={isOpen ? { rotate: 90 } : { rotate: 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-8 w-8" />}
        </motion.div>
      </motion.button>

      {/* Chat Window */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-28 right-6 z-50 w-[90vw] md:w-[400px] h-[600px] bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-bold text-slate-900">USDrop Assistant</div>
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"/> Online
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
            <AnimatePresence>
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: DURATION.fast, delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none shadow-sm'
                        : 'bg-slate-100 text-slate-800 rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl rounded-bl-none px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-0" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150" />
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-300" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about winning products..."
                className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
              />
              <motion.button
                onClick={handleSend}
                disabled={isLoading || !inputValue.trim()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <Send className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

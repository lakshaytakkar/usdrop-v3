import { GoogleGenAI, Part } from "@google/genai";
// FIX: Import ChatSession from shared types and remove local definition.
import type { ChatMessage, ChatSession } from '../types';
import type { StudioStoreSlice } from './StudioContext';
import { geminiService } from '../services/geminiService';
import { withRetry } from '../utils/colorUtils';

export interface ChatState {
  chats: Record<string, ChatSession>;
  activeChatId: string | null;
  chatAssets: string[];
  isChatting: boolean;
  reverseEngineerImage: string | null;
  generatedPrompt: string | null;
  isGeneratingPrompt: boolean;
}

export interface ChatActions {
  setReverseEngineerImage: (base64: string | null) => void;
  generateReverseEngineeredPrompt: () => Promise<void>;
  sendMessage: (message: string, imageBase64?: string | null) => Promise<void>;
  startNewChat: () => void;
  setActiveChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  clearReverseEngineer: () => void;
}

export type ChatSlice = ChatState & ChatActions;

const initialChatState: ChatState = {
  chats: {},
  activeChatId: null,
  chatAssets: [],
  isChatting: false,
  reverseEngineerImage: null,
  generatedPrompt: null,
  isGeneratingPrompt: false,
};

export const createChatSlice: StudioStoreSlice<ChatSlice> = (set, get) => ({
  ...initialChatState,

  setReverseEngineerImage: (base64) => {
    set({ reverseEngineerImage: base64, generatedPrompt: null, error: null });
  },
  
  clearReverseEngineer: () => {
      set({ reverseEngineerImage: null, generatedPrompt: null, error: null });
  },

  generateReverseEngineeredPrompt: async () => {
    const { reverseEngineerImage } = get();
    if (!reverseEngineerImage) return;

    set({ isGeneratingPrompt: true, error: null, generatedPrompt: '' });
    try {
      const prompt = await withRetry(() => geminiService.reverseEngineerPrompt(reverseEngineerImage));
      set({ generatedPrompt: prompt });
    } catch (e: any) {
      console.error("Failed to generate prompt:", e);
      set({ error: e.message || "Could not generate a prompt from this image." });
    } finally {
      set({ isGeneratingPrompt: false });
    }
  },
  
  startNewChat: () => {
    const newChatId = `chat_${Date.now()}`;
    const newChat: ChatSession = {
      id: newChatId,
      title: 'New Chat',
      history: [],
      createdAt: Date.now(),
    };
    set(state => ({
      chats: { ...state.chats, [newChatId]: newChat },
      activeChatId: newChatId,
    }));
  },

  setActiveChat: (chatId) => {
    if (get().chats[chatId]) {
      set({ activeChatId: chatId });
    }
  },

  deleteChat: (chatId) => {
    set(state => {
      const newChats = { ...state.chats };
      delete newChats[chatId];
      const newActiveChatId = state.activeChatId === chatId ? null : state.activeChatId;
      return { chats: newChats, activeChatId: newActiveChatId };
    });
  },

  sendMessage: async (message, imageBase64) => {
    if (!message.trim() && !imageBase64) return;

    let currentChatId = get().activeChatId;
    // If no active chat, start a new one
    if (!currentChatId) {
        get().startNewChat();
        currentChatId = get().activeChatId;
    }
    if (!currentChatId) return; // Should not happen

    const parts: Part[] = [];
    if (imageBase64) {
      try {
        const { mimeType, data } = geminiService.parseDataUrl(imageBase64);
        parts.push({ inlineData: { mimeType, data } });
        // Add image to asset library
        set(state => ({
            chatAssets: state.chatAssets.includes(imageBase64) ? state.chatAssets : [imageBase64, ...state.chatAssets]
        }));
      } catch(e) {
          set({ error: "Invalid image format." });
          return;
      }
    }
    if (message.trim()) {
      parts.push({ text: message });
    }

    const userMessage: ChatMessage = { role: "user", parts };
    
    // Optimistically update UI
    set(state => {
      const activeChat = state.chats[currentChatId!];
      const newHistory = [...activeChat.history, userMessage];
      const newTitle = activeChat.history.length === 0 ? message.trim().substring(0, 30) + '...' : activeChat.title;
      return {
        isChatting: true,
        error: null,
        chats: {
          ...state.chats,
          [currentChatId!]: { ...activeChat, history: newHistory, title: newTitle },
        },
      };
    });

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const activeChat = get().chats[currentChatId];
      
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: activeChat.history,
        config: {
          systemInstruction: 'You are a friendly and helpful creative director for a fashion and product brand. Your goal is to help users brainstorm ideas, refine concepts, and overcome creative blocks. Keep your responses concise, inspiring, and use markdown for formatting when appropriate.',
        },
      });

      const responseText = result.text;
      
      const modelMessage: ChatMessage = { role: "model", parts: [{ text: responseText }] };
      set(state => {
        const chat = state.chats[currentChatId!];
        return {
          chats: {
            ...state.chats,
            [currentChatId!]: { ...chat, history: [...chat.history, modelMessage] }
          }
        };
      });

    } catch (e: any) {
      console.error("Chat error:", e);
      const errorMessageText = e.message || "An unknown error occurred.";
      const errorMessage: ChatMessage = { role: "model", parts: [{ text: `Sorry, an error occurred: ${errorMessageText}` }]};
      set(state => {
         const chat = state.chats[currentChatId!];
         return {
          chats: {
            ...state.chats,
            [currentChatId!]: { ...chat, history: [...chat.history, errorMessage] }
          }
        };
      });
    } finally {
      set({ isChatting: false });
    }
  },
});

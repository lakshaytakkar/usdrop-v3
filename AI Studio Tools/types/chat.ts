import { Part } from "@google/genai";

export interface ChatMessage {
  role: "user" | "model";
  parts: Part[];
}

// FIX: Add ChatSession interface for chat management.
export interface ChatSession {
  id: string;
  title: string;
  history: ChatMessage[];
  createdAt: number;
}

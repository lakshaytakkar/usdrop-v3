"use client"

import { Header } from '@/components/landing/Header';
import { DropshippingTimeline } from '@/components/landing/DropshippingTimeline';
import { Footer } from '@/components/landing/Footer';
import { ChatBot } from '@/components/landing/ChatBot';

export default function WhatIsDropshippingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="pt-16">
        <DropshippingTimeline />
      </main>

      <Footer />
      <ChatBot />
    </div>
  );
}


"use client"

import { Header } from '@/components/landing-deprecated/Header';
import { DropshippingTimeline } from '@/components/landing-deprecated/DropshippingTimeline';
import { Footer } from '@/components/landing-deprecated/Footer';
import { ChatBot } from '@/components/landing-deprecated/ChatBot';

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


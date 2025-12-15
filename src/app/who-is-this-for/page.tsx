"use client"

import { Header } from "../(marketing)/components/Header"
import { Footer } from "../(marketing)/components/Footer"

export default function WhoIsThisForPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans">
      <Header />
      
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Who is this for?
            </h1>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              USDrop AI is designed for dropshippers at every stage of their journey.
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-8 text-center">
            <p className="text-slate-600">
              This page is coming soon. We're building content to help you understand if USDrop AI is right for you.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}


"use client"

import React, { useState } from 'react';
import { Container, Button } from './ui';
import { Menu, X, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/logo';
import Image from 'next/image';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-100 py-3 transition-all">
      <Container>
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Logo className="text-slate-900" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Features</a>
            <a href="#product-research" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Research</a>
            <a href="#ai-studio" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">AI Tools</a>
            <a href="#fulfillment" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Fulfillment</a>
            <a href="/learn" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-1">
              <GraduationCap className="h-4 w-4" />
              <span>Academy</span>
            </a>
            <a href="/what-is-dropshipping" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Learn</a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="md" className="font-semibold text-slate-600">Log In</Button>
            <button
              className="group relative h-10 rounded-md text-sm font-medium text-white transition-all duration-300 cursor-pointer flex items-center gap-2 px-4"
            >
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
              <span className="relative z-10 flex items-center gap-2">
                <Image 
                  src="/3d-icons/Item 20.png" 
                  alt="Coins" 
                  width={20} 
                  height={20}
                  className="object-contain"
                />
                Claim Free Credits
              </span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-100 mt-3 pt-4 pb-4">
            <nav className="flex flex-col gap-4">
              <a 
                href="#features" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a 
                href="#product-research" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Research
              </a>
              <a 
                href="#ai-studio" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                AI Tools
              </a>
              <a 
                href="#fulfillment" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fulfillment
              </a>
              <a 
                href="/learn" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <GraduationCap className="h-4 w-4" />
                Academy
              </a>
              <a 
                href="/what-is-dropshipping" 
                className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Learn
              </a>
            </nav>
          </div>
        )}
      </Container>
    </header>
  );
};

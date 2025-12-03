import React, { useState, useEffect } from 'react';
import { Container, Button } from './ui';
import { Menu, X, Package } from 'lucide-react';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 py-4 transition-all">
      <Container>
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="bg-blue-600 text-white p-1.5 rounded-lg shadow-md shadow-blue-600/20">
               <Package size={20} strokeWidth={3} />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 font-display">USDrop</span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#product-research" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Product Research</a>
            <a href="#ai-studio" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">AI Studio</a>
            <a href="#fulfillment" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">US Shipping</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">Pricing</a>
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" size="md" className="font-semibold text-slate-600">Log In</Button>
            <Button variant="primary" size="md" className="rounded-lg shadow-lg shadow-blue-600/20 hover:scale-105 transition-transform font-bold">
              Get Free Access
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-slate-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </Container>
    </header>
  );
};
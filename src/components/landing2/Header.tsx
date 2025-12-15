"use client"

import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
  { label: 'About', href: '#lnk-1', submenu: [
    { label: 'Why USDrop?', href: '#lnk-1' },
    { label: 'How It Works', href: '#lnk-2' },
    { label: 'Best Solutions', href: '#lnk-3' },
    { label: 'Integrations', href: '#integrations-1' },
    { label: 'Testimonials', href: '#reviews-2' },
  ]},
  { label: 'Features', href: '#features-11' },
  { label: 'Projects', href: '#projects-1' },
  { label: 'FAQs', href: '#faqs' },
];

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b border-border shadow-sm py-3' 
          : 'bg-transparent border-b border-transparent py-5'
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* Logo */}
          <Logo className="text-foreground" />

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <div 
                key={item.label}
                className="relative"
                onMouseEnter={() => item.submenu && setDropdownOpen(item.label)}
                onMouseLeave={() => setDropdownOpen(null)}
              >
                <a 
                  href={item.href}
                  className="text-sm font-semibold text-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  {item.label}
                  {item.submenu && <span className="text-xs">▼</span>}
                </a>
                
                {item.submenu && dropdownOpen === item.label && (
                  <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg py-2">
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="block px-4 py-2 text-sm text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            <a href="/login" className="text-sm font-semibold text-foreground hover:text-primary transition-colors">
              Sign in
            </a>
            <Button variant="default" size="lg" className="font-semibold shadow-primary/20 px-6 rounded-md">
              Sign up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 shadow-lg z-50">
          <div className="flex flex-col gap-6">
            {navItems.map((item) => (
              <div key={item.label}>
                <a 
                  href={item.href}
                  className="text-lg font-semibold text-foreground block mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
                {item.submenu && (
                  <div className="pl-4 space-y-2">
                    {item.submenu.map((sub) => (
                      <a
                        key={sub.label}
                        href={sub.href}
                        className="text-sm text-muted-foreground block"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {sub.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <hr className="border-border" />
            <a href="/login" className="text-lg font-semibold text-foreground">Sign in</a>
            <Button size="lg" className="rounded-md font-semibold w-full">Sign up</Button>
          </div>
        </div>
      )}
    </header>
  );
};












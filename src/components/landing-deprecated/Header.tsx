"use client"

import React, { useState, useEffect } from 'react';
import { Container, Button } from './ui';
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react';
import { Logo } from '@/components/layout/logo';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { useScrollPosition } from '@/lib/motion/scroll';
import { MotionIcon } from '@/components/motion/MotionIcon';
import { MotionButton } from '@/components/motion/MotionButton';
import { DURATION, EASING } from '@/lib/motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollPosition = useScrollPosition();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setScrolled(scrollPosition.y > 20);
  }, [scrollPosition.y]);

  type NavLink = {
    href: string;
    label: string;
    icon?: React.ElementType;
    children?: { href: string; label: string; icon?: React.ElementType }[];
  };

  const navLinks: NavLink[] = [
    { href: "#features", label: "Features" },
    { href: "#product-research", label: "Research" },
    {
      href: "#",
      label: "Platform",
      children: [
        { href: "/shopify-integration", label: "Shopify Integration" },
        { href: "/fulfillment", label: "Fulfillment" },
      ]
    },
    {
      href: "#",
      label: "Tools",
      children: [
        { href: "/tools", label: "All Tools" },
        { href: "/research-tools", label: "Research Tools" },
      ]
    },
    {
      href: "#",
      label: "Resources",
      children: [
        { href: "/intelligence-hub", label: "Intelligence Hub" },
        { href: "/mentorship", label: "Learn", icon: GraduationCap },
        { href: "/what-is-dropshipping", label: "What is Dropshipping" },
      ]
    },
    { href: "/help-center", label: "Support" },
  ];

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
      className={`fixed top-0 left-0 right-0 z-50 py-3 border-b border-slate-100 ${
        scrolled ? "bg-white/80 backdrop-blur-md shadow-sm" : "bg-white"
      }`}
    >
      <Container>
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: DURATION.normal, delay: 0.1 }}
          >
            <Logo className="text-slate-900" />
          </motion.div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link, index) => {
              if (link.children) {
                return (
                  <DropdownMenu key={link.label}>
                    <DropdownMenuTrigger asChild>
                      <motion.button
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: DURATION.normal, delay: 0.1 + index * 0.05 }}
                        className="text-sm font-medium text-slate-600 relative group flex items-center gap-1 outline-none"
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="h-4 w-4" />
                      </motion.button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48 bg-white/95 backdrop-blur-sm">
                      {link.children.map((child) => (
                        <DropdownMenuItem key={child.href} asChild>
                          <a href={child.href} className="w-full cursor-pointer font-medium text-slate-600 hover:text-blue-600">
                            {child.label}
                          </a>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }

              return (
                <motion.a
                  key={link.href}
                  href={link.href}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATION.normal, delay: 0.1 + index * 0.05 }}
                  className="text-sm font-medium text-slate-600 relative group"
                >
                  <span className="relative z-10 flex items-center gap-1">
                    {link.icon && <link.icon className="h-4 w-4" />}
                    <span>{link.label}</span>
                  </span>
                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    initial={{ scaleX: 0 }}
                    whileHover={{ scaleX: 1 }}
                    transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
                  />
                </motion.a>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: DURATION.fast, ease: EASING.easeOut }}
            >
              <Button variant="ghost" size="md" className="font-semibold text-slate-600">
                Log In
              </Button>
            </motion.div>
            <MotionButton
              variant="glow"
              className="group relative h-10 rounded-md text-sm font-medium text-white cursor-pointer flex items-center gap-2 px-4"
            >
              <span className="absolute inset-0 rounded-md bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600"></span>
              <span className="absolute inset-0 rounded-md bg-gradient-to-b from-white/20 via-transparent to-transparent"></span>
              <span className="relative z-10 flex items-center gap-2">
                <MotionIcon hoverScale={1.1}>
                  <Image 
                    src="/3d-icons/coins.png" 
                    alt="Coins" 
                    width={20} 
                    height={20}
                    decoding="async"
                    className="object-contain"
                  />
                </MotionIcon>
                Claim Free Credits
              </span>
            </MotionButton>
          </div>

          {/* Mobile Menu Button */}
          <motion.button 
            className="md:hidden text-slate-900 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: DURATION.fast }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: DURATION.normal, ease: EASING.easeOut }}
              className="md:hidden border-t border-slate-100 overflow-hidden"
            >
              <nav className="flex flex-col gap-4 pt-4 pb-4">
                {navLinks.map((link, index) => {
                   if (link.children) {
                      return (
                        <div key={link.label} className="flex flex-col gap-2">
                           <div className="text-sm font-medium text-slate-600 px-0 opacity-70">
                             {link.label}
                           </div>
                           <div className="flex flex-col gap-3 pl-4 border-l-2 border-slate-100 ml-1">
                             {link.children.map((child, childIndex) => (
                                <motion.a
                                  key={child.href}
                                  href={child.href}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{
                                    duration: DURATION.normal,
                                    delay: index * 0.05 + childIndex * 0.05,
                                    ease: EASING.easeOut,
                                  }}
                                  className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  {child.label}
                                </motion.a>
                             ))}
                           </div>
                        </div>
                      )
                   }
                   return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{
                        duration: DURATION.normal,
                        delay: index * 0.05,
                        ease: EASING.easeOut,
                      }}
                      className="text-sm font-medium text-slate-600 hover:text-blue-600 flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      {link.label}
                    </motion.a>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
};

"use client"

import { Logo } from '@/components/logo';
import { Facebook, Twitter, Github, Dribbble } from 'lucide-react';

const footerLinks = {
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Our Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
  ],
  product: [
    { label: 'Integration', href: '/integrations' },
    { label: 'Customers', href: '/customers' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Help Center', href: '/help' },
  ],
  legal: [
    { label: 'Terms of Use', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Site Map', href: '/sitemap' },
  ],
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Dribbble, href: '#', label: 'Dribbble' },
];

export const Footer: React.FC = () => {
  return (
    <footer id="footer-3" className="pt-24 pb-12 footer bg-background border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Footer Logo */}
          <div className="col-span-2 md:col-span-1">
            <Logo className="text-foreground mb-4" />
          </div>

          {/* Footer Links - Company */}
          <div>
            <h6 className="text-base font-bold text-foreground mb-4">
              Company
            </h6>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Links - Product */}
          <div>
            <h6 className="text-base font-bold text-foreground mb-4">
              Product
            </h6>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer Links - Legal */}
          <div>
            <h6 className="text-base font-bold text-foreground mb-4">
              Legal
            </h6>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect With Us */}
          <div className="col-span-2 md:col-span-1">
            <h6 className="text-base font-bold text-foreground mb-4">
              Connect With Us
            </h6>
            <p className="text-sm text-muted-foreground mb-4">
              <a href="mailto:hello@usdrop.com" className="hover:text-primary transition-colors">
                hello@usdrop.com
              </a>
            </p>
            <ul className="flex gap-4">
              {socialLinks.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-border mb-8" />

        {/* Bottom Footer */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-muted-foreground">
            © 2024 USDrop. <span>All Rights Reserved</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Made with <span className="text-primary">♥</span> by USDrop Team
          </div>
        </div>
      </div>
    </footer>
  );
};



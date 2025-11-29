import React, { useRef } from 'react';
import { Wand2 } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const card = cardRef.current;
        if (!card) return;
        
        const rect = e.currentTarget.getBoundingClientRect();
        const mouseX_viewport = e.clientX - rect.left;
        const mouseY_viewport = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((mouseY_viewport - centerY) / centerY) * -8;
        const rotateY = ((mouseX_viewport - centerX) / centerX) * 8;
        card.style.setProperty('--rotate-x', `${rotateX}deg`);
        card.style.setProperty('--rotate-y', `${rotateY}deg`);

        const cardRect = card.getBoundingClientRect();
        const mouseX_card = e.clientX - cardRect.left;
        const mouseY_card = e.clientY - cardRect.top;
        card.style.setProperty('--mouse-x', `${(mouseX_card / cardRect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(mouseY_card / cardRect.height) * 100}%`);
    };

    const handleMouseLeave = () => {
        const card = cardRef.current;
        if (card) {
            card.style.setProperty('--rotate-x', '0deg');
            card.style.setProperty('--rotate-y', '0deg');
            card.style.setProperty('--mouse-x', `50%`);
            card.style.setProperty('--mouse-y', `50%`);
        }
    };

    return (
        <div className="fixed inset-0 text-zinc-200 flex flex-col font-sans auth-noise-overlay">
            <div className="auth-aurora"></div>
            <div className="shooting-stars">
                <div className="shooting-star"></div>
                <div className="shooting-star"></div>
                <div className="shooting-star"></div>
            </div>
            <div 
                className="min-h-full flex flex-col items-center justify-center p-4"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                <a href="/" className="mb-8 flex items-center gap-3 group" aria-label="Back to home">
                    <div className="bg-zinc-800/50 group-hover:bg-violet-600/20 p-2 rounded-lg border border-zinc-700/50 group-hover:border-violet-500/30 transition-all duration-300">
                        <Wand2 className="text-zinc-300 group-hover:text-violet-400 transition-colors duration-300" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-400">Virtual Studio</h1>
                </a>

                <div 
                    ref={cardRef}
                    className="w-full max-w-sm animate-float-in interactive-card"
                    style={{
                        transform: 'perspective(1500px) rotateX(var(--rotate-x, 0)) rotateY(var(--rotate-y, 0))',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                     <div className="relative bg-zinc-900/70 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-glass shadow-black/40 p-8 shadow-glass-inset shimmer-border glass-shine-effect">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};
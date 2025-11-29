import React, { useState, useRef, useEffect } from 'react';
import { Shirt, Package, Palette, ImageUp, MoreHorizontal, Images, MessageSquare, Stamp } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { StudioMode } from '../../types';

export const StudioModeSwitcher: React.FC = () => {
    const { studioMode, setStudioMode } = useStudio();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleModeChange = (mode: StudioMode) => {
        setStudioMode(mode);
        setIsDropdownOpen(false);
    };

    const isMoreMenuActive = studioMode === 'design' || studioMode === 'reimagine' || studioMode === 'product-scene-generator' || studioMode === 'photoshoot' || studioMode === 'chat' || studioMode === 'logo-studio';

    return (
        <div ref={dropdownRef} className="relative flex-shrink-0 bg-zinc-900 p-1 rounded-full flex items-center gap-1 border border-zinc-800 shadow-inner-soft">
            <button
                onClick={() => handleModeChange('apparel')}
                className={`flex-1 flex items-center justify-center gap-2 py-1 px-2 lg:px-3 text-sm font-medium rounded-full transition-colors duration-200 h-8
                ${studioMode === 'apparel' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}
            >
                <Shirt size={16} />
                <span className="hidden lg:inline">Apparel</span>
            </button>
            <button
                onClick={() => handleModeChange('product')}
                className={`flex-1 flex items-center justify-center gap-2 py-1 px-2 lg:px-3 text-sm font-medium rounded-full transition-colors duration-200 h-8
                ${studioMode === 'product' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}
            >
                <Package size={16} />
                <span className="hidden lg:inline">Product</span>
            </button>
            
            {/* Dropdown Trigger */}
            <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className={`flex items-center justify-center p-2 rounded-full transition-colors duration-200 h-8 w-8
                ${isMoreMenuActive ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'}`}
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
                aria-label="More modes"
            >
                <MoreHorizontal size={18} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl z-50 p-2 animate-fade-in duration-150">
                     <button
                        onClick={() => handleModeChange('chat')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'chat' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <MessageSquare size={16} />
                        <span>Chat Studio</span>
                    </button>
                    <button
                        onClick={() => handleModeChange('design')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'design' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <Palette size={16} />
                        <span>Design</span>
                    </button>
                    <button
                        onClick={() => handleModeChange('reimagine')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'reimagine' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <ImageUp size={16} />
                        <span>Re-imagine</span>
                    </button>
                     <button
                        onClick={() => handleModeChange('logo-studio')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'logo-studio' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <Stamp size={16} />
                        <span>Logo Studio</span>
                    </button>
                     <button
                        onClick={() => handleModeChange('photoshoot')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'photoshoot' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <Images size={16} />
                        <span>Multipose</span>
                    </button>
                    <button
                        onClick={() => handleModeChange('product-scene-generator')}
                        className={`w-full flex items-center gap-3 p-2 text-sm font-medium rounded-md transition-colors
                        ${studioMode === 'product-scene-generator' ? 'bg-zinc-700 text-white' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'}`}
                    >
                        <Package size={16} />
                        <span>One To Many</span>
                    </button>
                </div>
            )}
        </div>
    );
};
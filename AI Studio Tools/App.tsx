import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useStudio } from './context/StudioContext';
import { InputPanel } from './components/shared/InputPanel';
import { SettingsPanel } from './components/settings/SettingsPanel';
import { StudioView } from './components/studio/StudioView';
import { StudioModeSwitcher } from './components/shared/StudioModeSwitcher';
import { GenerateButton } from './components/shared/GenerateButton';
import { InteractiveGuide } from './components/shared/InteractiveGuide';
import { BestPracticesModal } from './components/shared/BestPracticesModal';
import { PricingModal } from './components/shared/PricingModal';
import { Wand2, User, PanelLeft, PanelRight, ChevronDown, Type, X } from 'lucide-react';
import ProductSceneGenerator from './components/product_scene_generator/ProductSceneGenerator';
import Photoshoot from './components/photoshoot/Photoshoot';
import ChatStudio from './components/chat/ChatStudio';
import LogoStudio from './components/logo_studio/LogoStudio';

const UserMenu: React.FC = () => {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 transition-colors"
                aria-expanded={isOpen}
                aria-haspopup="true"
            >
                <User size={18} />
                <span className="hidden sm:inline text-sm font-medium">Usage</span>
                <ChevronDown size={16} className={`text-zinc-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute left-0 lg:left-auto lg:right-0 mt-2 w-64 bg-zinc-900 border border-white/10 rounded-lg shadow-2xl z-50 p-4 animate-fade-in duration-150">
                     <div className="space-y-3 text-xs text-zinc-400">
                        <div className="flex justify-between items-center">
                            <span>Per-Minute Limit</span>
                            <span className="font-semibold text-zinc-200">10 images / min</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Daily Limit</span>
                            <span className="font-semibold text-zinc-200">100 images</span>
                        </div>
                        <div className="text-center pt-3 border-t border-white/10 mt-3">
                            <p className="font-bold text-zinc-100">
                                Resets every 24 hours
                            </p>
                            <p className="text-zinc-400 mt-1">
                                If you reach limit, use another email
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const AppHeader: React.FC<{
    onInputsClick: () => void;
    onSettingsClick: () => void;
}> = ({ onInputsClick, onSettingsClick }) => {
    const [isPricingModalOpen, setIsPricingModalOpen] = useState(false);

    return (
        <>
            <header className="relative flex-shrink-0 p-2 border-b border-white/10 flex items-center justify-between gap-4 bg-zinc-925/70 backdrop-blur-xl z-40 shadow-lg shadow-black/20">
                {/* --- LEFT GROUP --- */}
                <div className="flex items-center justify-start gap-2 lg:flex-1">
                    {/* Mobile Inputs Button */}
                    <button onClick={onInputsClick} className="flex items-center gap-2 p-2 rounded-lg hover:bg-zinc-800 lg:hidden" aria-label="Open inputs panel">
                        <PanelLeft size={20} />
                        <span className="font-medium text-sm hidden sm:inline">Inputs</span>
                    </button>
                    
                    {/* Moved Mobile Icons */}
                    <div className="flex items-center gap-1 sm:gap-2 lg:hidden">
                        <UserMenu />
                        <button onClick={onSettingsClick} className="p-2 rounded-lg hover:bg-zinc-800 flex items-center gap-2" aria-label="Open settings panel">
                            <span className="font-medium text-sm hidden sm:inline">Settings</span>
                            <PanelRight size={20} />
                        </button>
                    </div>

                    {/* Desktop Logo */}
                    <a href="/" className="hidden lg:flex items-center gap-2" aria-label="Go to dashboard home">
                        <Wand2 size={24} className="text-violet-400" />
                        <h1 className="hidden md:block text-lg font-bold text-zinc-100">Virtual Studio</h1>
                    </a>
                </div>

                {/* --- CENTER GROUP (Absolutely positioned on mobile) --- */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:static lg:left-auto lg:top-auto lg:translate-x-0 lg:translate-y-0 flex items-center gap-4">
                    {/* Desktop Switcher */}
                    <div className="hidden lg:flex justify-center items-center">
                        <StudioModeSwitcher />
                    </div>
                    <div id="generate-button-container">
                        <GenerateButton />
                    </div>
                </div>

                {/* --- RIGHT GROUP --- */}
                <div className="flex items-center justify-end gap-1 sm:gap-2 lg:flex-1">
                    {/* Desktop-only User Menu */}
                    <div className="hidden lg:flex">
                        <UserMenu />
                    </div>
                </div>
            </header>
            <PricingModal isOpen={isPricingModalOpen} onClose={() => setIsPricingModalOpen(false)} />
        </>
    );
};

const CustomPromptModal: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    const { studioMode, apparelControls, updateApparelControl, productControls, updateProductControl, reimagineControls, updateReimagineControl } = useStudio();
    
    if (!isOpen) return null;

    let controls: any;
    let updateControl: (key: any, value: any) => void;

    switch(studioMode) {
        case 'apparel':
            controls = apparelControls;
            updateControl = updateApparelControl;
            break;
        case 'product':
            controls = productControls;
            updateControl = updateProductControl;
            break;
        case 'reimagine':
            controls = reimagineControls;
            updateControl = updateReimagineControl;
            break;
        default:
            return null; // Or some fallback UI, though this should be unreachable if the button logic is correct.
    }

    const customPrompt = controls.customPrompt;
    const setCustomPrompt = (value: string) => {
        updateControl('customPrompt', value);
    };
    
    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-zinc-925/70 backdrop-blur-xl w-full max-w-2xl rounded-xl border border-white/10 shadow-glass shadow-black/40 text-zinc-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Type size={20} className="text-violet-400" />
                        Custom Prompt Override
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors" aria-label="Close custom prompt modal">
                        <X size={22} />
                    </button>
                </div>
                <div className="p-4">
                     <p className="text-sm text-zinc-400 mt-1 mb-3">
                        For advanced users. If filled, this prompt will be used INSTEAD of the settings panel. You must still provide all required input images.
                    </p>
                    <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="e.g., A fashion model wearing a blue t-shirt, standing on a beach at sunset, dramatic lighting, 85mm portrait lens..."
                        rows={4}
                        className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                        aria-label="Custom prompt override"
                    />
                </div>
            </div>
        </div>
    );
};


const AppContent: React.FC = () => {
    const { studioMode, setStudioMode, isGuideActive, isBestPracticesModalOpen, setBestPracticesModalOpen } = useStudio();
    const [activeMobilePanel, setActiveMobilePanel] = useState<'inputs' | 'settings' | null>(null);
    const [isLgSettingsPanelOpen, setLgSettingsPanelOpen] = useState(false);
    const [isCustomPromptModalOpen, setCustomPromptModalOpen] = useState(false);

    const showCustomPromptFeature = studioMode === 'apparel' || studioMode === 'product' || studioMode === 'reimagine';

     useEffect(() => {
        if (!showCustomPromptFeature) {
            setCustomPromptModalOpen(false);
        }
    }, [showCustomPromptFeature, studioMode]);

    useEffect(() => {
        const isPanelOpen = activeMobilePanel !== null;
        if (isPanelOpen) {
            document.documentElement.classList.add('no-scroll');
            document.body.classList.add('no-scroll');
        } else {
            document.documentElement.classList.remove('no-scroll');
            document.body.classList.remove('no-scroll');
        }
        return () => {
             document.documentElement.classList.remove('no-scroll');
             document.body.classList.remove('no-scroll');
        }
    }, [activeMobilePanel]);

    if (studioMode === 'product-scene-generator') {
        return <ProductSceneGenerator onBack={() => setStudioMode('apparel')} />;
    }

    if (studioMode === 'photoshoot') {
        return <Photoshoot onBack={() => setStudioMode('apparel')} />;
    }

    if (studioMode === 'chat') {
        return <ChatStudio onBack={() => setStudioMode('apparel')} />;
    }
    
    if (studioMode === 'logo-studio') {
        return <LogoStudio onBack={() => setStudioMode('apparel')} />;
    }

    return (
        <div className="bg-zinc-950 text-zinc-300 font-sans antialiased h-screen flex flex-col overflow-hidden">
            <AppHeader
                onInputsClick={() => setActiveMobilePanel('inputs')}
                onSettingsClick={() => setActiveMobilePanel('settings')}
            />
            <main className="flex-grow flex-1 flex overflow-hidden relative">
                {/* --- DESKTOP INPUTS PANEL --- */}
                <aside className="w-[380px] flex-shrink-0 hidden lg:flex flex-col border-r border-white/10">
                    <InputPanel onClose={() => {}} />
                </aside>
                
                <section className="min-w-0 flex-1 flex flex-col p-3 gap-3">
                    <div className="flex-grow min-h-0">
                        <StudioView />
                    </div>
                    {showCustomPromptFeature && (
                        <div className="flex-shrink-0 animate-fade-in">
                            <div className="flex justify-center mt-2">
                                <button
                                    onClick={() => setCustomPromptModalOpen(true)}
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800 shadow-inner-soft"
                                >
                                    <Type size={16} />
                                    Custom Prompt Override
                                </button>
                            </div>
                        </div>
                    )}
                </section>
                
                {/* --- XL+ DESKTOP SETTINGS PANEL (PERMANENT) --- */}
                <aside className="w-[420px] flex-shrink-0 hidden xl:flex flex-col border-l border-white/10">
                    <SettingsPanel onClose={() => {}} />
                </aside>

                {/* --- NEW: LG-ONLY SLIDEOUT PANEL --- */}
                {/* Handle to open panel */}
                <div className="hidden lg:block xl:hidden absolute top-1/2 right-0 -translate-y-1/2 z-30 animate-peek-in">
                    <button
                        onClick={() => setLgSettingsPanelOpen(true)}
                        className="group w-8 h-28 flex flex-col items-center justify-center gap-1.5 py-2
                                   bg-zinc-850 hover:bg-zinc-700
                                   border-y border-l border-white/10
                                   rounded-l-lg shadow-lg
                                   transition-colors duration-200
                                   focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                        aria-label="Open settings panel"
                    >
                        <PanelLeft size={16} className="text-zinc-400 group-hover:text-violet-300 transition-colors duration-200"/>
                        <span
                            className="text-xs font-bold uppercase text-zinc-400 group-hover:text-violet-300 transition-colors duration-200"
                            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
                        >
                            Settings
                        </span>
                    </button>
                </div>

                {/* The Panel */}
                <div 
                    className={`
                        absolute top-0 right-0 h-full w-[420px] bg-zinc-925/90 backdrop-blur-xl border-l border-white/10 z-20 
                        transform transition-transform duration-300 ease-in-out 
                        lg:flex xl:hidden flex-col
                        ${isLgSettingsPanelOpen ? 'translate-x-0' : 'translate-x-full'}
                    `}
                >
                    <SettingsPanel onClose={() => setLgSettingsPanelOpen(false)} isMobileView={true} />
                </div>
            </main>

            {/* --- MOBILE FULL-SCREEN PANELS --- */}
            <div className={`fixed inset-0 z-50 bg-zinc-950 transform transition-transform duration-300 ease-in-out lg:hidden ${activeMobilePanel === 'inputs' ? 'translate-x-0' : '-translate-x-full'}`}>
                <InputPanel onClose={() => setActiveMobilePanel(null)} isMobileView={true} />
            </div>

            <div className={`fixed inset-0 z-50 bg-zinc-950 transform transition-transform duration-300 ease-in-out lg:hidden ${activeMobilePanel === 'settings' ? 'translate-x-0' : 'translate-x-full'}`}>
                 <SettingsPanel onClose={() => setActiveMobilePanel(null)} isMobileView={true} />
            </div>

            <CustomPromptModal isOpen={isCustomPromptModalOpen} onClose={() => setCustomPromptModalOpen(false)} />
            {isGuideActive && <InteractiveGuide />}
            <BestPracticesModal isOpen={isBestPracticesModalOpen} onClose={() => setBestPracticesModalOpen(false)} />
        </div>
    );
};

const App: React.FC = () => (
    <AuthProvider>
        <AppContent />
    </AuthProvider>
);

export default App;
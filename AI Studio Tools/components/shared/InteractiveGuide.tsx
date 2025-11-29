import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { X, ArrowLeft, ArrowRight } from 'lucide-react';

const TOUR_STEPS = [
  {
    targetId: 'input-panel-tabs',
    title: '1. Add Inputs',
    description: "Start by selecting your Model and Apparel. You can upload your own, choose from our library, or describe a model with a prompt.",
    position: 'right',
  },
  {
    targetId: 'apparel-uploader-dropzone',
    title: '2. Upload Apparel',
    description: "Drag and drop your clothing items here. Provide a brief description for each item (e.g., 'front view of blue t-shirt') for the best results.",
    position: 'right',
  },
  {
    targetId: 'settings-panel-scene',
    title: '3. Set the Scene',
    description: "Craft the perfect environment for your photoshoot. Pick a background, adjust the lighting, or upload a style reference to guide the mood.",
    position: 'left',
  },
    {
    targetId: 'settings-panel-creative',
    title: '4. Direct the Shoot',
    description: "Fine-tune the details like a real photographer. Adjust the camera angle, pose, model expression, and more.",
    position: 'left',
  },
  {
    targetId: 'generate-button-container',
    title: '5. Generate!',
    description: "Once you're happy with your setup, press Generate to bring your vision to life. The AI will get to work creating your asset.",
    position: 'bottom',
  },
];


interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export const InteractiveGuide: React.FC = () => {
  const { setGuideActive } = useStudio();
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightRect, setHighlightRect] = useState<Rect | null>(null);

  const currentStepConfig = TOUR_STEPS[currentStep];

  useLayoutEffect(() => {
    const calculateRect = () => {
        const targetElement = document.getElementById(currentStepConfig.targetId);
        if (targetElement) {
            // If the target is a <details> element (our SettingSection), force it open
            if (targetElement.tagName.toLowerCase() === 'details' && !targetElement.hasAttribute('open')) {
                targetElement.setAttribute('open', '');
            }
            
            const rect = targetElement.getBoundingClientRect();
            setHighlightRect({
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            });
        }
    };

    // Use a timeout to ensure the UI has settled after a state change (like opening a <details> element)
    const timeoutId = setTimeout(calculateRect, 50);
    window.addEventListener('resize', calculateRect);
    
    return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', calculateRect);
    };
  }, [currentStep, currentStepConfig.targetId]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    setGuideActive(false);
  };
  
  const getTooltipPosition = () => {
    if (!highlightRect) return { top: '-9999px', left: '-9999px', opacity: 0 };
    
    const tooltipWidth = 320; 
    const tooltipHeight = 180;
    const gap = 24;

    let top, left;

    switch(currentStepConfig.position) {
        case 'right':
            top = highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2;
            left = highlightRect.left + highlightRect.width + gap;
            break;
        case 'left':
            top = highlightRect.top + highlightRect.height / 2 - tooltipHeight / 2;
            left = highlightRect.left - tooltipWidth - gap;
            break;
        case 'bottom':
             top = highlightRect.top + highlightRect.height + gap;
             left = highlightRect.left + highlightRect.width / 2 - tooltipWidth / 2;
            break;
        default:
             top = window.innerHeight / 2 - tooltipHeight / 2;
             left = window.innerWidth / 2 - tooltipWidth / 2;
    }
    
    // Clamp values to be within viewport
    top = Math.max(16, Math.min(top, window.innerHeight - tooltipHeight - 16));
    left = Math.max(16, Math.min(left, window.innerWidth - tooltipWidth - 16));

    return { top: `${top}px`, left: `${left}px`, opacity: 1 };
  };

  const arrowClass = `tooltip-arrow tooltip-arrow-${currentStepConfig.position}`;

  return (
    <div className="fixed inset-0 z-[100]">
        {/* Backdrop */}
        <div 
            className="absolute inset-0 bg-black/50 transition-opacity duration-300"
            onClick={handleFinish}
        />
        
        {/* Spotlight & border */}
        {highlightRect && (
            <div
                className="absolute pointer-events-none rounded-xl transition-all duration-300 guide-spotlight"
                style={{
                    top: `${highlightRect.top - 8}px`,
                    left: `${highlightRect.left - 8}px`,
                    width: `${highlightRect.width + 16}px`,
                    height: `${highlightRect.height + 16}px`,
                }}
            />
        )}

        {/* Tooltip */}
         <div 
            className="absolute w-80 bg-zinc-800 p-5 rounded-xl border border-white/10 shadow-glow-lg text-white transition-all duration-300 animate-fade-in"
            style={getTooltipPosition()}
        >
            <div className={arrowClass} />
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-violet-300">{currentStepConfig.title}</h3>
                <span className="text-sm font-medium text-zinc-400">{currentStep + 1} / {TOUR_STEPS.length}</span>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed mb-4">{currentStepConfig.description}</p>
            <div className="flex justify-between items-center">
                <button onClick={handleFinish} className="text-sm text-zinc-400 hover:text-white transition-colors">Skip</button>
                <div className="flex items-center gap-2">
                     <button 
                        onClick={handlePrev} 
                        disabled={currentStep === 0}
                        className="p-2 rounded-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                    </button>
                     <button 
                        onClick={handleNext} 
                        className="flex items-center gap-2 py-2 px-4 rounded-full bg-violet-600 hover:bg-violet-500 font-semibold text-sm transition-colors"
                    >
                        {currentStep === TOUR_STEPS.length - 1 ? 'Finish' : 'Next'}
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
import React from 'react';
import { useStudio } from '../../context/StudioContext';

export const DesignPreview: React.FC = () => {
    const { mockupImage, designImage, designPlacementControls } = useStudio();
    
    // For now, preview only works for the front. A more complex implementation could switch this.
    const activeControls = designPlacementControls.front;
    const activeDesign = designImage;

    if (!mockupImage || !activeDesign) {
        return null;
    }

    const designStyle: React.CSSProperties = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: `
            translateX(-50%) 
            translateY(-50%) 
            translateX(${activeControls.offsetX}%) 
            translateY(${activeControls.offsetY}%) 
            rotate(${activeControls.rotation}deg) 
            scale(${activeControls.scale / 100})
        `,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        transition: 'transform 0.1s linear, opacity 0.2s, filter 0.2s, mix-blend-mode 0.2s',
        opacity: 1 - (designPlacementControls.fabricBlend / 150), // Map 0-100 to 1-~0.33
        mixBlendMode: designPlacementControls.fabricBlend > 65 ? 'multiply' : 'overlay',
        filter: designPlacementControls.wrinkleConform ? 'blur(0.5px)' : 'none',
        willChange: 'transform, opacity, filter', // Performance hint for the browser
    };

    return (
        <div className="absolute inset-0 flex items-center justify-center p-4 animate-fade-in pointer-events-none">
            <div className="relative w-full h-full max-w-full max-h-full">
                <img 
                    src={mockupImage.base64} 
                    alt="Mockup preview" 
                    className="w-full h-full object-contain"
                />
                <div 
                    className="absolute top-0 left-0 w-full h-full"
                    style={{
                        backgroundImage: `url(${activeDesign.base64})`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        ...designStyle,
                    }}
                />
            </div>
        </div>
    );
};

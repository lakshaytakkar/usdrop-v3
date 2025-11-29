import React from 'react';
import { useStudio } from '../../context/StudioContext';

interface LoadingOverlayProps {
    message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    const { cancelCurrentProcess } = useStudio();
    return (
        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-center text-zinc-400 rounded-lg transition-opacity duration-300 z-10 p-4">
          <div className="spinner-orb mb-4"></div>
          <h3 className="text-lg font-semibold text-white">{message || 'Processing your vision...'}</h3>
          <p className="text-sm mt-1 max-w-sm">The AI is creating your asset. This can take a moment, especially for video.</p>
           <button 
                onClick={cancelCurrentProcess}
                className="mt-6 bg-zinc-700/50 hover:bg-zinc-700 text-zinc-300 hover:text-white font-semibold py-2 px-4 rounded-lg text-xs transition-colors duration-200 border border-white/10"
            >
                Cancel
            </button>
        </div>
    );
}
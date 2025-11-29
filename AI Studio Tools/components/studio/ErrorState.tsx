import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';

export const ErrorState: React.FC = () => {
    const { error, clearError, generateAsset, isGenerating } = useStudio();
    const { user, incrementGenerationsUsed } = useAuth();
    
    if (!error) return null;

    const handleRetry = () => {
        // We don't need to clearError() here because generateAsset() does it internally.
        generateAsset(user, incrementGenerationsUsed);
    };

    return (
        <div className="w-full h-full flex items-center justify-center p-4">
             <div 
                className="relative max-w-lg w-full bg-zinc-925/70 backdrop-blur-xl border border-red-500/50 rounded-xl shadow-2xl shadow-black/50 p-6 sm:p-8 text-center animate-fade-in"
                role="alert"
            >
                <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border-2 border-red-500/30 shadow-inner-soft">
                         <AlertTriangle size={32} className="text-red-400" />
                    </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">An Error Occurred</h3>
                <p className="text-sm text-red-300 mb-6 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>
                
                <div className="text-left text-xs text-zinc-400 space-y-2 mb-6">
                    <p className="font-semibold text-zinc-300">Quick Suggestions:</p>
                    <ul className="list-disc list-inside space-y-1">
                        <li>Ensure your uploaded images are clear and well-lit.</li>
                        <li>Try simplifying your prompt or creative settings.</li>
                        <li>If using an uploaded model, try a different image.</li>
                        <li>The AI service may be temporarily busy. Please try again.</li>
                    </ul>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <button 
                        onClick={clearError}
                        className="w-full sm:w-auto bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200 border border-white/10"
                    >
                        Dismiss
                    </button>
                    <button 
                        onClick={handleRetry}
                        disabled={isGenerating}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                    >
                        <RefreshCw size={16} className={isGenerating ? 'animate-spin' : ''} />
                        Try Again
                    </button>
                </div>
            </div>
        </div>
    );
};

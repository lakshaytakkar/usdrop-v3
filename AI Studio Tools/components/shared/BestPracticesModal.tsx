
import React from 'react';
import { X, Lightbulb, CheckCircle2, XCircle } from 'lucide-react';

interface BestPracticesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const PracticeItem: React.FC<{ title: string; description: string; isGood: boolean; }> = ({ title, description, isGood }) => (
    <div className="flex items-start gap-3">
        {isGood 
            ? <CheckCircle2 className="text-green-500 mt-0.5 flex-shrink-0" size={20} />
            : <XCircle className="text-red-500 mt-0.5 flex-shrink-0" size={20} />
        }
        <div>
            <h4 className="font-semibold text-zinc-200">{title}</h4>
            <p className="text-sm text-zinc-400">{description}</p>
        </div>
    </div>
);

export const BestPracticesModal: React.FC<BestPracticesModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-slide-up duration-300"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className="bg-zinc-925/70 backdrop-blur-2xl w-full max-w-4xl rounded-xl border border-white/10 shadow-2xl shadow-black/40 text-zinc-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3">
                        <Lightbulb size={22} className="text-violet-400" />
                        Input Best Practices
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors" aria-label="Close modal">
                        <X size={22} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
                    {/* Model Section */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-zinc-100 border-b border-zinc-700 pb-2">Model Photography</h3>
                        <div className="flex-1 p-4 rounded-lg bg-zinc-850/80 border border-white/10">
                            <h4 className="font-bold text-lg text-green-400 mb-3">Good Examples</h4>
                            <div className="space-y-4">
                               <PracticeItem isGood title="Clear Headshot" description="Well-lit, front-facing, high-resolution photo where the face is clearly visible." />
                               <PracticeItem isGood title="Neutral Expression" description="A calm, neutral expression or soft smile works best for identity preservation." />
                               <PracticeItem isGood title="Simple Background" description="A plain background helps the AI focus on the person, not the environment." />
                            </div>
                        </div>
                         <div className="flex-1 p-4 rounded-lg bg-zinc-850/80 border border-white/10">
                            <h4 className="font-bold text-lg text-red-400 mb-3">Bad Examples</h4>
                            <div className="space-y-4">
                               <PracticeItem isGood={false} title="Low Light / Blurry" description="Poor lighting or motion blur makes it very difficult for the AI to capture facial features accurately." />
                               <PracticeItem isGood={false} title="Face Obstructed" description="Hair, hands, sunglasses, or heavy shadows covering the face will lead to poor results." />
                               <PracticeItem isGood={false} title="Extreme Angles" description="Photos taken from very high, low, or side-on angles can distort features." />
                               <PracticeItem isGood={false} title="Group Photos" description="The AI may get confused about which person to use. Upload a photo of a single person." />
                            </div>
                        </div>
                    </div>

                    {/* Apparel Section */}
                     <div className="flex flex-col gap-4">
                        <h3 className="text-lg font-semibold text-zinc-100 border-b border-zinc-700 pb-2">Apparel Photography</h3>
                        <div className="flex-1 p-4 rounded-lg bg-zinc-850/80 border border-white/10">
                            <h4 className="font-bold text-lg text-green-400 mb-3">Good Examples</h4>
                            <div className="space-y-4">
                               <PracticeItem isGood title="Flat Lay ('Knolling')" description="Garment is laid perfectly flat on a contrasting, neutral background. This is the ideal input." />
                               <PracticeItem isGood title="Even Lighting" description="Bright, even lighting with no harsh shadows ensures the AI sees the true color and texture." />
                               <PracticeItem isGood title="High Resolution" description="A sharp, high-quality photo allows the AI to capture important details like fabric weave and patterns." />
                            </div>
                        </div>
                         <div className="flex-1 p-4 rounded-lg bg-zinc-850/80 border border-white/10">
                            <h4 className="font-bold text-lg text-red-400 mb-3">Bad Examples</h4>
                            <div className="space-y-4">
                               <PracticeItem isGood={false} title="Wrinkled or Folded" description="Wrinkles, folds, or crumpled fabric prevent the AI from understanding the garment's true shape." />
                               <PracticeItem isGood={false} title="On a Hanger/Mannequin" description="While usable, these can distort the shape. A flat lay is always better." />
                               <PracticeItem isGood={false} title="Busy Background" description="A patterned or cluttered background makes it hard for the AI to isolate the apparel item." />
                               <PracticeItem isGood={false} title="Poor Lighting" description="Harsh shadows or low light can hide details and misrepresent the garment's color." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

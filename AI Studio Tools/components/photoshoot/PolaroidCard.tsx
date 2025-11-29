import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertTriangle, Download, RefreshCw } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface PolaroidCardProps {
    imageUrl?: string;
    conceptName: string;
    status: 'pending' | 'done' | 'error';
    error?: string;
    onRetry: () => void;
    onDownload: () => void;
    isHighlighted?: boolean;
}

const PolaroidCard: React.FC<PolaroidCardProps> = ({ imageUrl, conceptName, status, error, onRetry, onDownload, isHighlighted }) => {
    const { t } = useLanguage();
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group"
        >
            <div className="bg-zinc-850 p-2 pb-4 rounded-lg shadow-lg transform transition-transform duration-300 group-hover:-translate-y-2 group-hover:rotate-[-2deg] border border-zinc-800">
                <div className="relative aspect-[4/5] w-full bg-black rounded-sm overflow-hidden flex items-center justify-center text-zinc-500">
                    {status === 'pending' && <Loader2 className="animate-spin text-violet-400" size={32} />}
                    {status === 'error' && <AlertTriangle className="text-red-400" size={32} />}
                    {status === 'done' && imageUrl && <img src={imageUrl} alt={conceptName} className="w-full h-full object-cover" />}
                    
                    {status === 'done' && imageUrl && (
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={onDownload} className="p-2 bg-zinc-900/80 rounded-full text-white hover:bg-zinc-700" aria-label={t('download')}><Download size={16} /></button>
                        </div>
                    )}
                     {status === 'error' && (
                        <div className="absolute top-2 right-2 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={onRetry} className="p-2 bg-zinc-900/80 rounded-full text-white hover:bg-zinc-700" aria-label={t('retry')}><RefreshCw size={16} /></button>
                        </div>
                    )}
                </div>
                <div className="mt-3 px-1">
                    <h3 className="text-zinc-100 font-semibold text-center text-base">{conceptName}</h3>
                    {status === 'error' && <p className="text-xs text-red-400 text-center mt-1">{error}</p>}
                </div>
            </div>
        </motion.div>
    );
};

export default PolaroidCard;
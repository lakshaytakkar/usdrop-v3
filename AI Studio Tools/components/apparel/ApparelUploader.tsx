import React, { useCallback, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Shirt, Sparkles, Loader2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ApparelItemCard } from './ApparelItemCard';
import { AIEnhancements } from '../enhancements/AIEnhancements';

export const ApparelUploader: React.FC = () => {
    const { 
        addApparelItem, 
        removeApparelItem, 
        apparel, 
        updateApparelItemDescription, 
        updateApparelItemCategory,
        reorderApparel,
        suggestAndApplyLayering,
        isSuggestingLayering
    } = useStudio();
    
    const dragIndex = useRef<number | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        acceptedFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    addApparelItem(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        });
    }, [addApparelItem]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
    });

    const handleDragStart = (index: number) => {
        dragIndex.current = index;
    };
    
    const handleDragEnter = (index: number) => {
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        if (dragIndex.current !== null && dragOverIndex !== null && dragIndex.current !== dragOverIndex) {
            reorderApparel(dragIndex.current, dragOverIndex);
        }
        dragIndex.current = null;
        setDragOverIndex(null);
    };

    return (
        <div className="h-full flex flex-col">
            <div {...getRootProps()} id="apparel-uploader-dropzone" className={`flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 mb-4 ${isDragActive ? 'border-violet-500 bg-violet-500/10 shadow-glow-md' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input {...getInputProps()} />
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-colors ${isDragActive ? 'bg-violet-500/20' : 'bg-zinc-800'}`}>
                    <Shirt className={`transition-colors ${isDragActive ? 'text-violet-300' : 'text-zinc-400'}`} size={24} />
                </div>
                <p className="text-zinc-300 text-center font-semibold">
                    {isDragActive ? "Drop images here" : "Add apparel images"}
                </p>
                <p className="text-sm text-zinc-500 mt-1">Drop one or more items</p>
            </div>
            
            <div className="flex items-center justify-between mb-3 px-2">
                <p className="text-xs text-zinc-500 text-left">
                    Drag to reorder layers (inner to outer).
                </p>
                {apparel.length > 1 && (
                    <button 
                        onClick={suggestAndApplyLayering}
                        disabled={isSuggestingLayering}
                        className="flex items-center gap-1.5 text-xs font-semibold text-violet-300 hover:text-violet-200 disabled:opacity-50 disabled:cursor-wait transition-colors"
                    >
                        {isSuggestingLayering ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                        AI Stylist
                    </button>
                )}
            </div>

            <div 
                className="flex-grow overflow-y-auto space-y-3 pr-1"
                onDragLeave={() => setDragOverIndex(null)}
            >
               {apparel.map((item, index) => (
                   <div
                        key={item.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragEnter={() => handleDragEnter(index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => e.preventDefault()}
                        className={`transition-opacity ${dragIndex.current === index ? 'opacity-50' : ''}`}
                   >
                       <ApparelItemCard 
                            item={item} 
                            onRemove={removeApparelItem} 
                            onDescriptionChange={updateApparelItemDescription}
                            onCategoryChange={updateApparelItemCategory}
                        />
                   </div>
               ))}
               {apparel.length > 0 && <AIEnhancements />}
            </div>
        </div>
    );
};
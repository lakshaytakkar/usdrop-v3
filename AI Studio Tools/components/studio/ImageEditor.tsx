
import React, { useState, useRef, useEffect } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Brush, Undo, Trash2, X, Loader2, Wand2, RotateCcw, Sparkles, Shirt } from 'lucide-react';
import { ApparelItem } from '../../types';

export const ImageEditor: React.FC = () => {
    const { 
        generatedImages, 
        activeImageIndex, 
        cancelEditing, 
        applyGenerativeEdit,
        isApplyingEdit,
        error,
        imageBeingEdited,
        revertEdit,
        apparel,
    } = useStudio();

    const imageToEdit = (activeImageIndex !== null && generatedImages) ? generatedImages[activeImageIndex] : null;

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [brushSize, setBrushSize] = useState(40);
    const [editPrompt, setEditPrompt] = useState('');
    const [history, setHistory] = useState<ImageData[]>([]);
    const [selectedApparel, setSelectedApparel] = useState<ApparelItem | null>(null);

    const hasBeenEdited = imageBeingEdited && imageToEdit && imageBeingEdited.original !== imageToEdit;

    const getCanvasContext = () => canvasRef.current?.getContext('2d');

    const handleImageLoad = () => {
        const image = imageRef.current;
        const canvas = canvasRef.current;
        if (image && canvas && image.complete && image.naturalWidth > 0 && image.naturalHeight > 0) {
            const aspectRatio = image.naturalWidth / image.naturalHeight;
            const container = image.parentElement;
            if (container) {
                const containerWidth = container.clientWidth;
                const containerHeight = container.clientHeight;
                
                if (containerWidth === 0 || containerHeight === 0) return;

                let newWidth = containerWidth;
                let newHeight = newWidth / aspectRatio;

                if (newHeight > containerHeight) {
                    newHeight = containerHeight;
                    newWidth = newHeight * aspectRatio;
                }
                
                image.style.width = `${newWidth}px`;
                image.style.height = `${newHeight}px`;

                canvas.width = newWidth;
                canvas.height = newHeight;

                const ctx = getCanvasContext();
                if (ctx) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    if (canvas.width > 0 && canvas.height > 0) {
                        const initialImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                        setHistory([initialImageData]);
                    }
                }
            }
        }
    };
    
    useEffect(() => {
        // Defer the initial call to ensure layout is calculated before reading dimensions.
        const frameId = requestAnimationFrame(handleImageLoad);
        
        window.addEventListener('resize', handleImageLoad);
        return () => {
            window.removeEventListener('resize', handleImageLoad);
            cancelAnimationFrame(frameId);
        };
    }, [imageToEdit]);


    const saveHistory = () => {
        const ctx = getCanvasContext();
        if(ctx && canvasRef.current) {
            const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height);
            setHistory(prev => [...prev, imageData]);
        }
    }

    const handleUndo = () => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const lastState = newHistory[newHistory.length - 1];
            const ctx = getCanvasContext();
            if(ctx) {
                ctx.putImageData(lastState, 0, 0);
            }
            setHistory(newHistory);
        }
    }

    const handleClear = () => {
        const canvas = canvasRef.current;
        const ctx = getCanvasContext();
        if (canvas && ctx && history.length > 0) {
            ctx.putImageData(history[0], 0, 0);
            setHistory([history[0]]);
        }
    };

    const getCoords = (e: React.MouseEvent<HTMLCanvasElement>): { x: number, y: number } | null => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const coords = getCoords(e);
        if (coords) {
            const ctx = getCanvasContext();
            if (ctx) {
                setIsDrawing(true);
                ctx.beginPath();
                ctx.moveTo(coords.x, coords.y);
            }
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const coords = getCoords(e);
        if (coords) {
            const ctx = getCanvasContext();
            if (ctx) {
                ctx.lineWidth = brushSize;
                ctx.lineCap = 'round';
                ctx.strokeStyle = 'white';
                ctx.lineTo(coords.x, coords.y);
                ctx.stroke();
            }
        }
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        const ctx = getCanvasContext();
        if (ctx) {
            ctx.closePath();
            setIsDrawing(false);
            saveHistory();
        }
    };

    const handleSubmit = () => {
        const canvas = canvasRef.current;
        if (canvas && editPrompt.trim()) {
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height;
            const finalCtx = finalCanvas.getContext('2d');
            if (finalCtx) {
                finalCtx.fillStyle = 'black';
                finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                finalCtx.drawImage(canvas, 0, 0);
                const maskBase64 = finalCanvas.toDataURL('image/png');
                applyGenerativeEdit(maskBase64, editPrompt, selectedApparel?.base64);
                handleClear();
            }
        }
    };
    
    const handleApparelSelect = (item: ApparelItem) => {
      if (selectedApparel?.id === item.id) {
        setSelectedApparel(null); // Deselect if clicked again
      } else {
        setSelectedApparel(item);
      }
    };

    if (!imageToEdit) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-lg z-50 flex items-center justify-center p-4 animate-fade-in duration-300">
            <div className="bg-zinc-925/70 backdrop-blur-xl rounded-xl border border-white/10 shadow-glass w-full max-w-6xl h-full max-h-[90vh] flex flex-col shadow-glass-inset">
                {/* Header */}
                <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg sm:text-xl font-bold flex items-center gap-3"><Wand2 size={20} className="text-violet-400" />Generative Edit</h2>
                     <div className="flex items-center gap-2">
                        <button 
                            onClick={revertEdit} 
                            disabled={!hasBeenEdited}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-zinc-300 hover:text-white border border-white/10 shadow-glass-inset"
                            title="Revert to the original image before editing"
                        >
                            <RotateCcw size={16} />
                            <span className="hidden sm:inline">Revert</span>
                        </button>
                        <button onClick={cancelEditing} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow flex flex-col lg:flex-row gap-6 p-4 sm:p-6 min-h-0">
                    {/* Controls */}
                    <div className="w-full lg:w-[340px] flex-shrink-0 flex flex-col space-y-4 overflow-y-auto pr-2">
                        <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/10 shadow-glass-inset">
                            <label htmlFor="edit-prompt" className="text-base font-semibold text-zinc-100">1. Describe your change</label>
                            <p className="text-xs text-zinc-400 mt-1 mb-3">Be specific for the best results.</p>
                            <textarea
                                id="edit-prompt"
                                value={editPrompt}
                                onChange={(e) => setEditPrompt(e.target.value)}
                                placeholder="e.g., place this shirt on the model"
                                rows={3}
                                className="w-full p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                            />
                             <div className="flex flex-wrap gap-2 mt-2">
                                <button onClick={() => setEditPrompt('In the masked area, re-render the anatomy to be anatomically correct and photorealistic.')} className="text-xs bg-zinc-800 text-zinc-200 px-2 py-1 rounded-full hover:bg-zinc-700 flex items-center gap-1 transition-colors border border-white/10 shadow-glass-inset"><Sparkles size={12}/>Fix Anatomy</button>
                                <button onClick={() => setEditPrompt('In the masked area, remove the object and seamlessly fill in the background.')} className="text-xs bg-zinc-800 text-zinc-200 px-2 py-1 rounded-full hover:bg-zinc-700 flex items-center gap-1 transition-colors border border-white/10 shadow-glass-inset"><Sparkles size={12}/>Remove Object</button>
                             </div>
                        </div>

                         <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/10 shadow-glass-inset">
                             <label className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                                <Shirt size={18} /> 2. Use Apparel as Reference
                            </label>
                            <p className="text-xs text-zinc-400 mt-1 mb-3">Optionally, select an apparel item to paint into the masked area.</p>
                            <div className="grid grid-cols-4 gap-2">
                                {apparel.map(item => (
                                    <button 
                                      key={item.id}
                                      onClick={() => handleApparelSelect(item)}
                                      className={`aspect-square rounded-md overflow-hidden transition-all duration-200 border-2 ${selectedApparel?.id === item.id ? 'border-violet-500 scale-105 shadow-lg' : 'border-transparent hover:border-zinc-600'}`}
                                      title={item.description || 'Apparel Item'}
                                    >
                                        <img src={item.base64} alt={item.description || 'Apparel'} className="w-full h-full object-cover"/>
                                    </button>
                                ))}
                                 {apparel.length === 0 && <p className="col-span-4 text-center text-xs text-zinc-500 py-4">No apparel items uploaded.</p>}
                            </div>
                        </div>
                        
                        <div className="p-4 rounded-lg bg-zinc-900/50 border border-white/10 space-y-4 shadow-glass-inset">
                             <label className="text-base font-semibold text-zinc-100 flex items-center gap-2">
                                <Brush size={18} /> 3. Mask Area to Edit
                            </label>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs text-zinc-400">Brush Size</label>
                                    <span className="text-sm font-semibold text-zinc-100">{brushSize}px</span>
                                </div>
                                <input 
                                    type="range"
                                    min="5"
                                    max="80"
                                    value={brushSize}
                                    onChange={e => setBrushSize(parseInt(e.target.value, 10))}
                                    className="w-full"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={handleUndo} disabled={history.length <= 1} className="flex items-center justify-center gap-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-white/10 shadow-glass-inset">
                                    <Undo size={16} /> Undo
                                </button>
                                <button onClick={handleClear} className="flex items-center justify-center gap-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-sm font-semibold transition-colors border border-white/10 shadow-glass-inset">
                                    <Trash2 size={16} /> Clear
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="my-2 p-3 bg-red-900/50 border border-red-500/50 text-red-300 text-sm rounded-lg animate-fade-in">
                                {error}
                            </div>
                        )}

                        <div className="flex-grow"></div>

                        <button
                          onClick={handleSubmit}
                          disabled={isApplyingEdit || !editPrompt.trim()}
                          className="w-full bg-brand-primary disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-5 rounded-lg text-base transition-all duration-200 flex items-center justify-center gap-2 shadow-button-glow hover:shadow-button-glow-hover hover:bg-brand-primary-hover active:scale-[0.98]"
                        >
                            {isApplyingEdit ? <Loader2 size={20} className="animate-spin" /> : <Wand2 size={20} />}
                            {isApplyingEdit ? 'Applying Edit...' : 'Apply Change'}
                        </button>
                    </div>

                    {/* Image Viewer */}
                    <div className="flex-grow bg-black rounded-lg relative flex items-center justify-center overflow-hidden border border-white/10 min-h-[250px] lg:min-h-0">
                        <img 
                            ref={imageRef} 
                            src={imageToEdit} 
                            alt="Image to edit" 
                            className="max-w-full max-h-full object-contain absolute"
                            onLoad={handleImageLoad}
                        />
                        <canvas
                            ref={canvasRef}
                            className="absolute cursor-crosshair"
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={stopDrawing}
                            onMouseLeave={stopDrawing}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
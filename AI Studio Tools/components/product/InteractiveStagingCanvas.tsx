import React, { useState, useRef, useCallback } from 'react';
import { useStudio } from '../../context/StudioContext';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { StagedAsset } from '../../types';

export const InteractiveStagingCanvas: React.FC = () => {
    const { stagedAssets, updateStagedAsset } = useStudio();
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [resizingId, setResizingId] = useState<string | null>(null);
    const canvasRef = useRef<HTMLDivElement>(null);
    const interactionOffset = useRef({ x: 0, y: 0 });

    const handleDragStart = (e: React.MouseEvent<HTMLDivElement>, asset: StagedAsset) => {
        e.preventDefault();
        setDraggingId(asset.id);
        const rect = e.currentTarget.getBoundingClientRect();
        interactionOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    };

    const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>, assetId: string) => {
        e.preventDefault();
        e.stopPropagation();
        setResizingId(assetId);
    };

    const handleInteractionEnd = () => {
        setDraggingId(null);
        setResizingId(null);
    };

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!canvasRef.current) return;
        const canvasRect = canvasRef.current.getBoundingClientRect();
        
        if (draggingId) {
            const asset = stagedAssets.find(a => a.id === draggingId);
            if (!asset) return;

            const assetWidth = canvasRect.width * (asset.scale / 100);
            const assetHeight = canvasRect.height * (asset.scale / 100);

            let newX = e.clientX - canvasRect.left - interactionOffset.current.x;
            let newY = e.clientY - canvasRect.top - interactionOffset.current.y;
            
            const xPercent = ((newX + assetWidth / 2) / canvasRect.width) * 100;
            const yPercent = ((newY + assetHeight / 2) / canvasRect.height) * 100;

            updateStagedAsset(draggingId, { x: xPercent, y: yPercent });

        } else if (resizingId) {
            const asset = stagedAssets.find(a => a.id === resizingId);
            if (!asset) return;

            const assetCenterX = canvasRect.left + canvasRect.width * (asset.x / 100);
            const assetCenterY = canvasRect.top + canvasRect.height * (asset.y / 100);
            
            const dx = e.clientX - assetCenterX;
            const dy = e.clientY - assetCenterY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const newScale = Math.min(100, Math.max(5, (distance * 2 / canvasRect.width) * 100));
            updateStagedAsset(resizingId, { scale: newScale });
        }
    }, [draggingId, resizingId, stagedAssets, updateStagedAsset]);

    const handleLayerChange = (e: React.MouseEvent<HTMLButtonElement>, id: string, direction: 'up' | 'down') => {
        e.stopPropagation();
        const asset = stagedAssets.find(a => a.id === id);
        if (!asset) return;
        const newZ = asset.z + (direction === 'up' ? 1 : -1);
        updateStagedAsset(id, { z: newZ });
    };

    return (
        <div 
            ref={canvasRef}
            onMouseMove={handleMouseMove}
            onMouseUp={handleInteractionEnd}
            onMouseLeave={handleInteractionEnd}
            className="relative w-full aspect-square bg-zinc-800 rounded-lg overflow-hidden border-2 border-zinc-700 shadow-inner"
        >
            {stagedAssets.sort((a, b) => a.z - b.z).map(asset => (
                <div
                    key={asset.id}
                    onMouseDown={(e) => handleDragStart(e, asset)}
                    className="absolute cursor-move group select-none"
                    style={{ 
                        left: `${asset.x}%`, 
                        top: `${asset.y}%`,
                        width: `${asset.scale}%`,
                        height: `${asset.scale}%`,
                        transform: 'translate(-50%, -50%)',
                        zIndex: asset.z,
                    }}
                >
                    <img src={asset.base64} alt={`Asset ${asset.id}`} className="w-full h-full object-contain pointer-events-none" />
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-zinc-900/80 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity z-10">
                        <button onClick={(e) => handleLayerChange(e, asset.id, 'down')} className="p-1 hover:bg-zinc-700 rounded"><ArrowDown size={14} /></button>
                        <button onClick={(e) => handleLayerChange(e, asset.id, 'up')} className="p-1 hover:bg-zinc-700 rounded"><ArrowUp size={14} /></button>
                    </div>
                     <div 
                        onMouseDown={(e) => handleResizeStart(e, asset.id)}
                        className="absolute -right-1 -bottom-1 w-4 h-4 bg-violet-500 rounded-full border-2 border-zinc-900 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    />
                </div>
            ))}
        </div>
    );
};

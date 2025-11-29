import React from 'react';
import { PackagePlus, Lock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { useAuth } from '../../context/AuthContext';

export const FullAssetPackSwitcher: React.FC = () => {
    const { isCompletePack, setIsCompletePack, ecommercePack, isSocialMediaPack } = useStudio();
    const { hasPermission } = useAuth();
    
    const canUsePackshots = hasPermission('packshotMode');
    const isDisabled = !canUsePackshots || ecommercePack !== 'none' || isSocialMediaPack;

    return (
        <div 
            className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-2 relative"
            title={!canUsePackshots ? 'Available on Studio and Brand plans' : ''}
        >
            <fieldset disabled={isDisabled}>
                <div className={`flex items-center justify-between ${isDisabled ? 'opacity-50' : ''}`}>
                    <label 
                        htmlFor="complete-pack-toggle" 
                        className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer"
                    >
                        <PackagePlus size={18} /> Complete Asset Pack
                        {!canUsePackshots && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                    <ToggleSwitch
                        id="complete-pack-toggle"
                        checked={isCompletePack}
                        onChange={setIsCompletePack}
                    />
                </div>
                <p className={`text-xs text-zinc-400 ${isDisabled ? 'opacity-50' : ''}`}>
                    Generates a full set of 8 e-commerce and social media assets in one click.
                </p>
            </fieldset>
            {isDisabled && <div className="absolute inset-0 rounded-lg cursor-not-allowed"></div>}
        </div>
    );
};
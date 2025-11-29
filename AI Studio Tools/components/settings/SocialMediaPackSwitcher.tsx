import React from 'react';
import { Share2, Lock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { useAuth } from '../../context/AuthContext';

export const SocialMediaPackSwitcher: React.FC = () => {
    const { isSocialMediaPack, setIsSocialMediaPack, ecommercePack } = useStudio();
    const { hasPermission } = useAuth();
    
    // Assuming this feature requires the same plan as packshots for now
    const canUseSocialPack = hasPermission('packshotMode');

    return (
        <div 
            className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-2 relative"
            title={!canUseSocialPack ? 'Available on Studio and Brand plans' : ''}
        >
            <fieldset disabled={!canUseSocialPack || ecommercePack !== 'none'}>
                <div className={`flex items-center justify-between ${!canUseSocialPack || ecommercePack !== 'none' ? 'opacity-50' : ''}`}>
                    <label 
                        htmlFor="social-pack-toggle" 
                        className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer"
                    >
                        <Share2 size={18} /> Social Media Pack
                        {!canUseSocialPack && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                    <ToggleSwitch
                        id="social-pack-toggle"
                        checked={isSocialMediaPack}
                        onChange={setIsSocialMediaPack}
                    />
                </div>
                <p className={`text-xs text-zinc-400 ${!canUseSocialPack || ecommercePack !== 'none' ? 'opacity-50' : ''}`}>
                    Generates a set of 4 lifestyle shots in 1:1 and 9:16 aspect ratios.
                </p>
            </fieldset>
            {(!canUseSocialPack || ecommercePack !== 'none') && <div className="absolute inset-0 rounded-lg cursor-not-allowed"></div>}
        </div>
    );
};
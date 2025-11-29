import React from 'react';
import { Package, Lock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ToggleSwitch } from '../shared/ToggleSwitch';
import { useAuth } from '../../context/AuthContext';

export const MockupPackSwitcher: React.FC = () => {
    const { designPlacementControls, updateDesignPlacementControl } = useStudio();
    const { hasPermission } = useAuth();
    
    // Assuming this feature requires the same plan as packshots for now
    const canUsePackshots = hasPermission('packshotMode');
    const { isMockupPackActive } = designPlacementControls;

    return (
        <div 
            className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-2 relative"
            title={!canUsePackshots ? 'Available on Studio and Brand plans' : ''}
        >
            <fieldset disabled={!canUsePackshots}>
                <div className={`flex items-center justify-between ${!canUsePackshots ? 'opacity-50' : ''}`}>
                    <label 
                        htmlFor="mockup-pack-toggle" 
                        className="font-semibold text-zinc-100 flex items-center gap-2 cursor-pointer"
                    >
                        <Package size={18} /> Automated Mockup Pack
                        {!canUsePackshots && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                    <ToggleSwitch
                        id="mockup-pack-toggle"
                        checked={isMockupPackActive}
                        onChange={(checked) => updateDesignPlacementControl('isMockupPackActive', checked)}
                    />
                </div>
                <p className={`text-xs text-zinc-400 ${!canUsePackshots ? 'opacity-50' : ''}`}>
                    Generate a set of 3 essential shots: Front, Angled, and Detail.
                </p>
            </fieldset>
            {!canUsePackshots && <div className="absolute inset-0 rounded-lg cursor-not-allowed"></div>}
        </div>
    );
};
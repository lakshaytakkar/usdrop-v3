import React from 'react';
import { Package, Lock } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { useAuth } from '../../context/AuthContext';
import { PRODUCT_ECOMMERCE_PACKS } from '../../constants';
import type { ProductEcommercePack } from '../../types';

export const ProductEcommercePackSelector: React.FC = () => {
    const { productEcommercePack, setProductEcommercePack } = useStudio();
    const { hasPermission } = useAuth();
    
    const canUsePackshots = hasPermission('packshotMode');
    const packOptions = Object.keys(PRODUCT_ECOMMERCE_PACKS).filter(key => key !== 'none') as ProductEcommercePack[];

    return (
        <div 
            className="p-3 rounded-lg bg-zinc-800/50 border border-white/10 space-y-3 relative"
            title={!canUsePackshots ? 'Available on Studio and Brand plans' : ''}
        >
            <fieldset disabled={!canUsePackshots}>
                <div className={`flex items-center justify-between ${!canUsePackshots ? 'opacity-50' : ''}`}>
                    <label 
                        className="font-semibold text-zinc-100 flex items-center gap-2"
                    >
                        <Package size={18} /> E-commerce Pack
                        {!canUsePackshots && <Lock size={12} className="inline-block ml-1.5 text-violet-400" />}
                    </label>
                </div>
                <p className={`text-xs text-zinc-400 mb-3 ${!canUsePackshots ? 'opacity-50' : ''}`}>
                    Automatically generate a standard set of shots for your product page.
                </p>

                <div className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 border border-zinc-800 shadow-inner-soft flex-wrap">
                    {(['none', ...packOptions] as ProductEcommercePack[]).map(packKey => {
                        const pack = PRODUCT_ECOMMERCE_PACKS[packKey];
                        const name = packKey === 'none' ? 'Off' : pack.name.replace(' Pack', '');
                         return (
                            <button
                                key={packKey}
                                onClick={() => setProductEcommercePack(packKey)}
                                className={`flex-grow px-3 py-1.5 text-xs font-medium rounded-full transition-colors h-8 ${
                                    productEcommercePack === packKey ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                                }`}
                                title={pack.description}
                            >
                                {name}
                            </button>
                        );
                    })}
                </div>
            </fieldset>
             {!canUsePackshots && <div className="absolute inset-0 rounded-lg cursor-not-allowed"></div>}
        </div>
    );
};
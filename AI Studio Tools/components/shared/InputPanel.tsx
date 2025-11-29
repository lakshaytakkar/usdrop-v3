import React, { useState, useEffect } from 'react';
import { User, Shirt, X, Package, Layers, ImageIcon, Sparkles, ImageUp } from 'lucide-react';
import { ModelSelectionPanel } from '../model/ModelSelectionPanel';
import { ApparelUploader } from '../apparel/ApparelUploader';
import { TabButton } from './TabButton';
import { useStudio } from '../../context/StudioContext';
import { ProductUploader } from '../product/ProductUploader';
import { PropsPanel } from '../product/PropsPanel';
import { MockupUploader } from '../design/MockupUploader';
import { DesignUploader } from '../design/DesignUploader';
import { ReimagineUploader } from '../reimagine/ReimagineUploader';
import { StudioModeSwitcher } from './StudioModeSwitcher';

type Tab = 'model' | 'apparel' | 'product' | 'props' | 'mockup' | 'design' | 'reimagine';

interface InputPanelProps {
    onClose: () => void;
    isMobileView?: boolean;
}

export const InputPanel: React.FC<InputPanelProps> = ({ onClose, isMobileView }) => {
    const { studioMode } = useStudio();
    const [activeTab, setActiveTab] = useState<Tab>('model');

    useEffect(() => {
        if (studioMode === 'apparel') {
            setActiveTab('model');
        } else if (studioMode === 'product') {
            setActiveTab('product');
        } else if (studioMode === 'design') {
            setActiveTab('mockup');
        } else if (studioMode === 'reimagine') {
            setActiveTab('reimagine');
        }
    }, [studioMode]);


    const renderTabs = () => {
        switch (studioMode) {
            case 'apparel':
                return (
                    <>
                        <TabButton tabId="model" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<User size={16} />} label="Model" />
                        <TabButton tabId="apparel" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<Shirt size={16} />} label="Apparel" />
                    </>
                );
            case 'product':
                return (
                    <>
                        <TabButton tabId="product" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<Package size={16} />} label="Product" />
                        <TabButton tabId="props" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<Layers size={16} />} label="Props" />
                        <TabButton tabId="model" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<User size={16} />} label="Model" />
                    </>
                );
            case 'design':
                return (
                    <>
                        <TabButton tabId="mockup" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<ImageIcon size={16} />} label="Mockup" />
                        <TabButton tabId="design" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<Sparkles size={16} />} label="Design" />
                    </>
                );
            case 'reimagine':
                return (
                     <TabButton tabId="reimagine" activeTab={activeTab} onClick={(tab) => setActiveTab(tab)} icon={<ImageUp size={16} />} label="Reference Photo" />
                );
            default:
                return null;
        }
    }

    const renderContent = () => {
        switch (activeTab) {
            case 'model': return <ModelSelectionPanel />;
            case 'apparel': return <ApparelUploader />;
            case 'product': return <ProductUploader />;
            case 'props': return <PropsPanel />;
            case 'mockup': return <MockupUploader />;
            case 'design': return <DesignUploader />;
            case 'reimagine': return <ReimagineUploader />;
            default: return null;
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 p-4 border-b border-white/10 flex justify-between items-center">
                 <div className="flex items-center gap-4">
                    {isMobileView && (
                        <button onClick={onClose} className="p-1 -m-1 text-zinc-400 hover:text-white" aria-label="Close panel">
                            <X size={24} />
                        </button>
                    )}
                    <h2 className="text-lg font-bold text-zinc-100">
                        Inputs
                    </h2>
                 </div>
            </div>
            <div className="flex-grow p-4 min-h-0 flex flex-col">
                {isMobileView && (
                    <div className="mb-4">
                        <StudioModeSwitcher />
                    </div>
                )}
                <div id="input-panel-tabs" className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 mb-4 border border-zinc-800 shadow-inner-soft">
                    {renderTabs()}
                </div>
                <div className="flex-grow min-h-0">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};
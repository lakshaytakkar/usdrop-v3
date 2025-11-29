import React, { useState, useEffect, useCallback } from 'react';
import { UploadCloud, Users, TextCursorInput, Star } from 'lucide-react';
import { ModelUploader } from './ModelUploader';
import { ModelLibrary } from './ModelLibrary';
import { TabButton } from '../shared/TabButton';
import { useStudio } from '../../context/StudioContext';
import { ModelPrompter } from './ModelPrompter';
import { MyModelsLibrary } from './MyModelsLibrary';

// New main tab structure
type Tab = 'upload' | 'prompt' | 'models';
// New sub-tab structure for the 'Models' hub
type ModelSource = 'library' | 'my_agency';

export const ModelSelectionPanel: React.FC = () => {
    const [activeTab, setActiveTab] = useState<Tab>('upload');
    const [activeModelSource, setActiveModelSource] = useState<ModelSource>('library');

    const { 
        isBatchMode, 
        uploadedModelImage, 
        promptedModelDescription, 
        selectedModels,
        setUploadedModelImage,
        setSelectedModels,
        setPromptedModelDescription,
    } = useStudio();

    // Effect to handle automatic tab switching when the model source changes externally.
    useEffect(() => {
        if (isBatchMode) {
            setActiveTab('models'); // Batch mode is only for library/agency models
            return;
        }
        
        if (uploadedModelImage) {
            setActiveTab('upload');
        } else if (promptedModelDescription.trim()) {
            setActiveTab('prompt');
        } else if (selectedModels.length > 0) {
            setActiveTab('models');
            // Determine if the selected models are from the library or user's agency
            const isUserSaved = selectedModels.every(m => m.source === 'user-saved');
            setActiveModelSource(isUserSaved ? 'my_agency' : 'library');
        }
    }, [isBatchMode, uploadedModelImage, promptedModelDescription, selectedModels]);


    const handleTabSwitch = useCallback((tabId: Tab) => {
        if (activeTab === tabId) return;

        // Clear state of other model sources when switching main tabs
        if (tabId === 'upload') {
            setSelectedModels([]);
            setPromptedModelDescription('');
        } else if (tabId === 'prompt') {
            setUploadedModelImage(null);
            setSelectedModels([]);
        } else if (tabId === 'models') {
            setUploadedModelImage(null);
            setPromptedModelDescription('');
            // Default to library when clicking the main 'Models' tab, unless there are already selected agency models
            const isUserSaved = selectedModels.every(m => m.source === 'user-saved');
            setActiveModelSource(isUserSaved ? 'my_agency' : 'library');
        }
        
        setActiveTab(tabId);
    }, [activeTab, selectedModels, setUploadedModelImage, setSelectedModels, setPromptedModelDescription]);

    const handleModelSourceSwitch = (sourceId: ModelSource) => {
        if (activeModelSource === sourceId) return;
        // When switching between library and agency, we clear the selection
        // to ensure a clean state, especially when exiting batch mode.
        setSelectedModels([]);
        setActiveModelSource(sourceId);
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 mb-4 border border-zinc-800 shadow-inner-soft">
                <TabButton tabId="upload" activeTab={activeTab} onClick={handleTabSwitch} icon={<UploadCloud size={16} />} label="Upload" disabled={isBatchMode}/>
                <TabButton tabId="prompt" activeTab={activeTab} onClick={handleTabSwitch} icon={<TextCursorInput size={16} />} label="Prompt" disabled={isBatchMode} />
                <TabButton tabId="models" activeTab={activeTab} onClick={handleTabSwitch} icon={<Users size={16} />} label="Models" />
            </div>
            <div className="flex-grow min-h-0 flex flex-col">
                {activeTab === 'upload' && <ModelUploader />}
                {activeTab === 'prompt' && <ModelPrompter />}
                {activeTab === 'models' && (
                    <div className="flex flex-col h-full animate-fade-in">
                        {/* Sub-navigation for Models */}
                        <div className="flex-shrink-0 bg-zinc-850 p-1.5 rounded-full flex items-center gap-1 mb-4 border border-zinc-700 shadow-inner-soft">
                             <TabButton tabId="library" activeTab={activeModelSource} onClick={handleModelSourceSwitch} icon={<Users size={16} />} label="Library" />
                             <TabButton tabId="my_agency" activeTab={activeModelSource} onClick={handleModelSourceSwitch} icon={<Star size={16} />} label="My Agency" />
                        </div>
                        <div className="flex-grow min-h-0">
                            {activeModelSource === 'library' && <ModelLibrary />}
                            {activeModelSource === 'my_agency' && <MyModelsLibrary />}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
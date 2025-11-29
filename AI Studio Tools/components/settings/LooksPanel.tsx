import React, { useState } from 'react';
import { useStudio } from '../../context/StudioContext';
import { Save, Layers, Trash2 } from 'lucide-react';

export const LooksPanel: React.FC = () => {
    const { looks, saveLook, applyLook, deleteLook } = useStudio();
    const [name, setName] = useState('');

    const handleSave = () => {
        if(name.trim()) {
            saveLook(name.trim());
            setName('');
        }
    };

    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="look-name" className="text-sm font-semibold text-zinc-300">Save Current Look</label>
                <p className="text-xs text-zinc-400 mt-1 mb-2">Save all current creative and scene settings as a reusable template.</p>
                <div className="flex gap-2">
                    <input
                        id="look-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., 'Summer Campaign Look'"
                        className="flex-1 p-2.5 rounded-md bg-zinc-850 text-zinc-200 border border-zinc-700 focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500 transition-colors text-sm shadow-inner-soft"
                    />
                    <button
                        onClick={handleSave}
                        disabled={!name.trim()}
                        className="bg-violet-600 hover:bg-violet-500 text-white font-semibold px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Save Look"
                    >
                        <Save size={18} />
                    </button>
                </div>
            </div>

            {looks.length > 0 && (
                <div className="border-t border-zinc-700 pt-4">
                     <h4 className="text-sm font-semibold text-zinc-300 mb-2">My Looks</h4>
                     <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {looks.map(look => (
                            <div key={look.id} className="flex items-center justify-between p-2 rounded-md bg-zinc-800/70 hover:bg-zinc-800 transition-colors">
                                <p className="text-sm text-zinc-200 font-medium truncate pr-2">{look.name}</p>
                                <div className="flex items-center gap-1 flex-shrink-0">
                                     <button onClick={() => applyLook(look.id)} className="p-2 text-zinc-300 hover:text-white hover:bg-zinc-700 rounded-md transition-colors" title="Apply Look">
                                        <Layers size={16} />
                                    </button>
                                    <button onClick={() => deleteLook(look.id)} className="p-2 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 rounded-md transition-colors" title="Delete Look">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                     </div>
                </div>
            )}
        </div>
    );
};

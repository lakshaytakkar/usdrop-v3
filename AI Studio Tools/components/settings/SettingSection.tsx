import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SettingSectionProps {
    id?: string;
    title: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export const SettingSection: React.FC<SettingSectionProps> = ({ id, title, icon, children, defaultOpen = false }) => {
    return (
        <details id={id} className="group" open={defaultOpen}>
            <summary className="flex items-center justify-between p-3 rounded-lg cursor-pointer bg-zinc-850/50 hover:bg-zinc-800/80 transition-colors list-none border border-white/10 shadow-inner-highlight">
                <div className="flex items-center gap-3">
                    <span className="text-violet-400">{icon}</span>
                    <h3 className="font-semibold text-zinc-100">{title}</h3>
                </div>
                <ChevronDown size={20} className="text-zinc-400 group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="py-2">
                {children}
            </div>
        </details>
    );
};
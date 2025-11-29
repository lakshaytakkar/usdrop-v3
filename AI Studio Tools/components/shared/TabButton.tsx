import React from 'react';

interface TabButtonProps<T extends string> {
    tabId: T;
    activeTab: string;
    onClick: (tabId: T) => void;
    icon: React.ReactNode;
    label: string;
    disabled?: boolean;
}

export const TabButton = <T extends string>({ tabId, activeTab, onClick, icon, label, disabled = false }: TabButtonProps<T>) => (
    <button
        onClick={() => !disabled && onClick(tabId)}
        disabled={disabled}
        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900
        ${
            activeTab === tabId
                ? 'bg-zinc-700 text-white'
                : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
        {icon}
        <span>{label}</span>
    </button>
);
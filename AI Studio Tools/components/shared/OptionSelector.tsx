import React from 'react';

interface Option {
    id: string;
    name: string;
    description?: string;
}

interface OptionSelectorProps<T extends Option> {
    label: string;
    options: readonly T[];
    selectedOption: T;
    onSelect: (option: T) => void;
    gridCols?: string;
    className?: string;
    buttonTextSize?: string;
}

export const OptionSelector = <T extends Option>({
    label,
    options,
    selectedOption,
    onSelect,
    gridCols = 'grid-cols-2',
    className = '',
    buttonTextSize = 'text-sm'
}: OptionSelectorProps<T>) => {
    return (
        <div className={`space-y-3 ${className}`}>
            <label className="text-sm font-semibold text-zinc-300">{label}</label>
            <div className={`grid ${gridCols} gap-2`}>
                {options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onSelect(option)}
                        className={`p-2.5 rounded-lg text-center transition-all duration-200 h-12 flex items-center justify-center border ${buttonTextSize} shadow-inner-highlight hover:-translate-y-px
                        ${
                            selectedOption.id === option.id
                                ? 'bg-violet-600 text-white font-semibold border-violet-500 shadow-md shadow-violet-900/40'
                                : 'bg-zinc-850 border-white/10 text-zinc-300 hover:bg-zinc-800 hover:border-white/20'
                        }`}
                        title={option.description}
                    >
                        {option.name}
                    </button>
                ))}
            </div>
        </div>
    );
};
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImageIcon, X } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

export const MockupUploader: React.FC = () => {
    const { mockupImage, setMockupImage } = useStudio();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setMockupImage({
                        id: file.name,
                        name: file.name,
                        base64: event.target.result as string
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setMockupImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false
    });

    if (mockupImage) {
        return (
            <div className="w-full h-full animate-fade-in flex flex-col">
                <p className="text-sm font-medium text-zinc-300 mb-2 flex-shrink-0">Your Mockup</p>
                 <div className="relative group flex-grow rounded-lg overflow-hidden border-2 border-violet-500/50 shadow-lg shadow-violet-900/30 bg-zinc-900 min-h-0">
                    <img src={mockupImage.base64} alt="Mockup preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                            onClick={() => setMockupImage(null)}
                            className="bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100"
                            aria-label="Remove mockup image"
                        >
                            <X size={24} />
                        </button>
                    </div>
                 </div>
            </div>
        )
    }

    return (
        <div className="h-full flex flex-col">
            <div {...getRootProps()} className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${isDragActive ? 'border-violet-500 bg-violet-500/10 shadow-glow-md' : 'border-zinc-700 hover:border-zinc-600'}`}>
                <input {...getInputProps()} />
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-violet-500/20' : 'bg-zinc-800'}`}>
                    <ImageIcon className={`transition-colors ${isDragActive ? 'text-violet-300' : 'text-zinc-400'}`} size={32} />
                </div>
                <p className="text-zinc-100 font-semibold text-center">
                    {isDragActive ? "Drop the mockup here" : "Upload Mockup Image"}
                </p>
                <p className="text-sm text-zinc-400 mt-1">e.g., a blank t-shirt</p>
            </div>
        </div>
    );
};
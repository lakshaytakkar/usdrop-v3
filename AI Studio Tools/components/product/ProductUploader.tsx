import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Package, X, Loader2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { ToggleSwitch } from '../shared/ToggleSwitch';

export const ProductUploader: React.FC = () => {
    const { 
        productImage, 
        setProductImage, 
        productImageCutout, 
        isRemovingBackground,
        isCutout,
        setUseCutout,
        productName,
        setProductName,
        isNamingProduct,
    } = useStudio();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setProductImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setProductImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false
    });

    const activeImage = isCutout ? productImageCutout : productImage;

    if (productImage) {
        return (
            <div className="w-full h-full animate-fade-in flex flex-col">
                <div className="flex-shrink-0">
                     <div className="flex justify-between items-center mb-2">
                        <p className="text-sm font-medium text-zinc-300">Your Uploaded Product</p>
                        {productImageCutout && (
                            <div className="flex items-center gap-2">
                                <label htmlFor="cutout-toggle" className="text-xs font-medium text-zinc-400 cursor-pointer">
                                    {isCutout ? 'Using Cutout' : 'Using Original'}
                                </label>
                                <ToggleSwitch 
                                    id="cutout-toggle"
                                    checked={isCutout}
                                    onChange={setUseCutout}
                                />
                            </div>
                        )}
                    </div>
                     <div className="mb-4">
                        <label htmlFor="product-name" className="text-sm font-medium text-zinc-300">Product Name</label>
                        <div className="relative mt-1">
                            <input 
                                id="product-name"
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="AI is analyzing product..."
                                className="w-full p-2.5 rounded-md bg-zinc-925 text-zinc-300 border border-zinc-700 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 text-sm transition-colors shadow-inner-soft pr-10"
                                disabled={isNamingProduct}
                            />
                            {isNamingProduct && (
                                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                    <Loader2 className="h-5 w-5 text-zinc-400 animate-spin" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex-grow min-h-0 overflow-y-auto pr-1">
                    <div className="relative group rounded-lg overflow-hidden border-2 border-violet-500/50 shadow-lg shadow-violet-900/30 bg-zinc-900 aspect-square mb-4">
                        {activeImage && <img src={activeImage} alt="Product preview" className="absolute inset-0 w-full h-full object-contain" />}
                        {isRemovingBackground && (
                            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center text-zinc-300">
                                <Loader2 size={24} className="animate-spin mb-2" />
                                <span className="text-sm font-semibold">AI is removing background...</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <button 
                                onClick={() => setProductImage(null)}
                                className="bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100"
                                aria-label="Remove uploaded product"
                            >
                                <X size={24} />
                            </button>
                        </div>
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
                    <Package className={`transition-colors ${isDragActive ? 'text-violet-300' : 'text-zinc-400'}`} size={32} />
                </div>
                <p className="text-zinc-100 font-semibold text-center">
                    {isDragActive ? "Drop the product image here" : "Upload Your Product"}
                </p>
                <p className="text-sm text-zinc-400 mt-1">Drag 'n' drop or click to browse</p>
            </div>
        </div>
    );
};
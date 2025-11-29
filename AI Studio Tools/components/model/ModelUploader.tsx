import React, { useCallback, useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { User, X, Camera, Loader2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';

interface CameraModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCapture: (imageB64: string) => void;
}

const CameraModal: React.FC<CameraModalProps> = ({ isOpen, onClose, onCapture }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const startCamera = async () => {
            if (isOpen) {
                setIsLoading(true);
                setError(null);
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ 
                        video: { facingMode: 'user' } 
                    });
                    streamRef.current = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Error accessing camera:", err);
                    setError("Could not access camera. Please check permissions and try again.");
                    setIsLoading(false);
                }
            }
        };

        startCamera();

        return () => {
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(track => track.stop());
                streamRef.current = null;
            }
        };
    }, [isOpen]);

    const handleCanPlay = () => {
        setIsLoading(false);
        if(videoRef.current) {
            videoRef.current.play();
        }
    };

    const handleCaptureClick = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const context = canvas.getContext('2d');
            if (context) {
                // Flip the image horizontally for a mirror effect
                context.translate(canvas.width, 0);
                context.scale(-1, 1);
                context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
                const dataUrl = canvas.toDataURL('image/jpeg');
                onCapture(dataUrl);
            }
        }
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="bg-zinc-925/70 backdrop-blur-2xl w-full max-w-2xl rounded-xl border border-white/10 shadow-glass shadow-black/40 text-zinc-200 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Camera size={20} className="text-violet-400" />
                        Capture Model
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors" aria-label="Close camera">
                        <X size={22} />
                    </button>
                </div>

                <div className="p-4">
                    <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-white/10">
                        <video 
                            ref={videoRef} 
                            onCanPlay={handleCanPlay}
                            className={`w-full h-full object-cover transition-opacity duration-300 -scale-x-100 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                            autoPlay 
                            playsInline
                            muted
                        />
                        {(isLoading || error) && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                {error ? (
                                    <p className="text-red-400">{error}</p>
                                ) : (
                                    <>
                                        <Loader2 size={32} className="animate-spin text-zinc-400 mb-2" />
                                        <p className="text-zinc-400">Starting camera...</p>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-white/10 flex justify-center">
                    <button
                        onClick={handleCaptureClick}
                        disabled={isLoading || !!error}
                        className="group relative inline-flex items-center justify-center h-16 w-16 rounded-full transition-all duration-300 ease-in-out bg-zinc-700 hover:scale-105 active:scale-100 disabled:opacity-50 disabled:cursor-not-allowed border-4 border-zinc-800"
                        aria-label="Capture photo"
                    >
                        <div className="h-full w-full rounded-full bg-white transition-transform duration-200 group-hover:scale-90"></div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export const ModelUploader: React.FC = () => {
    const { setUploadedModelImage, uploadedModelImage } = useStudio();
    const [isCameraOpen, setIsCameraOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setUploadedModelImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setUploadedModelImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false
    });
    
    const handleCapture = (imageB64: string) => {
        setUploadedModelImage(imageB64);
        setIsCameraOpen(false);
    };

    if (uploadedModelImage) {
        return (
            <div className="w-full h-full animate-fade-in flex flex-col">
                <p className="text-sm font-medium text-zinc-300 mb-2 flex-shrink-0">Your Uploaded Model</p>
                 <div className="relative group flex-grow rounded-lg overflow-hidden border-2 border-violet-500/50 shadow-lg shadow-violet-900/30 bg-zinc-900 min-h-0">
                    <img src={uploadedModelImage} alt="Model preview" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <button 
                            onClick={() => setUploadedModelImage(null)}
                            className="bg-red-600/80 hover:bg-red-500 text-white p-3 rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100"
                            aria-label="Remove uploaded model"
                        >
                            <X size={24} />
                        </button>
                    </div>
                 </div>
            </div>
        )
    }

    return (
        <>
            <div className="h-full flex flex-col">
                <div {...getRootProps()} className={`flex-grow flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer transition-all duration-200 ${isDragActive ? 'border-violet-500 bg-violet-500/10 shadow-glow-md' : 'border-zinc-700 hover:border-zinc-600'}`}>
                    <input {...getInputProps()} />
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${isDragActive ? 'bg-violet-500/20' : 'bg-zinc-800'}`}>
                        <User className={`transition-colors ${isDragActive ? 'text-violet-300' : 'text-zinc-400'}`} size={32} />
                    </div>
                    <p className="text-zinc-100 font-semibold text-center">
                        {isDragActive ? "Drop the model image here" : "Upload Your Model"}
                    </p>
                    <p className="text-sm text-zinc-400 mt-1">Drag 'n' drop or click to browse</p>

                    <div className="relative my-4 w-4/5 max-w-xs">
                        <div className="absolute inset-0 flex items-center" aria-hidden="true">
                            <div className="w-full border-t border-zinc-700/80" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-zinc-925 px-2 text-sm text-zinc-500">OR</span>
                        </div>
                    </div>
                    
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsCameraOpen(true);
                        }}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 font-semibold transition-colors border border-white/10 shadow-inner-highlight"
                    >
                        <Camera size={18} />
                        Use Webcam
                    </button>
                </div>
            </div>
            <CameraModal isOpen={isCameraOpen} onClose={() => setIsCameraOpen(false)} onCapture={handleCapture} />
        </>
    );
};
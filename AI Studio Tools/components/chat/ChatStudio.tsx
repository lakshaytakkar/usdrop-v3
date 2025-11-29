import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { ArrowLeft, Bot, ImageIcon, Image as ImageIconSolid, Loader2, Clipboard, Check, Send, ImageUp, X, Plus, Trash2 } from 'lucide-react';
import { useStudio } from '../../context/StudioContext';
import { TabButton } from '../shared/TabButton';
// FIX: Import ChatSession to resolve typing errors.
import type { ChatMessage, ChatSession } from '../../types';

const ReverseEngineerPanel: React.FC = () => {
    const { 
        reverseEngineerImage, 
        setReverseEngineerImage, 
        generateReverseEngineeredPrompt, 
        isGeneratingPrompt,
        generatedPrompt,
        error,
        clearReverseEngineer,
    } = useStudio();
    const [hasCopied, setHasCopied] = useState(false);
    
    useEffect(() => {
        return () => {
            clearReverseEngineer();
        }
    }, [clearReverseEngineer]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            const file = acceptedFiles[0];
            const reader = new FileReader();
            reader.onload = (event: ProgressEvent<FileReader>) => {
                if (event.target?.result) {
                    setReverseEngineerImage(event.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    }, [setReverseEngineerImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpeg', '.png', '.jpg'] },
        multiple: false
    });

    const handleCopy = () => {
        if (generatedPrompt) {
            navigator.clipboard.writeText(generatedPrompt);
            setHasCopied(true);
            setTimeout(() => setHasCopied(false), 2000);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start h-full w-full max-w-5xl">
            <div className="flex flex-col items-center gap-4 h-full">
                <h3 className="font-bold text-xl text-zinc-200 mb-1 w-full text-center">1. Upload an Image</h3>
                <div className="w-full flex-grow min-h-0">
                    {reverseEngineerImage ? (
                        <div className="relative group aspect-[4/5] w-full max-w-sm mx-auto rounded-md overflow-hidden">
                            <img src={reverseEngineerImage} alt="Uploaded" className="w-full h-full object-cover" />
                            <button onClick={() => setReverseEngineerImage(null)} className="absolute top-2 right-2 p-1.5 bg-black/60 rounded-full text-white hover:bg-black/80 transition-opacity opacity-0 group-hover:opacity-100" aria-label="Remove image">
                                <X size={16} />
                            </button>
                        </div>
                    ) : (
                        <div {...getRootProps()} className={`cursor-pointer aspect-[4/5] w-full max-w-sm mx-auto flex flex-col items-center justify-center border-2 border-dashed rounded-lg transition-colors h-full ${isDragActive ? "border-violet-500 bg-violet-500/10" : "border-zinc-700 bg-zinc-900/50 hover:border-zinc-600"}`}>
                            <input {...getInputProps()} />
                            <ImageIconSolid className="h-10 w-10 text-zinc-500 mb-4" strokeWidth={1}/>
                            <span className="text-zinc-400 font-semibold">Drop your image here</span>
                            <span className="text-zinc-500 text-sm mt-1">or click to upload</span>
                        </div>
                    )}
                </div>
            </div>
            <div className="flex flex-col gap-4 h-full">
                <h3 className="font-bold text-xl text-zinc-200 mb-1">2. Generate Prompt</h3>
                <button onClick={generateReverseEngineeredPrompt} disabled={!reverseEngineerImage || isGeneratingPrompt} className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm py-3 px-6 rounded-lg bg-brand-primary hover:bg-brand-primary-hover disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-button-glow">
                    {isGeneratingPrompt ? <Loader2 className="animate-spin" /> : 'Reverse Engineer Prompt'}
                </button>
                <div className="relative flex-grow flex flex-col min-h-0">
                    <textarea
                        readOnly
                        value={generatedPrompt || ''}
                        placeholder={isGeneratingPrompt ? "AI is analyzing your image..." : "Generated prompt will appear here..."}
                        className="w-full flex-grow p-3 rounded-lg bg-zinc-925 text-zinc-300 border border-zinc-700 text-sm shadow-inner-soft resize-none"
                    />
                    {generatedPrompt && (
                        <button onClick={handleCopy} className="absolute top-2 right-2 p-2 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors">
                            {hasCopied ? <Check size={16} className="text-green-400" /> : <Clipboard size={16} />}
                        </button>
                    )}
                </div>
                {error && <div className="p-3 bg-red-900/30 border border-red-500/50 text-red-300 text-sm rounded-md">{error}</div>}
            </div>
        </div>
    );
};

const CreativeDirectorChatPanel: React.FC = () => {
    const { chats, activeChatId, isChatting, sendMessage } = useStudio();
    const [input, setInput] = useState('');
    const [imageToSend, setImageToSend] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const activeChat = activeChatId ? chats[activeChatId] : null;

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [activeChat?.history, isChatting]);
    
    const handleSend = () => {
        if (input.trim() || imageToSend) {
            sendMessage(input, imageToSend);
            setInput('');
            setImageToSend(null);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setImageToSend(event.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
        if(e.target) e.target.value = '';
    };
    
    const handleAttachmentClick = () => {
        fileInputRef.current?.click();
    };

    if (!activeChat) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center text-zinc-500">
                <Bot size={48} className="mb-4 text-zinc-600"/>
                <h3 className="font-bold text-xl text-zinc-300">Welcome to Creative Chat</h3>
                <p className="mt-2 max-w-sm">Start a new conversation from the sidebar or ask me anything to begin!</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full max-w-3xl mx-auto w-full">
            <div className="flex-grow overflow-y-auto pr-2 space-y-6">
                {activeChat.history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1"><Bot size={18} className="text-violet-300"/></div>}
                        <div className={`p-3 rounded-xl max-w-lg ${msg.role === 'user' ? 'bg-zinc-700 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                            {msg.parts.map((part, i) => {
                                if ('inlineData' in part && part.inlineData) {
                                    const { mimeType, data } = part.inlineData;
                                    return <img key={i} src={`data:${mimeType};base64,${data}`} className="rounded-lg max-w-xs mb-2" alt="User upload" />
                                }
                                if ('text' in part && part.text) {
                                    return <p key={i} className="text-sm whitespace-pre-wrap">{part.text}</p>
                                }
                                return null;
                            })}
                        </div>
                    </div>
                ))}
                {/* FIX: Removed invalid call to 'get()'. 'isChatting' is sufficient for the loading state. */}
                {isChatting && (
                     <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-1"><Bot size={18} className="text-violet-300"/></div>
                        <div className="p-3 rounded-xl bg-zinc-800 text-zinc-300">
                           <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0s' }}/>
                               <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}/>
                               <div className="w-2 h-2 bg-zinc-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}/>
                           </div>
                        </div>
                    </div>
                )}
                <div ref={chatEndRef} />
            </div>
            <div className="flex-shrink-0 pt-4 mt-4 border-t border-zinc-800">
                 {imageToSend && (
                    <div className="relative w-24 h-24 mb-3 p-1 bg-zinc-800 rounded-lg border border-zinc-700">
                        <img src={imageToSend} alt="Preview" className="w-full h-full object-cover rounded"/>
                        <button onClick={() => setImageToSend(null)} className="absolute -top-2 -right-2 p-1 bg-zinc-700 rounded-full text-white hover:bg-red-500 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                )}
                <div className="relative">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                    <button onClick={handleAttachmentClick} className="absolute top-1/2 left-2 -translate-y-1/2 p-2 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <ImageUp size={20} />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Ask for creative ideas, or describe your image..."
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-full p-3 pl-12 pr-12 text-sm text-zinc-200 focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition-all"
                    />
                    <button onClick={handleSend} disabled={isChatting || (!input.trim() && !imageToSend)} className="absolute top-1/2 right-2 -translate-y-1/2 p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white disabled:bg-zinc-600 transition-colors">
                        <Send size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}

const ChatHistoryList = () => {
    const { chats, activeChatId, startNewChat, setActiveChat, deleteChat } = useStudio();
    // FIX: Explicitly cast the result of Object.values to ChatSession[] to resolve typing errors.
    const sortedChats = (Object.values(chats) as ChatSession[]).sort((a, b) => b.createdAt - a.createdAt);

    return (
        <div className="flex flex-col flex-grow min-h-0">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-zinc-100">History</h3>
                 <button onClick={startNewChat} className="flex items-center gap-2 px-2 py-1 rounded-md text-sm font-semibold transition-colors bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white">
                    <Plus size={16} /> New Chat
                </button>
            </div>
            <div className="flex-grow overflow-y-auto -mx-2 pr-1 space-y-1">
                {sortedChats.map(chat => (
                    <div key={chat.id} className="group flex items-center justify-between rounded-md pr-1 hover:bg-zinc-800">
                        <button 
                            onClick={() => setActiveChat(chat.id)} 
                            className={`flex-1 text-left px-2 py-1.5 rounded-md text-sm transition-colors truncate ${activeChatId === chat.id ? 'bg-zinc-700 text-white font-semibold' : 'text-zinc-400 hover:text-zinc-100'}`}
                        >
                            {chat.title}
                        </button>
                         <button onClick={() => deleteChat(chat.id)} className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

const ChatAssetLibrary = () => {
    const { chatAssets } = useStudio();
    return (
        <div className="flex-shrink-0 mt-4 border-t border-zinc-700 pt-4">
            <h3 className="font-bold text-zinc-100 mb-2">Asset Library</h3>
            <div className="max-h-48 overflow-y-auto pr-1">
                {chatAssets.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4">Images from your chats will appear here.</p>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {chatAssets.map((asset, index) => (
                            <div key={index} className="aspect-square bg-zinc-800 rounded-md overflow-hidden">
                                <img src={asset} alt={`Asset ${index}`} className="w-full h-full object-cover"/>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


const ChatSidebar: React.FC = () => {
    return (
        <aside className="w-72 flex-shrink-0 bg-zinc-900 border-r border-white/10 p-4 flex flex-col gap-4">
            <ChatHistoryList />
            <ChatAssetLibrary />
        </aside>
    );
};

type ChatTab = 'reverse-engineer' | 'creative-chat';

export default function ChatStudio({ onBack }: { onBack: () => void }) {
    const [activeTab, setActiveTab] = useState<ChatTab>('creative-chat');

    return (
        <div className="bg-zinc-950 text-zinc-200 h-screen w-full flex flex-col font-sans">
             <header className="w-full flex justify-between items-center py-4 mb-2 px-6 border-b border-white/10 flex-shrink-0">
                <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800">
                    <ArrowLeft size={16} /> Back to Tools
                </button>
            </header>
            <div className="flex flex-grow min-h-0">
                {activeTab === 'creative-chat' && <ChatSidebar />}
                <main className="flex-grow flex flex-col items-center p-6">
                    <div className="text-center mb-6">
                        <h2 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 mb-2 flex items-center justify-center gap-4 tracking-tight">
                            Chat Studio
                        </h2>
                        <p className="text-lg text-zinc-400 mt-2">Your creative co-pilot for prompt engineering and brainstorming.</p>
                    </div>
                     <div className="w-full max-w-lg mx-auto mb-8">
                        <div className="flex-shrink-0 bg-zinc-900 p-1.5 rounded-full flex items-center gap-1 border border-zinc-800 shadow-inner-soft">
                            <TabButton tabId="creative-chat" activeTab={activeTab} onClick={() => setActiveTab('creative-chat')} icon={<Bot size={16} />} label="Creative Chat" />
                            <TabButton tabId="reverse-engineer" activeTab={activeTab} onClick={() => setActiveTab('reverse-engineer')} icon={<ImageIcon size={16} />} label="Reverse Engineer" />
                        </div>
                    </div>
                    <div className="w-full flex-grow flex flex-col items-center">
                        {activeTab === 'reverse-engineer' && <ReverseEngineerPanel />}
                        {activeTab === 'creative-chat' && <CreativeDirectorChatPanel />}
                    </div>
                </main>
            </div>
        </div>
    );
}

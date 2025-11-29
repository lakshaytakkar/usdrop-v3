import React, { useState, useEffect, useRef } from 'react';
import { Wand2, ArrowRight, Command } from 'lucide-react';

// --- Reusable Components ---

const LogoMarquee: React.FC = () => (
    <div className="relative w-full overflow-hidden py-12 bg-zinc-950">
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-zinc-950 via-transparent to-zinc-950"></div>
        <div className="flex animate-marquee-infinite">
            {Array(6).fill(["Momentum", "Quantum", "Apex", "Zenith", "Catalyst", "Evolve", "Vertex"]).flat().map((name, index) => (
                <div key={index} className="flex-shrink-0 flex items-center gap-2 mx-8">
                    <Command size={20} className="text-zinc-600" />
                    <span className="font-semibold text-xl text-zinc-600">{name}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- Page Sections (Overhauled) ---

const Header: React.FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 px-4 sm:px-6 py-4 flex items-center justify-between z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/70 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
            <a href="/" className="flex items-center gap-3 group">
                <div className={`p-2 rounded-lg transition-all duration-300 ${scrolled ? 'bg-zinc-800/50 group-hover:bg-violet-600/20 border border-zinc-700/50 group-hover:border-violet-500/30' : 'bg-transparent'}`}>
                    <Wand2 className="text-zinc-300 group-hover:text-violet-400 transition-colors duration-300" size={22} />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-400">Virtual Studio</h1>
            </a>
            <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-300">
                <a href="#features" className="hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            </nav>
            <div className="flex items-center space-x-2">
                <a href="/login.html" className="hidden sm:inline-block px-4 py-2 text-sm font-semibold text-zinc-200 hover:text-white hover:bg-zinc-800 rounded-md transition-colors">Log in</a>
                <a href="/signup.html" className="px-4 py-2 text-sm font-semibold text-white bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-white/10 shadow-glass-inset">Sign up</a>
            </div>
        </header>
    );
};

const HeroSection: React.FC = () => (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center text-center overflow-hidden">
        <video 
            src="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4"
            autoPlay loop muted playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 via-zinc-950/80 to-zinc-950 z-10"></div>
        
        <div className="relative z-20 px-4 animate-float-in">
             <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white to-zinc-400 leading-tight">
                The End of the Photoshoot.
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-lg md:text-xl text-zinc-400">
                Generate world-class, commercially-ready visuals for your brand—on-model, on-product, on-demand.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                <a href="/signup.html" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold text-white rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 shadow-button-glow-pro hover:shadow-button-glow-pro-hover bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 border border-violet-400/50">
                    Start Creating Now
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
                <a href="#features" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold text-zinc-300 hover:text-white bg-zinc-800/50 hover:bg-zinc-800/80 rounded-lg transition-colors border border-white/10">
                    See How It Works
                </a>
            </div>
        </div>
    </section>
);


const ScrollingFeatures: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-step-index') || '0', 10);
                        setActiveStep(index);
                    }
                });
            },
            { rootMargin: '-50% 0px -50% 0px', threshold: 0 }
        );

        const currentRefs = stepRefs.current;
        currentRefs.forEach((ref) => {
            if (ref) observer.observe(ref);
        });

        return () => {
            currentRefs.forEach((ref) => {
                if (ref) observer.unobserve(ref);
            });
        };
    }, []);

    const steps = [
        { title: "Start with any apparel.", description: "Upload a flat-lay or mannequin shot. Our AI instantly understands its form, texture, and style." },
        { title: "Add your model.", description: "Bring your brand to life. Choose from our diverse library of AI models or upload your own for perfect identity preservation." },
        { title: "Direct the scene.", description: "Become the art director. Set the background, master the lighting, and define the mood with professional-grade controls." },
        { title: "Generate infinite variations.", description: "From e-commerce packshots to editorial campaigns, create a universe of on-brand visuals with a single click." }
    ];

    const images = [
        "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1972&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1581338834647-b0fb40704e21?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1551232864-3f0890e58e3b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
        "https://images.unsplash.com/photo-1545291730-faff8ca1d4b0?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3",
    ];

    return (
        <section id="features" className="py-20 sm:py-32">
            <div className="max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-16 md:gap-24">
                <div className="md:sticky top-0 h-screen max-h-[700px] flex items-center">
                    <div className="relative w-full aspect-[4/3] rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl shadow-black/50 overflow-hidden">
                        {images.map((src, index) => (
                            <img
                                key={src}
                                src={src}
                                alt={`Feature step ${index + 1}`}
                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${activeStep === index ? 'opacity-100' : 'opacity-0'}`}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    <div className="space-y-32">
                        {steps.map((step, index) => (
                            <div key={index} ref={el => { stepRefs.current[index] = el; }} data-step-index={index} className="min-h-[25vh]">
                                <h3 className="text-3xl sm:text-4xl font-bold text-white transition-opacity duration-500">{step.title}</h3>
                                <p className="mt-4 text-lg text-zinc-400 transition-opacity duration-500">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};


const HowItWorksSection: React.FC = () => (
    <section id="how-it-works" className="py-20 sm:py-28 px-4 bg-zinc-950">
        <div className="max-w-5xl mx-auto">
            <div className="text-center">
                <h2 className="text-4xl sm:text-5xl font-bold text-white">Three Studios. One Workflow.</h2>
                <p className="max-w-2xl mx-auto mt-4 text-lg text-zinc-400">
                    Whether you're shooting apparel, products, or designs, the process is simple and powerful.
                </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mt-16 text-center">
                <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10 animate-slide-up">
                    <div className="inline-block text-3xl mb-4">1.</div>
                    <h3 className="font-bold text-xl text-white">Upload Your Assets</h3>
                    <p className="mt-2 text-zinc-400">Provide your base content—a model photo, a product shot on a white background, or a blank apparel mockup and a design file.</p>
                </div>
                 <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10 animate-slide-up" style={{ animationDelay: '200ms' }}>
                    <div className="inline-block text-3xl mb-4">2.</div>
                    <h3 className="font-bold text-xl text-white">Direct the Shoot</h3>
                    <p className="mt-2 text-zinc-400">Use our intuitive controls to set the scene, lighting, camera angles, and overall style to match your brand's aesthetic.</p>
                </div>
                 <div className="p-8 bg-zinc-900 rounded-2xl border border-white/10 animate-slide-up" style={{ animationDelay: '400ms' }}>
                    <div className="inline-block text-3xl mb-4">3.</div>
                    <h3 className="font-bold text-xl text-white">Generate Your Visuals</h3>
                    <p className="mt-2 text-zinc-400">Bring your vision to life. Create single images, entire e-commerce packshots, or dynamic video clips in seconds.</p>
                </div>
            </div>
        </div>
    </section>
);


const FAQItem: React.FC<{ q: string, a: string }> = ({ q, a }) => {
    return (
        <details className="group border-b border-zinc-800 py-4">
            <summary className="flex justify-between items-center text-left cursor-pointer list-none">
                <h4 className="text-lg font-medium text-zinc-100">{q}</h4>
                <div className="relative w-6 h-6 flex items-center justify-center transition-transform duration-300 group-open:rotate-45">
                   <span className="absolute h-px w-4 bg-zinc-400"></span>
                   <span className="absolute h-px w-4 bg-zinc-400 rotate-90"></span>
                </div>
            </summary>
            <p className="mt-4 text-zinc-400 leading-relaxed animate-fade-in">{a}</p>
        </details>
    );
};


const FAQSection: React.FC = () => (
    <section id="faq" className="py-20 sm:py-28 px-4 bg-black">
        <div className="max-w-3xl mx-auto">
             <div className="text-center">
                <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
            </div>
            <div className="mt-12">
                <FAQItem 
                    q="What is the AI Virtual Photoshoot Studio?" 
                    a="It's an all-in-one platform that uses generative AI to create high-quality, professional photos for your brand. You can generate on-model photos for apparel, place products in virtual scenes, and create realistic design mockups without needing a physical studio, cameras, or models."
                />
                <FAQItem 
                    q="Can I use the generated images commercially?" 
                    a="Yes, all images you generate with your subscription can be used for any commercial purpose, including e-commerce stores, marketing campaigns, social media, and advertising."
                />
                 <FAQItem 
                    q="Can I use my own models or products?" 
                    a="Absolutely. The 'Apparel' mode is designed for you to upload a photo of your own model for a true-to-brand virtual try-on experience. Similarly, 'Product' and 'Design' modes start with you uploading your own product or apparel mockup."
                />
                  <FAQItem 
                    q="How realistic are the results?" 
                    a="Our platform is powered by a state-of-the-art AI model fine-tuned for photorealism. It excels at creating natural lighting, shadows, fabric textures, and preserving human identity, resulting in images that are often indistinguishable from real photos."
                />
            </div>
        </div>
    </section>
);

const Footer: React.FC = () => (
    <footer className="bg-zinc-950 px-4 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white">Ready to change how you create?</h2>
            <p className="max-w-xl mx-auto mt-4 text-lg text-zinc-400">
                Stop shooting, start creating. Join the brands building the future of visual content.
            </p>
             <div className="mt-10">
                <a href="/signup.html" className="group relative inline-flex items-center justify-center gap-2 h-12 px-8 text-base font-semibold text-white rounded-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-100 shadow-button-glow-pro hover:shadow-button-glow-pro-hover bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 border border-violet-400/50">
                    Get Started for Free
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </a>
            </div>
        </div>
         <div className="max-w-6xl mx-auto mt-24 border-t border-zinc-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-zinc-500">
            <p>&copy; {new Date().getFullYear()} Virtual Studio Inc. All rights reserved.</p>
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                 <a href="#" className="hover:text-zinc-300 transition-colors">Terms</a>
                 <a href="#" className="hover:text-zinc-300 transition-colors">Privacy</a>
            </div>
        </div>
    </footer>
);


export const LandingPage: React.FC = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, { threshold: 0.1 });

        const elements = document.querySelectorAll('.animate-fade-in, .animate-slide-up');
        elements.forEach(el => observer.observe(el));

        const currentElements = Array.from(elements);
        return () => currentElements.forEach(el => {
            if (el) observer.unobserve(el);
        });
    }, []);
    
    return (
        <div className="bg-black text-zinc-100 font-sans antialiased">
            <Header />
            <main>
                <HeroSection />
                <LogoMarquee />
                <ScrollingFeatures />
                <HowItWorksSection />
                <FAQSection />
            </main>
            <Footer />
        </div>
    );
};

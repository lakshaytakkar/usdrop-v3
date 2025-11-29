
import React, { useState } from 'react';
import { AuthLayout } from './AuthLayout';
import { User, Mail, Lock, Loader2, CheckCircle2 } from 'lucide-react';
import { authService } from '../../services/authService';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.618-3.499-11.188-8.261l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.088,5.571l6.19,5.238C43.021,36.258,44,34,44,30C44,22.659,43.862,21.35,43.611,20.083z"></path>
    </svg>
);

export const SignupPage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const { error } = await authService.signUp(email, password);
            if (error) throw error;
            setSuccess(true);
        } catch (err: any) {
            setError(err.message || 'Failed to create account.');
        } finally {
            setLoading(false);
        }
    };
    
    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError(null);
        const { error } = await authService.signInWithGoogle();
        if (error) {
            setError(error.message);
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-8 animate-fade-in delay-100">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-zinc-100 to-zinc-400">Create your account</h2>
                <p className="text-sm text-zinc-400 mt-2">Start your AI-powered creative journey.</p>
            </div>
             <div className="space-y-6">
                <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading || success}
                    className="w-full flex justify-center items-center gap-3 bg-white hover:bg-zinc-200 text-zinc-800 font-semibold py-3 px-5 rounded-lg transition-colors border border-zinc-300 animate-fade-in disabled:opacity-70 delay-200"
                >
                    <GoogleIcon />
                    Continue with Google
                </button>

                <div className="relative my-2 animate-fade-in delay-300">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-700/50"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-zinc-900/70 px-2 text-zinc-400 backdrop-blur-sm">OR</span>
                    </div>
                </div>

                {success ? (
                    <div className="p-4 text-center bg-green-900/50 border border-green-500/30 rounded-lg animate-fade-in">
                        <CheckCircle2 className="mx-auto mb-2 text-green-400" size={32} />
                        <h3 className="font-bold text-white">Success!</h3>
                        <p className="text-sm text-green-300">Please check your email to verify your account.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="relative group animate-fade-in delay-[400ms]">
                            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                className="w-full p-3 pl-11 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-700/80 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors shadow-inner-soft placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="relative group animate-fade-in delay-500">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                            <input
                                type="email"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full p-3 pl-11 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-700/80 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors shadow-inner-soft placeholder:text-zinc-500"
                            />
                        </div>
                        <div className="relative group animate-fade-in delay-[600ms]">
                            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-violet-400 transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full p-3 pl-11 rounded-lg bg-zinc-900 text-zinc-200 border border-zinc-700/80 focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-colors shadow-inner-soft placeholder:text-zinc-500"
                            />
                        </div>
                        
                        {error && <p className="text-sm text-red-400 bg-red-500/10 p-3 rounded-md border border-red-500/20">{error}</p>}

                        <div className="pt-2 animate-fade-in delay-700">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-primary text-white font-semibold py-3 px-5 rounded-lg transition-all duration-300 shadow-button-glow-pro hover:shadow-button-glow-pro-hover bg-gradient-to-br from-violet-500 to-violet-600 hover:from-violet-400 hover:to-violet-500 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] border border-violet-400/50 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
                            </button>
                        </div>
                    </form>
                )}
            </div>


            <p className="text-center text-sm text-zinc-400 mt-8 animate-fade-in delay-[800ms]">
                Already have an account?{' '}
                <a href="./login.html" className="font-bold text-violet-400 hover:text-violet-300 transition-colors">
                    Sign in
                </a>
            </p>
        </AuthLayout>
    );
};

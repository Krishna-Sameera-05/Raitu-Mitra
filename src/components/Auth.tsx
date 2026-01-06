import React, { useState } from 'react';
import { authAPI } from '../lib/api';
import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';

interface AuthProps {
    role: 'farmer' | 'landowner' | 'admin';
    onSuccess: (authenticatedRole: 'farmer' | 'landowner' | 'admin') => void;
    onBack: () => void;
}

export default function Auth({ role, onSuccess, onBack }: AuthProps) {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);

    const roleTitles = {
        farmer: 'Farmer Portal',
        landowner: 'Landowner Portal',
        admin: 'Admin Control'
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Security Check for Admin
        if (role === 'admin') {
            if (email !== 'a@gmail.com') {
                setError('Access Restricted: Invalid Admin ID');
                setLoading(false);
                return;
            }
        }

        try {
            if (isLogin) {
                // Login with MongoDB backend
                const response = await authAPI.login(email, password, role);

                if (response.success) {
                    onSuccess(role);
                } else {
                    setError(response.message || 'Login failed');
                }
            } else {
                // Signup with MongoDB backend
                if (!fullName.trim()) {
                    setError('Please enter your full name');
                    setLoading(false);
                    return;
                }

                const response = await authAPI.signup(fullName, email, password, role);

                if (response.success) {
                    onSuccess(role);
                } else {
                    setError(response.message || 'Signup failed');
                }
            }
        } catch (err: any) {
            console.error('Auth error:', err);
            setError(err.message || 'An error occurred during authentication');
        } finally {
            setLoading(false);
        }
    };

    // Glass style definitions
    const inputClass = "block w-full pl-10 pr-3 py-3 border border-white/40 rounded-xl leading-5 bg-white/50 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white/80 focus:border-transparent transition-all sm:text-sm backdrop-blur-sm";
    const cardClass = "bg-white/30 backdrop-blur-lg rounded-3xl shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 md:p-10 border border-white/40 relative z-10";

    return (
        <div
            className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-cover bg-center bg-no-repeat"
            style={
                role === 'farmer' ? { backgroundImage: "url('/farmer_bg.jpg')" } :
                    role === 'landowner' ? { backgroundImage: "url('/landowner_bg.jpg')" } :
                        { backgroundImage: "url('/admin_bg.jpg')" }
            }
        >
            {/* Overlay for better contrast */}
            <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px] z-0"></div>

            <div className="max-w-md w-full relative z-10">
                <div className={cardClass}>
                    <button
                        onClick={onBack}
                        className="flex items-center space-x-2 px-4 py-2 mb-6 rounded-lg transition-all group shadow-sm hover:shadow-md bg-white/60 hover:bg-white/80 text-gray-800 border border-white/50"
                    >
                        <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-semibold text-sm">Back to Home</span>
                    </button>

                    <div className="flex flex-col items-center mb-8">
                        <img src="/logo.jpg" alt="Logo" className="w-24 h-24 mb-4 rounded-full object-cover shadow-lg border-2 border-white" />
                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-900 drop-shadow-sm mb-1">{roleTitles[role]}</h2>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight drop-shadow-sm">RAITU MITRA</h1>
                        <p className="mt-2 text-center text-gray-800 font-medium">
                            {role === 'admin' ? 'Secure Admin Login' : (isLogin ? `Sign in to your ${role} account` : `Register as a ${role}`)}
                        </p>
                    </div>

                    <form onSubmit={handleAuth} className="space-y-5">
                        {!isLogin && (
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-600 group-focus-within:text-green-500 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className={inputClass}
                                    placeholder="Full Name"
                                />
                            </div>
                        )}

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gray-600 group-focus-within:text-green-500 transition-colors" />
                            </div>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={inputClass}
                                placeholder="Email address"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Lock className="h-5 w-5 text-gray-600 group-focus-within:text-green-500 transition-colors" />
                            </div>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                placeholder="Password"
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm bg-red-50/90 p-3 rounded-lg border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all active:scale-95 disabled:opacity-70"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    {role !== 'admin' && (
                        <p className="mt-8 text-center text-sm text-gray-900 font-medium">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
                            <button
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-bold text-green-700 hover:text-green-600 underline-offset-4 hover:underline transition-all"
                            >
                                {isLogin ? 'Sign up for free' : 'Go to login'}
                            </button>
                        </p>
                    )}
                </div>

                {/* Footer info */}
                <p className="mt-8 text-center text-white/90 text-xs font-medium drop-shadow-md">
                    © 2026 RAITU MITRA. Empowering sustainable farming.
                </p>
            </div>
        </div>
    );
}

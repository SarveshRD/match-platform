
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Loader2, Heart, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SUPPORTED_REGIONS } from '../lib/constants';

const schema = z.object({
    email: z.string().email(),
});


export default function Login() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
        resolver: zodResolver(schema),
    });

    const onSubmit = async ({ email }: { email: string }) => {
        setLoading(true);
        // Use the current domain (origin) ensures we redirect back to the correct Vercel deployment
        const redirectTo = window.location.origin;
        console.log("Redirecting to:", redirectTo);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: redirectTo,
            }
        });
        setLoading(false);
        if (error) {
            alert(error.message);
        } else {
            setSent(true);
        }
    };

    return (
        <div className="min-h-screen w-full bg-black text-white relative flex flex-col items-center overflow-x-hidden">
            {/* Background Gradients */}
            <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black opacity-80 -z-10" />
            <div className="fixed top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[120px] pointer-events-none -z-10" />

            {/* Hero / Login Section */}
            <div className="w-full min-h-screen flex flex-col items-center justify-center p-4">
                <div className="z-10 w-full max-w-md p-8 glass-dark rounded-2xl border border-white/10 my-10 animate-fade-in-up">
                    <div className="flex justify-center mb-6">
                        <div className="p-3 bg-primary/20 rounded-full shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                            <Heart className="w-8 h-8 text-primary fill-primary" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                        Elite Matchmaking
                    </h1>
                    <p className="text-center text-gray-400 mb-8 text-sm">
                        Connecting Indian Gentlemen with Eligible Ladies from specific global regions.
                    </p>

                    {sent ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <Sparkles className="w-12 h-12 text-yellow-500 animate-pulse" />
                            </div>
                            <p className="text-white">Check your email for the magic link.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <input
                                    {...register('email')}
                                    type="email"
                                    placeholder="Enter your email"
                                    className={cn(
                                        "w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all",
                                        errors.email && "border-red-500 focus:ring-red-500"
                                    )}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-primary to-rose-600 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center disabled:opacity-50 shadow-[0_0_20px_-5px_rgba(236,72,153,0.7)]"
                            >
                                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Sign In with Email"}
                            </button>
                        </form>
                    )}
                </div>

                <div className="animate-bounce mt-10">
                    <span className="text-xs text-gray-500">Explore Our Network ↓</span>
                </div>
            </div>

            {/* Global Network Section */}
            <div className="w-full max-w-6xl mx-auto p-8 pb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-500 mb-4">
                        Exclusive Global Network
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        We are a niche platform dedicted to creating cross-border stories.
                        Our female members are exclusively from these select regions, looking for connections in India.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {SUPPORTED_REGIONS.map((c) => (
                        <div key={c.name} className="group relative h-64 rounded-2xl overflow-hidden border border-white/10 cursor-pointer hover:border-primary/50 transition-colors">
                            <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 w-full p-4">
                                <div className="text-4xl mb-2 filter drop-shadow-lg">{c.flag}</div>
                                <h3 className="text-xl font-bold text-white group-hover:text-primary transition-colors">{c.name}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="py-8 text-xs text-gray-600 text-center w-full border-t border-white/5">
                <p>By entering, you agree to our Terms & Privacy Policy.</p>
            </div>
        </div>
    );
}


import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Check } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function Premium() {
    const { user, profile } = useAuth();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, []);

    const handlePayment = async () => {
        setLoading(true);

        const options = {
            key: "rzp_test_placeholder", // Placeholder key, user must replace
            amount: 200, // ₹2.00 in paise
            currency: "INR",
            name: "Elite Matchmaking",
            description: "Premium Membership",
            image: "https://ui.aceternity.com/_next/image?url=%2Fimages%2Fproducts%2Fthumbnails%2Fnew%2Fcursor.png&w=640&q=75",
            handler: async function (response: any) {
                // Verify payment here via backend function ideally.
                // For demo: Trust client (INSECURE - for hackathon only)
                if (response.razorpay_payment_id) {
                    await supabase.from('profiles').update({ is_premium: true }).eq('id', user?.id);
                    alert("Upgrade Successful! Welcome to Premium.");
                    window.location.href = '/';
                }
            },
            prefill: {
                name: profile?.name,
                email: user?.email,
                contact: "9999999999"
            },
            theme: {
                color: "#e11d48"
            }
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-black text-white p-6 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20 pointer-events-none" />

            <div className="z-10 max-w-sm w-full glass-dark border border-yellow-500/30 rounded-3xl p-8 text-center relative overflow-hidden">
                {/* Shine effect */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-yellow-500/20 blur-[50px] rounded-full" />

                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-600 mb-2">Elite Premium</h1>
                <p className="text-yellow-500/80 mb-8 font-medium">Unlock the full experience</p>

                <div className="space-y-4 text-left mb-8">
                    <Feature text="Unlimited Messages" />
                    <Feature text="See Who Viewed You" />
                    <Feature text="Send Photos in Chat" />
                    <Feature text="Priority Matching" />
                    <Feature text="Access Exclusive Profiles" />
                </div>

                <div className="text-4xl font-bold text-white mb-2">₹2 <span className="text-sm font-normal text-gray-400">/ lifetime</span></div>

                <button
                    onClick={handlePayment}
                    disabled={loading || profile?.is_premium}
                    className="w-full bg-gradient-to-r from-yellow-600 to-yellow-400 text-black font-bold py-4 rounded-xl shadow-lg hover:scale-105 transition-transform disabled:opacity-50 disabled:grayscale"
                >
                    {profile?.is_premium ? "Active Member" : loading ? "Processing..." : "Upgrade Now"}
                </button>
            </div>

            <button onClick={() => navigate('/')} className="mt-8 text-gray-500 hover:text-white z-10 underline">No thanks, maybe later</button>
        </div>
    );
}

function Feature({ text }: { text: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="p-1 bg-yellow-500/20 rounded-full">
                <Check className="w-4 h-4 text-yellow-500" />
            </div>
            <span className="text-gray-300">{text}</span>
        </div>
    );
}

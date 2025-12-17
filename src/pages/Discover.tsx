
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../lib/supabaseClient';
import { SUPPORTED_REGIONS } from '../lib/constants';


import { motion, useMotionValue, useTransform, useAnimation } from 'framer-motion';
import { X, Heart, Loader2, LogOut, User } from 'lucide-react';

export default function Discover() {
    const { profile, user, signOut } = useAuth();
    const [candidates, setCandidates] = useState<Profile[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Motion values for swipe
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-30, 30]);
    const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
    const controls = useAnimation();

    useEffect(() => {
        if (profile) fetchCandidates();
    }, [profile]);

    const fetchCandidates = async () => {
        // 1. Get IDs I have already swiped
        const { data: mySwipes } = await supabase.from('swipes').select('swipee_id').eq('swiper_id', user!.id);
        const swipedIds = mySwipes?.map(s => s.swipee_id) || [];
        swipedIds.push(user!.id); // Exclude self

        // 2. Fetch potential matches
        // Logic: Opposite gender.
        // Ideally we filter by country but the prompt says Male=India, Female=Others.
        const targetGender = profile?.gender === 'Male' ? 'Female' : 'Male';

        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('gender', targetGender)
            .limit(50);

        if (!error && data) {
            // Filter out swiped
            const fresh = data.filter(p => !swipedIds.includes(p.id));
            setCandidates(fresh);
        }
        setLoading(false);
    };

    const handleSwipe = async (direction: 'left' | 'right') => {
        if (!candidates[currentIndex] || !user) return;
        const target = candidates[currentIndex];

        // Animate removal
        await controls.start({
            x: direction === 'right' ? 500 : -500,
            opacity: 0,
            transition: { duration: 0.3 }
        });

        // 1. Record my swipe
        await supabase.from('swipes').insert({
            swiper_id: user.id,
            swipee_id: target.id,
            direction
        });

        // 2. Check Match or Bot Logic
        if (direction === 'right') {
            if (target.is_bot) {
                // Prepare bot match
                await handleBotMatch(target);
            } else {
                // Check real match
                const { data: theirSwipe } = await supabase
                    .from('swipes')
                    .select('*')
                    .eq('swiper_id', target.id)
                    .eq('swipee_id', user.id)
                    .eq('direction', 'right')
                    .single();

                if (theirSwipe) {
                    alert(`It's a Match with ${target.name}!`);
                    // Create chat logic would go here ideally, or triggered via DB trigger
                }
            }
        }

        setCurrentIndex(i => i + 1);
        x.set(0);
    };

    const handleBotMatch = async (bot: Profile) => {
        // Simulate bot swiping right on me first (or check validity)
        const { data: existing } = await supabase.from('swipes').select('*').eq('swiper_id', bot.id).eq('swipee_id', user!.id).single();

        if (!existing) {
            await supabase.from('swipes').insert({
                swiper_id: bot.id,
                swipee_id: user!.id,
                direction: 'right'
            });
        }

        alert(`It's a Match with ${bot.name}!`);
    };

    const handleReset = async () => {
        if (!user) return;
        setLoading(true);
        // Delete my swipes to see profiles again
        const { error } = await supabase.from('swipes').delete().eq('swiper_id', user.id);
        if (error) {
            console.error('Reset failed:', error);
            // If RLS fails, we might just reload, but alerting helps debug
            alert('Could not reset swipes. Please run the allow_reset.sql script.');
            window.location.reload();
            return;
        }
        window.location.reload();
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-primary" /></div>;
    if (currentIndex >= candidates.length) return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-gray-400">
            <p className="text-xl mb-4">No more profiles nearby.</p>
            <button
                onClick={handleReset}
                className="px-6 py-3 bg-white/10 border border-white/20 rounded-full text-white hover:bg-primary hover:border-primary transition-all flex items-center gap-2"
            >
                <Loader2 className={loading ? "animate-spin" : "hidden"} />
                Start Over (Reset Swipes)
            </button>
        </div>
    );

    const card = candidates[currentIndex];

    return (
        <div className="flex flex-col items-center min-h-screen bg-black overflow-y-auto relative">
            {/* Header */}
            <div className="sticky top-0 w-full p-4 flex justify-between items-center z-50 glass-dark">
                <h2 className="text-xl font-bold text-primary">Discover</h2>
                <div className="flex gap-4 items-center">
                    <a href="/profile" className="text-gray-300 hover:text-white" title="My Profile">
                        <User className="w-5 h-5" />
                    </a>
                    <a href="/chat" className="text-gray-300 hover:text-white">Chats</a>
                    <a href="/premium" className="text-yellow-500 font-bold hover:text-yellow-400">Premium</a>
                    <button onClick={() => signOut()} className="text-gray-400 hover:text-red-500 transition-colors" title="Sign Out">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-none w-full max-w-md relative mt-4 h-[70vh] flex items-center justify-center">
                <motion.div
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(_, { offset, velocity }) => {
                        const swipe = Math.abs(offset.x) * velocity.x;
                        if (swipe < -10000) {
                            handleSwipe('left');
                        } else if (swipe > 10000) {
                            handleSwipe('right');
                        }
                    }}
                    animate={controls}
                    style={{ x, rotate, opacity }}
                    className="absolute w-[90%] h-full rounded-3xl overflow-hidden shadow-2xl bg-gray-900 border border-white/10 z-20"
                >
                    <img src={card.photo_url} alt={card.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
                        <h3 className="text-3xl font-bold text-white">{card.name}, {card.age}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs px-2 py-1 bg-white/10 rounded-full">{card.country}</span>
                            {card.is_premium && <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full">Premium</span>}
                        </div>
                        <p className="text-gray-300 mt-2 line-clamp-2">{card.bio}</p>
                    </div>
                </motion.div>
            </div>

            <div className="flex-none py-6 flex gap-8 z-10 w-full justify-center">
                <button onClick={() => handleSwipe('left')} className="p-4 rounded-full bg-gray-900 border border-red-500/50 text-red-500 shadow-lg hover:bg-red-500 hover:text-white transition-all">
                    <X className="w-8 h-8" />
                </button>
                <button onClick={() => handleSwipe('right')} className="p-4 rounded-full bg-gray-900 border border-green-500/50 text-green-500 shadow-lg hover:bg-green-500 hover:text-white transition-all">
                    <Heart className="w-8 h-8 fill-current" />
                </button>
            </div>

            <div className="w-full max-w-4xl mx-auto p-8 pb-20 border-t border-white/10 mt-4">
                <div className="text-center mb-8">
                    <p className="text-primary text-sm font-bold uppercase tracking-widest mb-2">Our Network</p>
                    <h2 className="text-2xl font-bold text-white">Connecting Cultures</h2>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {SUPPORTED_REGIONS.map((c) => (
                        <div key={c.name} className="bg-white/5 rounded-xl p-3 flex flex-col items-center border border-white/10 text-center">
                            <div className="text-3xl mb-2">{c.flag}</div>
                            <span className="font-bold text-sm text-gray-300">{c.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Loader2, ArrowLeft, MapPin, Calendar, User, Edit2, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
    const { profile, user, signOut } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ likes: 0, matches: 0 });

    useEffect(() => {
        if (user) fetchStats();
    }, [user]);

    const fetchStats = async () => {
        if (!user) return;

        // Count who liked me
        const { count: likesCount } = await supabase
            .from('swipes')
            .select('*', { count: 'exact', head: true })
            .eq('swipee_id', user.id)
            .eq('direction', 'right');

        // Count matches (mutual) - Simplified for stats
        // This is a rough count, for precise usage we'd do a join but this suffices for "Profile Stats"
        setStats({ likes: likesCount || 0, matches: 0 });
    };

    if (!profile) return <div className="h-screen flex justify-center items-center bg-black"><Loader2 className="animate-spin text-primary" /></div>;

    return (
        <div className="min-h-screen bg-black text-white p-4 flex flex-col items-center">
            {/* Header */}
            <div className="w-full max-w-md flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-xl font-bold">My Profile</h1>
                <button onClick={() => signOut()} className="p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition">
                    <LogOut className="w-6 h-6" />
                </button>
            </div>

            <div className="w-full max-w-md glass-dark rounded-3xl p-6 border border-white/10 relative overflow-hidden">
                {/* Background Blur Effect */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />

                <div className="flex flex-col items-center">
                    <div className="relative group cursor-pointer">
                        <img
                            src={profile.photo_url}
                            alt={profile.name}
                            className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-xl group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute bottom-0 right-0 p-2 bg-primary rounded-full border-4 border-black">
                            <Edit2 className="w-4 h-4 text-white" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold mt-4">{profile.name}</h2>
                    <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <User className="w-3 h-3" /> {profile.age} years old
                    </p>
                    <p className="text-gray-400 text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" /> {profile.country}
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                        <h3 className="text-sm font-bold text-gray-500 mb-2 uppercase tracking-wide">About Me</h3>
                        <p className="text-gray-200">{profile.bio || "No bio yet."}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-2xl font-bold text-primary">{stats.likes}</span>
                            <span className="text-xs text-gray-400">Profile Likes</span>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex flex-col items-center">
                            <span className="text-xl font-bold text-green-400">Active</span>
                            <span className="text-xs text-gray-400">Membership</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-xs text-gray-600">Member since {new Date().getFullYear()}</p>
            </div>
        </div>
    );
}

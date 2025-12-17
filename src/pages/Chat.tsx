
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import type { Profile } from '../lib/supabaseClient';

import { Loader2, Send, ChevronLeft, Image as ImageIcon } from 'lucide-react';
import { format } from 'date-fns';

type ChatUser = Profile & { chatId?: string };

export default function Chat() {
    const { user, profile } = useAuth();
    const [matches, setMatches] = useState<ChatUser[]>([]);
    const [activeChat, setActiveChat] = useState<ChatUser | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMatches();
    }, []);

    useEffect(() => {
        if (activeChat) {
            fetchMessages(activeChat.id);
            const channel = supabase.channel(`chat:${activeChat.id}`)
                .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `sender_id=eq.${activeChat.id}` }, (payload) => {
                    setMessages(prev => [...prev, payload.new]);
                })
                .subscribe();
            return () => { supabase.removeChannel(channel); };
        }
    }, [activeChat]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMatches = async () => {
        // Complex query simulated: Get matched users
        // For demo, we just fetch profiles that swiped right on us, and we swiped right on them (or bots)

        // Simplification for hackathon: Fetch users I swiped right on.
        const { data: mySwipes } = await supabase.from('swipes').select('swipee_id').eq('swiper_id', user!.id).eq('direction', 'right');
        if (!mySwipes) { setLoading(false); return; }

        const ids = mySwipes.map(s => s.swipee_id);
        const { data: profiles } = await supabase.from('profiles').select('*').in('id', ids);

        // In real app, verify mutual match. For bots, it's always mutual if I swiped right (logic in Discover).
        setMatches(profiles || []);
        setLoading(false);
    };

    const fetchMessages = async (partnerId: string) => {
        const { data } = await supabase
            .from('messages')
            .select('*')
            .or(`and(sender_id.eq.${user!.id},receiver_id.eq.${partnerId}),and(sender_id.eq.${partnerId},receiver_id.eq.${user!.id})`)
            .order('created_at', { ascending: true });
        setMessages(data || []);
    };

    const sendMessage = async () => {
        if (!input.trim() || !activeChat) return;
        const text = input;
        setInput('');

        // Optimistic UI
        const tempMsg = {
            id: Math.random(),
            sender_id: user!.id,
            receiver_id: activeChat.id,
            content: text,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, tempMsg]);

        await supabase.from('messages').insert({
            sender_id: user!.id,
            receiver_id: activeChat.id,
            content: text
        });

        if (activeChat.is_bot) {
            handleBotReply(activeChat);
        }
    };

    const handleBotReply = (bot: ChatUser) => {
        setTimeout(async () => {
            const replies = [
                "That's so interesting! Tell me more 😊",
                "I was just thinking about that!",
                "Haha you are funny 😂",
                "Send me a photo? I want to see you.",
                "I'm from " + bot.country + ", have you been there?"
            ];
            const reply = replies[Math.floor(Math.random() * replies.length)];

            await supabase.from('messages').insert({
                sender_id: bot.id,
                receiver_id: user!.id,
                content: reply
            });

            // Refresh messages to catch the bot reply
            fetchMessages(bot.id);
        }, 3000);
    };

    if (!activeChat) {
        return (
            <div className="h-screen bg-black text-white flex flex-col">
                <div className="p-4 glass-dark flex justify-between items-center z-10 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white">Matches</h1>
                    <a href="/" className="text-primary font-bold hover:text-rose-400 text-sm">Discover Matches</a>
                </div>

                <div className="p-4 flex-1 overflow-y-auto">
                    {loading ? <Loader2 className="animate-spin text-primary mx-auto mt-10" /> : (
                        <div className="space-y-4">
                            {matches.length === 0 && (
                                <div className="text-center text-gray-500 mt-10">
                                    <p>No matches yet.</p>
                                    <a href="/" className="text-primary underline mt-2 block">Start Swiping</a>
                                </div>
                            )}
                            {matches.map(m => (
                                <div key={m.id} onClick={() => setActiveChat(m)} className="flex items-center gap-4 p-4 glass rounded-xl cursor-pointer hover:bg-white/5 transition border border-white/5">
                                    <img src={m.photo_url} className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
                                    <div>
                                        <h3 className="font-bold text-lg">{m.name}</h3>
                                        <p className="text-xs text-green-400 flex items-center gap-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-black text-white">
            <div className="p-4 glass-dark flex items-center gap-4 z-10 border-b border-white/10">
                <button onClick={() => setActiveChat(null)}><ChevronLeft /></button>
                <img src={activeChat.photo_url} className="w-10 h-10 rounded-full object-cover" />
                <div>
                    <h3 className="font-bold">{activeChat.name}</h3>
                    <p className="text-xs text-gray-400">{activeChat.is_bot ? 'Active now' : 'Online'}</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => {
                    const isMe = msg.sender_id === user!.id;
                    return (
                        <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] p-3 rounded-2xl ${isMe ? 'bg-primary text-white rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}>
                                <p>{msg.content}</p>
                                <span className="text-[10px] opacity-50 block text-right mt-1">{format(new Date(msg.created_at), 'HH:mm')}</span>
                            </div>
                        </div>
                    );
                })}
                <div ref={scrollRef} />
            </div>

            <div className="p-4 glass-dark border-t border-white/10 flex items-center gap-2">
                {!profile?.is_premium ? (
                    <button onClick={() => alert("Upgrade to Premium to send images!")} className="p-2 text-gray-500 hover:text-white"><ImageIcon className="w-6 h-6" /></button>
                ) : (
                    <button className="p-2 text-primary"><ImageIcon className="w-6 h-6" /></button>
                )}

                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                    placeholder="Type a message..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500"
                />
                <button onClick={sendMessage} className="p-2 text-primary disabled:opacity-50" disabled={!input.trim()}>
                    <Send className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
}

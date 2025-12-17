import { useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function AuthCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        // This handler will process the #access_token fragment
        // Supabase client auto-detects it on load if handled properly.
        // However, explicitly handling session refresh or navigation is good practice.

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                navigate('/'); // Redirect to home on success
            } else {
                // Wait a bit, sometimes session takes a moment to persist from hash
                const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
                    if (session) {
                        navigate('/');
                    }
                });
                return () => subscription.unsubscribe();
            }
        });

    }, [navigate]);

    return (
        <div className="h-screen flex flex-col justify-center items-center bg-black text-white">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p>Verifying login...</p>
        </div>
    );
}

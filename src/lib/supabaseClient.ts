
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
        auth: {
            detectSessionInUrl: true, // ✅ THIS FIXES YOUR ISSUE
            persistSession: true,
            autoRefreshToken: true,
        },
    }
)

export type Profile = {
    id: string
    name: string
    age: number
    gender: 'Male' | 'Female'
    country: string
    bio: string
    photo_url: string
    is_premium: boolean
    is_bot: boolean
}

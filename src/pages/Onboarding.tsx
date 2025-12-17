
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { MALE_COUNTRIES, FEMALE_COUNTRIES, ALL_ALLOWED_COUNTRIES } from '../lib/constants';

const schema = z.object({
    name: z.string().min(2, "Name is too short"),
    age: z.number().min(18, "You must be 18+"),
    gender: z.enum(["Male", "Female"]),
    country: z.string().min(2, "Country is required"),
    bio: z.string().max(150, "Bio too long"),
    photo_url: z.string().url("Valid photo URL required (or upload)"),
}).superRefine((data, ctx) => {
    if (data.gender === 'Male' && !MALE_COUNTRIES.includes(data.country)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["country"],
            message: "Male users are only allowed from India.",
        });
    }
    if (data.gender === 'Female' && !FEMALE_COUNTRIES.includes(data.country)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ["country"],
            message: "Female users are only allowed from select countries.",
        });
    }
});

type FormValues = z.infer<typeof schema>;

export default function Onboarding() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            gender: 'Male',
            country: 'India',
        }
    });

    // Remove unused gender watch


    const onSubmit = async (data: FormValues) => {
        if (!user) return;
        setLoading(true);

        // In a real app we'd upload file to bucket. Here user provides URL or we mock it.
        // For specific requirement "Profile photo", we just take the URL currently.

        const { error } = await supabase.from('profiles').insert({
            id: user.id,
            email: user.email,
            ...data,
            is_premium: false,
        });

        setLoading(false);
        if (error) {
            console.error(error);
            alert("Error creating profile: " + error.message);
        } else {
            window.location.href = '/'; // Force reload to refresh context
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-8">
            <div className="max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Complete Your Profile</h1>
                    <p className="text-gray-400 mt-2">Let's set up your identity. This cannot be changed later.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Full Name</label>
                            <input {...register('name')} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none" />
                            {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Age</label>
                            <input
                                type="number"
                                {...register('age', { valueAsNumber: true })}
                                className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none"
                            />
                            {errors.age && <span className="text-red-500 text-xs">{errors.age.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Gender</label>
                            <select {...register('gender')} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none">
                                <option value="Male" className="bg-black">Male</option>
                                <option value="Female" className="bg-black">Female</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Country</label>
                            <select {...register('country')} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none">
                                {ALL_ALLOWED_COUNTRIES.map(c => (
                                    <option key={c} value={c} className="bg-black">{c}</option>
                                ))}
                            </select>
                            {errors.country && <span className="text-red-500 text-xs">{errors.country.message}</span>}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Bio (Short & Sweet)</label>
                        <textarea {...register('bio')} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none" />
                        {errors.bio && <span className="text-red-500 text-xs">{errors.bio.message}</span>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Profile Photo URL</label>
                        <div className="flex gap-2">
                            <input {...register('photo_url')} placeholder="https://..." className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 focus:border-primary focus:outline-none" />
                        </div>
                        <p className="text-xs text-gray-500 hidden md:block">For this demo, please paste a publicly accessible image URL.</p>
                        {errors.photo_url && <span className="text-red-500 text-xs">{errors.photo_url.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all"
                    >
                        {loading ? <Loader2 className="animate-spin mx-auto" /> : "Complete Setup"}
                    </button>
                </form>
            </div>
        </div>
    );
}

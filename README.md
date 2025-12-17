# Match Platform

A premium matchmaking application built with React, Tailwind CSS, Supabase, and Framer Motion.

## 🚀 Setup Instructions

### 1. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the content of `supabase_schema.sql` (in the root of this project) and run it. This will create the necessary tables, policies, and indexes.
4. **Storage**: Create a bucket named `avatars` (public) or just use external URLs for now.
5. **Auth**: Enable Email auth in Supabase Authentication settings.

### 2. Environment Variables
1. Rename `.env.example` to `.env`.
2. Fill in your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from your Supabase Project Settings.

### 3. Run Locally
```bash
npm install
npm run dev
```

## 🤖 Bot System (Seed)
To populate the database with "Bot" users:
1. Since we don't have a backend script runner, you can manually insert rows into the `profiles` table via the Supabase Table Editor.
2. Example Bot Insert:
   - ID: (Generate a UUID)
   - Name: Anastasia
   - Age: 24
   - Gender: Female
   - Country: Russia
   - Bio: "Loves classical music and travel."
   - Is_Bot: TRUE
   - Photo_Url: (Use a placeholder image URL)

## 💎 Razorpay
The payment integration is in Test Mode.
- Updates the `is_premium` flag in `profiles` table upon "success" (mocked for hackathon).
- Replace `rzp_test_placeholder` in `src/pages/Premium.tsx` with your actual Razorpay Test Key ID if you want the modal to open correctly.

## 🌍 Country Validation
- **Males**: India Only.
- **Females**: Moldova, Latvia, Ukraine, Russia, Armenia, Djibouti, Hong Kong, Macao.
- Strict validation is enforced in `src/pages/Onboarding.tsx`.

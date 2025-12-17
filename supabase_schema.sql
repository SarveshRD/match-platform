-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Note: auth.users usually has RLS enabled by default.
-- If you need to enable it, do it in the Authentication > Settings page to avoid permission errors.


-- Profiles: Public profiles for matchmaking
create table profiles (
  id uuid default uuid_generate_v4() not null primary key, -- Removed strict FK to auth.users to allow Bots
  email text,
  name text,
  age int check (age >= 18),
  gender text check (gender in ('Male', 'Female')),
  country text not null,
  bio text,
  photo_url text, -- Store URL to supabase storage
  is_premium boolean default false,
  is_bot boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Swipes/Matches
create table swipes (
  id uuid default uuid_generate_v4() primary key,
  swiper_id uuid references profiles(id) on delete cascade not null,
  swipee_id uuid references profiles(id) on delete cascade not null,
  direction text check (direction in ('right', 'left')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(swiper_id, swipee_id)
);

alter table swipes enable row level security;

create policy "Users can insert their own swipes"
  on swipes for insert
  with check ( auth.uid() = swiper_id );

-- Messages
create table messages (
  id uuid default uuid_generate_v4() primary key,
  sender_id uuid references profiles(id) on delete cascade not null,
  receiver_id uuid references profiles(id) on delete cascade not null,
  content text,
  image_url text,
  read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table messages enable row level security;

create policy "Users can see messages sent to or by them"
  on messages for select
  using ( auth.uid() = sender_id or auth.uid() = receiver_id );

create policy "Users can insert messages"
  on messages for insert
  with check ( auth.uid() = sender_id );

-- Storage Bucket Policy (pseudo-code, run in dashboard)
-- Create bucket 'avatars'
-- Policy: "Avatar images are publicly accessible" -> SELECT for all
-- Policy: "Anyone can upload an avatar" -> INSERT for authenticated

-- SEED DATA (Bots)
-- Insert fake users into auth.users is hard without admin API, 
-- but we can insert into 'profiles' directly for bots if we treat them as 'system' users
-- For this demo, we assume we insert these rows manually or via a script.
-- Example Bot:
-- INSERT INTO profiles (id, name, age, gender, country, bio, photo_url, is_bot)
-- VALUES (uuid_generate_v4(), 'Anastasia', 23, 'Female', 'Russia', 'Loves travel and coffee.', 'https://ui.aceternity.com/_next/image?url=%2Fimages%2Fproducts%2Fthumbnails%2Fnew%2Fcursor.png&w=640&q=75', true);

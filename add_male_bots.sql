-- Insert 10 Male Bot Profiles (India)
-- Uses randomuser.me for reliable placeholder avatars

INSERT INTO profiles (id, email, name, age, gender, country, bio, photo_url, is_bot, is_premium) VALUES
  (uuid_generate_v4(), 'bot_aarav@match.local', 'Aarav', 26, 'Male', 'India', 'Software Engineer from Bangalore. Love cricket and coding.', 'https://randomuser.me/api/portraits/men/10.jpg', true, true),
  (uuid_generate_v4(), 'bot_vihaan@match.local', 'Vihaan', 28, 'Male', 'India', 'Entrepreneur looking for a serious connection. Travel enthusiast.', 'https://randomuser.me/api/portraits/men/22.jpg', true, true),
  (uuid_generate_v4(), 'bot_aditya@match.local', 'Aditya', 30, 'Male', 'India', 'Investment Banker in Mumbai. Foodie and dog lover.', 'https://randomuser.me/api/portraits/men/33.jpg', true, false),
  (uuid_generate_v4(), 'bot_arjun@match.local', 'Arjun', 27, 'Male', 'India', 'Fitness trainer and model. Looking for someone adventurous.', 'https://randomuser.me/api/portraits/men/45.jpg', true, false),
  (uuid_generate_v4(), 'bot_sai@match.local', 'Sai', 25, 'Male', 'India', 'Student and musician. Let''s jam together!', 'https://randomuser.me/api/portraits/men/51.jpg', true, false),
  (uuid_generate_v4(), 'bot_reyansh@match.local', 'Reyansh', 29, 'Male', 'India', 'Architect. I build dreams, maybe yours too?', 'https://randomuser.me/api/portraits/men/60.jpg', true, true),
  (uuid_generate_v4(), 'bot_krishna@match.local', 'Krishna', 32, 'Male', 'India', 'Doctor based in Delhi. Saving lives and looking for a wife.', 'https://randomuser.me/api/portraits/men/71.jpg', true, true),
  (uuid_generate_v4(), 'bot_ishaan@match.local', 'Ishaan', 24, 'Male', 'India', 'Artist and dreamer. Love photography.', 'https://randomuser.me/api/portraits/men/82.jpg', true, false),
  (uuid_generate_v4(), 'bot_shaurya@match.local', 'Shaurya', 31, 'Male', 'India', 'Lawyer. Justice for all, but love for one.', 'https://randomuser.me/api/portraits/men/91.jpg', true, true),
  (uuid_generate_v4(), 'bot_dhruv@match.local', 'Dhruv', 26, 'Male', 'India', 'Chef. I can cook your favorite meal.', 'https://randomuser.me/api/portraits/men/5.jpg', true, false);

-- Insert 8 More Bots for Specific Countries
-- Note: User must run this in Supabase SQL Editor

INSERT INTO profiles (id, email, name, age, gender, country, bio, photo_url, is_bot)
VALUES 
-- Moldova
(uuid_generate_v4(), 'bot_moldova@example.com', 'Elena', 24, 'Female', 'Moldova', 'Wine lover and history enthusiast from Chisinau.', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80', true),

-- Latvia
(uuid_generate_v4(), 'bot_latvia@example.com', 'Dace', 26, 'Female', 'Latvia', 'Love the Baltic sea and amber jewelry.', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&auto=format&fit=crop&q=80', true),

-- Ukraine (Adding another)
(uuid_generate_v4(), 'bot_ukraine2@example.com', 'Oksana', 22, 'Female', 'Ukraine', 'Artist and dreamer. Looking for a serious connection.', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80', true),

-- Russia (Adding another)
(uuid_generate_v4(), 'bot_russia2@example.com', 'Svetlana', 27, 'Female', 'Russia', 'Software engineer living in St. Petersburg.', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&auto=format&fit=crop&q=80', true),

-- Armenia
(uuid_generate_v4(), 'bot_armenia@example.com', 'Ani', 23, 'Female', 'Armenia', 'Passionate about chess and ancient architecture.', 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&auto=format&fit=crop&q=80', true),

-- Djibouti
(uuid_generate_v4(), 'bot_djibouti@example.com', 'Amina', 25, 'Female', 'Djibouti', 'Love the ocean and diving. Exploring the world.', 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&auto=format&fit=crop&q=80', true),

-- Hong Kong
(uuid_generate_v4(), 'bot_hk@example.com', 'Mei', 24, 'Female', 'Hong Kong', 'City girl loving the fast life and dim sum.', 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=500&auto=format&fit=crop&q=80', true),

-- Macao
(uuid_generate_v4(), 'bot_macao@example.com', 'Sofia', 28, 'Female', 'Macao', 'Casino dealer by day, traveler by night.', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&auto=format&fit=crop&q=80', true);

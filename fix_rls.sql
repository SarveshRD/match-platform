-- FIX: Add missing RLS policies for Swipes
-- Without this, the app cannot read your "Likes" to build the chat list.

-- 1. Allow users to see who they swiped on
create policy "Users can view their own swipes"
  on swipes for select
  using ( auth.uid() = swiper_id );

-- 2. Allow users to see who swiped on them (for matches)
create policy "Users can view swipes directed at them"
  on swipes for select
  using ( auth.uid() = swipee_id );

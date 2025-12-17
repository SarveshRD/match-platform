-- Allow users to delete their own swipes (to reset/start over)
create policy "Users can delete their own swipes"
  on swipes for delete
  using ( auth.uid() = swiper_id );

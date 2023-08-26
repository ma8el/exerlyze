insert into storage.buckets
  (id, name)
values
  ('exercise_images', 'exercise_images');

create policy "Public Access to exercise_images"
  on storage.objects for select
  using ( bucket_id = 'exercise_images' );


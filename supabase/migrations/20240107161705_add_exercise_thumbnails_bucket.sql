INSERT INTO storage.buckets
  (id, name)
VALUES
  ('exercise_thumbnails', 'exercise_thumbnails');

CREATE POLICY "Public Access to exercise_thumbnails"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'exercise_thumbnails' );
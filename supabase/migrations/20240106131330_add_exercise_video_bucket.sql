INSERT INTO storage.buckets
  (id, name)
VALUES
  ('exercise_videos', 'exercise_videos');

CREATE POLICY "Public Access to exercise_videos"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'exercise_videos' );
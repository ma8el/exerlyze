CREATE TYPE "public"."fitness_level" AS ENUM (
    'beginner',
    'novice',
    'intermediate',
    'advanced',
    'elite'
);

CREATE TABLE IF NOT EXISTS "public"."user_fitness_level" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL DEFAULT auth.uid(),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "fitness_level" fitness_level NOT NULL,
  "deadlift_max" float NOT NULL,
  "squat_max" float NOT NULL,
  "bench_max" float NOT NULL,
  "overhead_press_max" float,
  "other" jsonb,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE "public"."user_fitness_level" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow User read access to own data" ON "public"."user_fitness_level" FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY "Allow Users insert access" ON "public"."user_fitness_level" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id" FROM "public"."profiles")));
CREATE POLICY "Allow individual update of own data" ON "public"."user_fitness_level" FOR UPDATE USING ( auth.uid() = user_id );
CREATE POLICY "Allow individual delete of own data" ON "public"."user_fitness_level" FOR DELETE USING ( auth.uid() = user_id );
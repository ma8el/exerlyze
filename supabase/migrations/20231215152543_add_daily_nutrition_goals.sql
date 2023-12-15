CREATE TYPE "public"."nutrition_goal" AS ENUM (
    'stayFit',
    'gainMuscle',
    'loseWeight'
);

CREATE TABLE IF NOT EXISTS "public"."daily_nutrition_goals" (
  "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
  "user_id" uuid NOT NULL DEFAULT auth.uid(),
  "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  "nutrition_goal" nutrition_goal NOT NULL,
  "daily_calories" float NOT NULL,
  "daily_carbs" float NOT NULL,
  "daily_protein" float NOT NULL,
  "daily_fat" float NOT NULL,
  PRIMARY KEY ("id"),
  FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE
);

ALTER TABLE "public"."daily_nutrition_goals" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow User read access to own data" ON "public"."daily_nutrition_goals" FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY "Allow Users insert access" ON "public"."daily_nutrition_goals" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id" FROM "public"."profiles")));
CREATE POLICY "Allow individual update of own data" ON "public"."daily_nutrition_goals" FOR UPDATE USING ( auth.uid() = user_id );
CREATE POLICY "Allow individual delete of own data" ON "public"."daily_nutrition_goals" FOR DELETE USING ( auth.uid() = user_id );
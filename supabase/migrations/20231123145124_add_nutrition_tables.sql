CREATE TABLE IF NOT EXISTS "public"."food_diary" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);

ALTER TABLE ONLY "public"."food_diary"
    ADD CONSTRAINT "food_diary_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE "public"."food_diary" OWNER TO "postgres";

ALTER TABLE "public"."food_diary" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewable by owner." ON "public"."food_diary" FOR SELECT USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can update own food diary." ON "public"."food_diary" FOR UPDATE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Deletable by owner." ON "public"."food_diary" FOR DELETE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Writable by users." ON "public"."food_diary" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));


CREATE TABLE IF NOT EXISTS "public"."food_diary_entry" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" "uuid" NOT NULL,
    "food_diary_id" "uuid",
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "food_id" "text",
    "food_name" "text",
    "quantity" integer,
    "unit" "text",
    "calories" integer,
    "carbohydrates" integer,
    "protein" integer,
    "fat" integer,
    "fiber" float,
    "sugar" integer,
    "salt" float,
    "sodium" float,
    "deleted" boolean DEFAULT false NOT NULL
);

ALTER TABLE "public"."food_diary_entry" OWNER TO "postgres";

ALTER TABLE ONLY "public"."food_diary_entry"
    ADD CONSTRAINT "food_diary_entry_food_diary_id_fkey" FOREIGN KEY ("food_diary_id") REFERENCES "public"."food_diary"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."food_diary_entry"
    ADD CONSTRAINT "food_diary_entry_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE "public"."food_diary_entry" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewable by owner." ON "public"."food_diary_entry" FOR SELECT USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can update own food entries." ON "public"."food_diary_entry" FOR UPDATE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Deletable by owner." ON "public"."food_diary_entry" FOR DELETE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Writable by users." ON "public"."food_diary_entry" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));
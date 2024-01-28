CREATE TABLE favorite_nutrition_items (
  id uuid PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  food_id text NOT NULL,
  quantity integer,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  FOREIGN KEY ("user_id") REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX "favorite_nutrition_items_user_id_food_id_unique" ON public.favorite_nutrition_items USING btree (user_id, food_id);

ALTER TABLE public.favorite_nutrition_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Viewable by owner." ON public.favorite_nutrition_items FOR SELECT USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Users can update own favorites." ON public.favorite_nutrition_items FOR UPDATE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Deletable by owner." ON public.favorite_nutrition_items FOR DELETE USING (("auth"."uid"() = "user_id"));
CREATE POLICY "Writable by users." ON public.favorite_nutrition_items FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));
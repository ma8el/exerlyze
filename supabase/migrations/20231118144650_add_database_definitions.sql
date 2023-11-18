CREATE TYPE "public"."gender" AS ENUM (
    'male',
    'female',
    'other'
);

ALTER TYPE "public"."gender" OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  select
      into status, content
           result.status, result.content
      from public.delete_storage_object('avatars', avatar_url) as result;
end;
$$;

ALTER FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_old_avatar"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  status int;
  content text;
begin
  if coalesce(old.avatar_url, '') <> ''
      and (tg_op = 'DELETE' or (old.avatar_url <> new.avatar_url)) then
    select
      into status, content
      result.status, result.content
      from public.delete_avatar(old.avatar_url) as result;
    if status <> 200 then
      raise warning 'Could not delete avatar: % %', status, content;
    end if;
  end if;
  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

ALTER FUNCTION "public"."delete_old_avatar"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") RETURNS "record"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
declare
  project_url text := '<YOURPROJECTURL>';
  service_role_key text := '<YOURSERVICEROLEKEY>'; --  full access needed
  url text := project_url||'/storage/v1/object/'||bucket||'/'||object;
begin
  select
      into status, content
           result.status::int, result.content::text
      FROM extensions.http((
    'DELETE',
    url,
    ARRAY[extensions.http_header('authorization','Bearer '||service_role_key)],
    NULL,
    NULL)::extensions.http_request) as result;
end;
$$;

ALTER FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

CREATE OR REPLACE FUNCTION "public"."workout_exercises_valid_check"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    IF NEW.sets IS NOT NULL AND NEW.reps IS NOT NULL AND NEW.weight IS NOT NULL THEN
        NEW.valid = true;
    ELSE
        NEW.valid = false;
    END IF;
    RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."workout_exercises_valid_check"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";

CREATE TABLE IF NOT EXISTS "public"."days_of_week" (
    "id" integer NOT NULL,
    "name_en" "text" NOT NULL,
    "name_de" "text" NOT NULL,
    "name_fr" "text" NOT NULL
);

ALTER TABLE "public"."days_of_week" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."days_of_week_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."days_of_week_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."days_of_week_id_seq" OWNED BY "public"."days_of_week"."id";

CREATE TABLE IF NOT EXISTS "public"."exercises" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "name_en" "text" NOT NULL,
    "name_de" "text" NOT NULL,
    "name_fr" "text" NOT NULL,
    "description_en" "text",
    "description_de" "text",
    "description_fr" "text",
    "execution_en" "text",
    "execution_de" "text",
    "execution_fr" "text",
    "muscles" integer[],
    "image_url" "text"
);

ALTER TABLE "public"."exercises" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."exercises_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."exercises_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."exercises_id_seq" OWNED BY "public"."exercises"."id";

CREATE TABLE IF NOT EXISTS "public"."muscles" (
    "id" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "name_en" "text" NOT NULL,
    "name_de" "text" NOT NULL,
    "name_fr" "text" NOT NULL,
    "description_en" "text",
    "description_de" "text",
    "description_fr" "text"
);

ALTER TABLE "public"."muscles" OWNER TO "postgres";

CREATE SEQUENCE IF NOT EXISTS "public"."muscles_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE "public"."muscles_id_seq" OWNER TO "postgres";

ALTER SEQUENCE "public"."muscles_id_seq" OWNED BY "public"."muscles"."id";

CREATE TABLE IF NOT EXISTS "public"."planned_workouts" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "workout_id" "uuid" NOT NULL,
    "workout_plan_id" "uuid" NOT NULL,
    "day_of_week_id" integer NOT NULL,
    "time_of_day" time without time zone,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."planned_workouts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "updated_at" timestamp with time zone,
    "username" "text",
    "avatar_url" "text",
    "first_name" "text",
    "last_name" "text",
    "date_of_birth" "date",
    "height" integer,
    "gender" "public"."gender",
    "full_name" "text",
    CONSTRAINT "username_length" CHECK (("char_length"("username") >= 3))
);

ALTER TABLE "public"."profiles" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workout_session_performances" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" "uuid" NOT NULL,
    "workout_session_id" "uuid" NOT NULL,
    "exercise_id" integer NOT NULL,
    "set" integer NOT NULL,
    "planned_reps" integer NOT NULL,
    "performed_reps" integer NOT NULL,
    "planned_weight" double precision NOT NULL,
    "performed_weight" double precision NOT NULL,
    "planned_rir" integer NOT NULL,
    "performed_rir" integer NOT NULL,
    "resttime" integer NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

ALTER TABLE "public"."workout_session_performances" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workout_exercises" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "exercise_id" integer NOT NULL,
    "sets" integer,
    "reps" integer,
    "weight" integer,
    "resttime" integer,
    "rir" integer,
    "valid" boolean DEFAULT false NOT NULL,
    "user_id" "uuid" NOT NULL
);

ALTER TABLE "public"."workout_exercises" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workout_plans" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."workout_plans" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workout_schedule" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "starts_at" timestamp with time zone NOT NULL,
    "ends_at" timestamp with time zone NOT NULL,
    "workout_plan_id" "uuid" NOT NULL
);

ALTER TABLE "public"."workout_schedule" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."workouts" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "description" "text"
);

ALTER TABLE "public"."workouts" OWNER TO "postgres";

CREATE TABLE IF NOT EXISTS "public"."weights" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "user_id" "uuid" NOT NULL,
    "weight" double precision NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);

CREATE TABLE IF NOT EXISTS "public"."workout_sessions" (
    "id" "uuid" PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "workout_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "scheduled_at" timestamp with time zone NOT NULL,
    "started_at" timestamp with time zone,
    "finished_at" timestamp with time zone,
    "notes" "text"
);

ALTER TABLE "public"."workout_sessions" OWNER TO "postgres";

ALTER TABLE ONLY "public"."days_of_week" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."days_of_week_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."exercises" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."exercises_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."muscles" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."muscles_id_seq"'::"regclass");

ALTER TABLE ONLY "public"."days_of_week"
    ADD CONSTRAINT "days_of_week_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."exercises"
    ADD CONSTRAINT "exercises_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."muscles"
    ADD CONSTRAINT "muscles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");

CREATE TRIGGER "before_profile_changes" BEFORE DELETE OR UPDATE OF "avatar_url" ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."delete_old_avatar"();

CREATE TRIGGER "check_workout_exercise_columns" BEFORE INSERT OR UPDATE ON "public"."workout_exercises" FOR EACH ROW EXECUTE FUNCTION "public"."workout_exercises_valid_check"();

ALTER TABLE ONLY "public"."planned_workouts"
    ADD CONSTRAINT "planned_workouts_day_of_week_id_fkey" FOREIGN KEY ("day_of_week_id") REFERENCES "public"."days_of_week"("id");

ALTER TABLE ONLY "public"."planned_workouts"
    ADD CONSTRAINT "planned_workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."planned_workouts"
    ADD CONSTRAINT "planned_workouts_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id");

ALTER TABLE ONLY "public"."planned_workouts"
    ADD CONSTRAINT "planned_workouts_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."weights"
    ADD CONSTRAINT "weights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id");

ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."workout_exercises"
    ADD CONSTRAINT "workout_exercises_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."workout_plans"
    ADD CONSTRAINT "workout_plans_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."workout_schedule"
    ADD CONSTRAINT "workout_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

ALTER TABLE ONLY "public"."workout_schedule"
    ADD CONSTRAINT "workout_schedule_workout_plan_id_fkey" FOREIGN KEY ("workout_plan_id") REFERENCES "public"."workout_plans"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."workout_session_performances"
    ADD CONSTRAINT "workout_session_performances_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "public"."exercises"("id");

ALTER TABLE ONLY "public"."workout_session_performances"
    ADD CONSTRAINT "workout_session_performances_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."workout_session_performances"
    ADD CONSTRAINT "workout_session_performances_workout_session_id_fkey" FOREIGN KEY ("workout_session_id") REFERENCES "public"."workout_sessions"("id") ON DELETE CASCADE;

ALTER TABLE ONLY "public"."workout_sessions"
    ADD CONSTRAINT "workout_sessions_workout_id_fkey" FOREIGN KEY ("workout_id") REFERENCES "public"."workouts"("id");

ALTER TABLE ONLY "public"."workouts"
    ADD CONSTRAINT "workouts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id");

CREATE POLICY "Deletable by owner." ON "public"."planned_workouts" FOR DELETE USING (("id" IN ( SELECT "planned_workouts_1"."id"
   FROM ("public"."planned_workouts" "planned_workouts_1"
     JOIN "public"."workout_plans" ON (("planned_workouts_1"."workout_plan_id" = "workout_plans"."id")))
  WHERE ("workout_plans"."user_id" = "auth"."uid"()))));

CREATE POLICY "Deletable by owner." ON "public"."workout_exercises" FOR DELETE USING (("id" IN ( SELECT "workout_exercises_1"."id"
   FROM ("public"."workout_exercises" "workout_exercises_1"
     JOIN "public"."workouts" ON (("workout_exercises_1"."workout_id" = "workouts"."id")))
  WHERE ("workouts"."user_id" = "auth"."uid"()))));

CREATE POLICY "Deletable by owner." ON "public"."workout_plans" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Deletable by owner." ON "public"."workout_schedule" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Deletable by owner." ON "public"."workout_sessions" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Deletable by owner." ON "public"."workouts" FOR DELETE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."planned_workouts" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."workout_exercises" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."workout_plans" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."workout_schedule" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."workout_sessions" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Modifiable by owner." ON "public"."workouts" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Profiles are viewable by owner." ON "public"."profiles" FOR SELECT USING (("auth"."uid"() = "id"));

CREATE POLICY "Session performances are insertable by user." ON "public"."workout_session_performances" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));

CREATE POLICY "Session performances are viewable by user." ON "public"."workout_session_performances" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can insert their own profile." ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));

CREATE POLICY "Users can insert weigths." ON "public"."weights" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Users can update own profile." ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));

CREATE POLICY "Users can update own session performance." ON "public"."workout_session_performances" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Users can update own weight." ON "public"."weights" FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."planned_workouts" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."workout_exercises" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."workout_plans" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."workout_schedule" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."workout_sessions" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Viewable by owner." ON "public"."workouts" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Weigths are viewable by user." ON "public"."weights" FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "Writable by users." ON "public"."planned_workouts" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Writable by users." ON "public"."workout_exercises" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Writable by users." ON "public"."workout_plans" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Writable by users." ON "public"."workout_schedule" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Writable by users." ON "public"."workout_sessions" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

CREATE POLICY "Writable by users." ON "public"."workouts" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "profiles"."id"
   FROM "public"."profiles")));

ALTER TABLE "public"."days_of_week" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."exercises" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."muscles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."planned_workouts" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."weights" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout_exercises" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout_plans" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout_schedule" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout_session_performances" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workout_sessions" ENABLE ROW LEVEL SECURITY;

ALTER TABLE "public"."workouts" ENABLE ROW LEVEL SECURITY;

REVOKE USAGE ON SCHEMA "public" FROM PUBLIC;
GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_avatar"("avatar_url" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "anon";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_old_avatar"() TO "service_role";

GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."delete_storage_object"("bucket" "text", "object" "text", OUT "status" integer, OUT "content" "text") TO "service_role";

GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";

GRANT ALL ON FUNCTION "public"."workout_exercises_valid_check"() TO "anon";
GRANT ALL ON FUNCTION "public"."workout_exercises_valid_check"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."workout_exercises_valid_check"() TO "service_role";

GRANT ALL ON TABLE "public"."days_of_week" TO "anon";
GRANT ALL ON TABLE "public"."days_of_week" TO "authenticated";
GRANT ALL ON TABLE "public"."days_of_week" TO "service_role";

GRANT ALL ON SEQUENCE "public"."days_of_week_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."days_of_week_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."days_of_week_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."exercises" TO "anon";
GRANT ALL ON TABLE "public"."exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."exercises" TO "service_role";

GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."exercises_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."muscles" TO "anon";
GRANT ALL ON TABLE "public"."muscles" TO "authenticated";
GRANT ALL ON TABLE "public"."muscles" TO "service_role";

GRANT ALL ON SEQUENCE "public"."muscles_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."muscles_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."muscles_id_seq" TO "service_role";

GRANT ALL ON TABLE "public"."planned_workouts" TO "anon";
GRANT ALL ON TABLE "public"."planned_workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."planned_workouts" TO "service_role";

GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";

GRANT ALL ON TABLE "public"."workout_session_performances" TO "anon";
GRANT ALL ON TABLE "public"."workout_session_performances" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_session_performances" TO "service_role";

GRANT ALL ON TABLE "public"."workout_exercises" TO "anon";
GRANT ALL ON TABLE "public"."workout_exercises" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_exercises" TO "service_role";

GRANT ALL ON TABLE "public"."workout_plans" TO "anon";
GRANT ALL ON TABLE "public"."workout_plans" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_plans" TO "service_role";

GRANT ALL ON TABLE "public"."workout_schedule" TO "anon";
GRANT ALL ON TABLE "public"."workout_schedule" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_schedule" TO "service_role";

GRANT ALL ON TABLE "public"."workouts" TO "anon";
GRANT ALL ON TABLE "public"."workouts" TO "authenticated";
GRANT ALL ON TABLE "public"."workouts" TO "service_role";

GRANT ALL ON TABLE "public"."weights" TO "anon";
GRANT ALL ON TABLE "public"."weights" TO "authenticated";
GRANT ALL ON TABLE "public"."weights" TO "service_role";

GRANT ALL ON TABLE "public"."workout_sessions" TO "anon";
GRANT ALL ON TABLE "public"."workout_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."workout_sessions" TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";

ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";

CREATE POLICY "Viewable by all."
ON "public"."days_of_week"
AS permissive
FOR SELECT
TO public
USING (true);

CREATE POLICY "Viewable by all."
ON "public"."exercises"
AS permissive
FOR SELECT
TO public
USING (true);

CREATE POLICY "Viewable by all."
ON "public"."muscles"
AS permissive
FOR SELECT
TO public
USING (true);

INSERT INTO storage.buckets
  (id, name)
VALUES
  ('exercise_images', 'exercise_images');

CREATE POLICY "Public Access to exercise_images"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'exercise_images' );

RESET ALL;
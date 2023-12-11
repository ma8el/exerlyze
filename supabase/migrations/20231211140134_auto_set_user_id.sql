alter table "public"."food_diaries" alter column "user_id" set default auth.uid();

alter table "public"."food_diary_entries" alter column "user_id" set default auth.uid();

alter table "public"."planned_workouts" alter column "user_id" set default auth.uid();

alter table "public"."weights" alter column "user_id" set default auth.uid();

alter table "public"."workout_exercises" alter column "user_id" set default auth.uid();

alter table "public"."workout_plans" alter column "user_id" set default auth.uid();

alter table "public"."workout_schedule" alter column "user_id" set default auth.uid();

alter table "public"."workout_session_performances" alter column "user_id" set default auth.uid();

alter table "public"."workout_sessions" alter column "user_id" set default auth.uid();

alter table "public"."workouts" alter column "user_id" set default auth.uid();

alter table "public"."profiles" alter column "id" set default auth.uid();

alter table "public"."workout_sessions" add constraint "workout_sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) not valid;

alter table "public"."workout_sessions" validate constraint "workout_sessions_user_id_fkey";
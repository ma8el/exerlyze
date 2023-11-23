alter table "public"."planned_workouts" add column "deleted" boolean;

alter table "public"."profiles" add column "created_at" timestamp with time zone;

alter table "public"."weights" add column "unit" text;

alter table "public"."workout_plans" add column "deleted" boolean;

alter table "public"."workout_session_performances" alter column "performed_rir" drop not null;

alter table "public"."workout_session_performances" alter column "planned_rir" drop not null;

alter table "public"."workout_session_performances" alter column "resttime" drop not null;

alter table "public"."workouts" add column "deleted" boolean;



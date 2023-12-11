drop policy "Deletable by owner." on "public"."food_diary";

drop policy "Users can update own food diary." on "public"."food_diary";

drop policy "Viewable by owner." on "public"."food_diary";

drop policy "Writable by users." on "public"."food_diary";

drop policy "Deletable by owner." on "public"."food_diary_entry";

drop policy "Users can update own food entries." on "public"."food_diary_entry";

drop policy "Viewable by owner." on "public"."food_diary_entry";

drop policy "Writable by users." on "public"."food_diary_entry";

alter table "public"."food_diary" drop constraint "food_diary_user_id_fkey";

alter table "public"."food_diary_entry" drop constraint "food_diary_entry_food_diary_id_fkey";

alter table "public"."food_diary_entry" drop constraint "food_diary_entry_user_id_fkey";

alter table "public"."food_diary" drop constraint "food_diary_pkey";

alter table "public"."food_diary_entry" drop constraint "food_diary_entry_pkey";

drop index if exists "public"."food_diary_entry_pkey";

drop index if exists "public"."food_diary_pkey";

drop table "public"."food_diary";

drop table "public"."food_diary_entry";

create table "public"."food_diaries" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP
);


alter table "public"."food_diaries" enable row level security;

create table "public"."food_diary_entries" (
    "id" uuid not null default uuid_generate_v4(),
    "user_id" uuid not null,
    "food_diary_id" uuid not null,
    "created_at" timestamp with time zone not null default CURRENT_TIMESTAMP,
    "food_id" text,
    "food_name" text,
    "quantity" integer,
    "unit" text,
    "calories" integer,
    "carbohydrates" integer,
    "protein" integer,
    "fat" integer,
    "fiber" double precision,
    "sugar" integer,
    "salt" double precision,
    "sodium" double precision,
    "deleted" boolean not null default false,
    "image_front_thumb_url" text
);


alter table "public"."food_diary_entries" enable row level security;

alter table "public"."workout_exercises" alter column "weight" set data type double precision using "weight"::double precision;

CREATE UNIQUE INDEX food_diary_entry_pkey ON public.food_diary_entries USING btree (id);

CREATE UNIQUE INDEX food_diary_pkey ON public.food_diaries USING btree (id);

alter table "public"."food_diaries" add constraint "food_diary_pkey" PRIMARY KEY using index "food_diary_pkey";

alter table "public"."food_diary_entries" add constraint "food_diary_entry_pkey" PRIMARY KEY using index "food_diary_entry_pkey";

alter table "public"."food_diaries" add constraint "food_diaries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."food_diaries" validate constraint "food_diaries_user_id_fkey";

alter table "public"."food_diary_entries" add constraint "food_diary_entries_food_diary_id_fkey" FOREIGN KEY (food_diary_id) REFERENCES food_diaries(id) ON DELETE CASCADE not valid;

alter table "public"."food_diary_entries" validate constraint "food_diary_entries_food_diary_id_fkey";

alter table "public"."food_diary_entries" add constraint "food_diary_entries_user_id_fkey" FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE not valid;

alter table "public"."food_diary_entries" validate constraint "food_diary_entries_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.avg_daily_calories(start_date date, end_date date)
 RETURNS TABLE(user_id uuid, calories integer, carbohydrates integer, proteins integer, fat integer)
 LANGUAGE sql
AS $function$
select
  user_id,
  ceil(avg(calories)) as calories,
  ceil(avg(carbohydrates)) as carbohydrates,
  ceil(avg(proteins)) as proteins,
  ceil(avg(fat)) as fat
from v_daily_aggregated_food_diary_entries
where calories != 0
AND date >= $1 and date < $2
group by user_id
$function$
;

create or replace view "public"."v_daily_aggregated_food_diary_entries" WITH (security_invoker) as  WITH date_series AS (
         SELECT generate_series(((min(food_diary_entries.created_at))::date)::timestamp with time zone, ((max(food_diary_entries.created_at))::date)::timestamp with time zone, '1 day'::interval) AS date
           FROM food_diary_entries
        ), user_ids AS (
         SELECT DISTINCT food_diary_entries.user_id
           FROM food_diary_entries
        ), cross_join AS (
         SELECT ds.date,
            ui.user_id
           FROM (date_series ds
             CROSS JOIN user_ids ui)
        ), aggregated_data AS (
         SELECT date_trunc('day'::text, food_diary_entries.created_at) AS date,
            food_diary_entries.user_id,
            sum(food_diary_entries.calories) AS calories,
            sum(food_diary_entries.carbohydrates) AS carbohydrates,
            sum(food_diary_entries.protein) AS proteins,
            sum(food_diary_entries.fat) AS fat
           FROM food_diary_entries
          GROUP BY (date_trunc('day'::text, food_diary_entries.created_at)), food_diary_entries.user_id
        )
 SELECT date(cj.date) AS date,
    cj.user_id,
    COALESCE(ad.calories, (0)::bigint) AS calories,
    COALESCE(ad.carbohydrates, (0)::bigint) AS carbohydrates,
    COALESCE(ad.proteins, (0)::bigint) AS proteins,
    COALESCE(ad.fat, (0)::bigint) AS fat
   FROM (cross_join cj
     LEFT JOIN aggregated_data ad ON (((cj.date = ad.date) AND (cj.user_id = ad.user_id))))
  ORDER BY cj.date, cj.user_id;


create or replace view "public"."v_daily_aggregated_workout_volume" WITH (security_invoker) as  WITH date_series AS (
         SELECT generate_series(((min(food_diary_entries.created_at))::date)::timestamp with time zone, ((max(food_diary_entries.created_at))::date)::timestamp with time zone, '1 day'::interval) AS date
           FROM food_diary_entries
        ), user_ids AS (
         SELECT DISTINCT food_diary_entries.user_id
           FROM food_diary_entries
        ), cross_join AS (
         SELECT ds.date,
            ui.user_id
           FROM (date_series ds
             CROSS JOIN user_ids ui)
        ), aggregated_data AS (
         SELECT date_trunc('day'::text, workout_session_performances.created_at) AS date,
            workout_session_performances.user_id,
            sum(((workout_session_performances.performed_reps)::double precision * workout_session_performances.performed_weight)) AS volume
           FROM workout_session_performances
          GROUP BY (date_trunc('day'::text, workout_session_performances.created_at)), workout_session_performances.user_id
        )
 SELECT date(cj.date) AS date,
    cj.user_id,
    COALESCE(ad.volume, (0)::double precision) AS volume
   FROM (cross_join cj
     LEFT JOIN aggregated_data ad ON (((cj.date = ad.date) AND (cj.user_id = ad.user_id))))
  ORDER BY cj.date, cj.user_id;


create or replace view "public"."v_daily_weights" WITH (security_invoker) as  WITH date_series AS (
         SELECT wt.user_id,
            generate_series((( SELECT min((weights.created_at)::date) AS min
                   FROM weights
                  WHERE (weights.user_id = wt.user_id)))::timestamp with time zone, (CURRENT_DATE)::timestamp with time zone, '1 day'::interval) AS date
           FROM weights wt
          GROUP BY wt.user_id
        ), max_weights_per_day AS (
         SELECT weights.user_id,
            (weights.created_at)::date AS date,
            max(weights.weight) AS weight
           FROM weights
          GROUP BY weights.user_id, ((weights.created_at)::date)
        ), weights_with_filled_nulls AS (
         SELECT ds.user_id,
            ds.date,
            COALESCE(mw.weight, lag(mw.weight, 1) OVER (PARTITION BY ds.user_id ORDER BY ds.date)) AS weight
           FROM (date_series ds
             LEFT JOIN max_weights_per_day mw ON (((ds.date = mw.date) AND (ds.user_id = mw.user_id))))
        )
 SELECT sub.user_id,
    date(sub.date) AS date,
    first_value(sub.weight) OVER (PARTITION BY sub.user_id, sub.grp ORDER BY sub.date) AS weight
   FROM ( SELECT weights_with_filled_nulls.user_id,
            weights_with_filled_nulls.date,
            weights_with_filled_nulls.weight,
            count(weights_with_filled_nulls.weight) OVER (PARTITION BY weights_with_filled_nulls.user_id ORDER BY weights_with_filled_nulls.date) AS grp
           FROM weights_with_filled_nulls) sub
  ORDER BY sub.user_id, (date(sub.date));


create policy "Deletable by owner."
on "public"."food_diaries"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update own food diary."
on "public"."food_diaries"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Viewable by owner."
on "public"."food_diaries"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Writable by users."
on "public"."food_diaries"
as permissive
for insert
to public
with check ((auth.uid() IN ( SELECT profiles.id
   FROM profiles)));


create policy "Deletable by owner."
on "public"."food_diary_entries"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Users can update own food entries."
on "public"."food_diary_entries"
as permissive
for update
to public
using ((auth.uid() = user_id));


create policy "Viewable by owner."
on "public"."food_diary_entries"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Writable by users."
on "public"."food_diary_entries"
as permissive
for insert
to public
with check ((auth.uid() IN ( SELECT profiles.id
   FROM profiles)));




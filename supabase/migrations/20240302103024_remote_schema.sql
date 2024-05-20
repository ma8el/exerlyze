create or replace view "public"."v_daily_aggregated_workout_volume_by_exercise" as  WITH date_series AS (
         SELECT generate_series(((min(workout_session_performances.created_at))::date)::timestamp with time zone, ((max(workout_session_performances.created_at))::date)::timestamp with time zone, '1 day'::interval) AS date
           FROM workout_session_performances
        ), user_ids AS (
         SELECT DISTINCT workout_session_performances.user_id
           FROM workout_session_performances
        ), cross_join AS (
         SELECT ds.date,
            ui.user_id
           FROM (date_series ds
             CROSS JOIN user_ids ui)
        ), aggregated_data AS (
         SELECT date_trunc('day'::text, workout_session_performances.created_at) AS date,
            workout_session_performances.user_id,
            workout_session_performances.exercise_id,
            sum(((workout_session_performances.performed_reps)::double precision * workout_session_performances.performed_weight)) AS volume,
            sum(((workout_session_performances.planned_reps)::double precision * workout_session_performances.planned_weight)) AS planned_volume
           FROM workout_session_performances
          GROUP BY (date_trunc('day'::text, workout_session_performances.created_at)), workout_session_performances.user_id, workout_session_performances.exercise_id
        )
 SELECT date(cj.date) AS date,
    cj.user_id,
    ad.exercise_id,
    COALESCE(ad.volume, (0)::double precision) AS volume,
    COALESCE(ad.planned_volume, (0)::double precision) AS planned_volume
   FROM (cross_join cj
     LEFT JOIN aggregated_data ad ON (((cj.date = ad.date) AND (cj.user_id = ad.user_id))))
  WHERE (ad.exercise_id IS NOT NULL)
  ORDER BY cj.date, cj.user_id;


create or replace view "public"."v_unique_performed_exercises" as  SELECT DISTINCT wv.exercise_id,
    wv.user_id,
    e.name_en,
    e.name_de,
    e.name_fr
   FROM (v_daily_aggregated_workout_volume_by_exercise wv
     JOIN exercises e ON ((wv.exercise_id = e.id)));




create or replace view v_daily_aggregated_workout_volume WITH (security_invoker) as
WITH date_series AS (
    SELECT 
      generate_series(MIN(created_at)::date,
      MAX(created_at)::date,
      '1 day'::interval) AS date
    FROM workout_session_performances
),
user_ids AS (
    SELECT DISTINCT 
      user_id
    FROM workout_session_performances
),
cross_join AS (
    SELECT 
      ds.date,
      ui.user_id
    FROM date_series ds
    CROSS JOIN user_ids ui
),
aggregated_data AS (
    SELECT 
      date_trunc('day', created_at) AS date,
      user_id,
      SUM(performed_reps * performed_weight) AS volume
    FROM workout_session_performances
    GROUP BY 1, 2
)
SELECT 
  date(cj.date) as date,
  cj.user_id,
  COALESCE(ad.volume, 0) AS volume
FROM cross_join cj
LEFT JOIN aggregated_data ad 
ON cj.date = ad.date AND cj.user_id = ad.user_id
ORDER BY cj.date, cj.user_id;
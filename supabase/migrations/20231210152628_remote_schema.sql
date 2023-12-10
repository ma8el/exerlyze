set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.get_weight_change_percentage(start_date date, end_date date)
 RETURNS TABLE(p_date date, weight_change_percentage double precision)
 LANGUAGE plpgsql
AS $function$
DECLARE
    initial_weight INT;
BEGIN
    -- Get the initial weight for the specified timeframe or the earliest available
    SELECT weight INTO initial_weight FROM v_daily_weights
    WHERE date >= COALESCE(
        (SELECT MIN(date) FROM v_daily_weights WHERE user_id = user_id AND date >= start_date),
        start_date
      )
    ORDER BY date
    LIMIT 1;

    -- Return the percentage change in weight for each date within the specified period
    RETURN QUERY
    SELECT date,
        ceil(((w.weight - initial_weight) / NULLIF(initial_weight, 0)::NUMERIC) * 100)
    FROM v_daily_weights w
    WHERE w.date = end_date;
END;
$function$
;



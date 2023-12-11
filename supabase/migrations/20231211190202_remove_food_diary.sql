alter table public.food_diary_entries drop constraint if exists food_diary_entries_food_diary_id_fkey;
drop table if exists public.food_diaries;
alter table public.food_diary_entries drop constraint if exists food_diary_entries_food_diary_id_fkey;
alter table public.food_diary_entries drop column if exists food_diary_id;
drop table if exists public.food_diaries;
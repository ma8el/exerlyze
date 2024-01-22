alter table "public"."profiles" drop constraint "profiles_username_key";

drop index if exists "public"."profiles_username_key";

alter table "public"."profiles" alter column "username" set not null;



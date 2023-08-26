drop policy "Viewable by users." on "public"."days_of_week";

drop policy "Viewable by users." on "public"."exercises";

drop policy "Viewable by users." on "public"."muscles";

create policy "Viewable by all."
on "public"."days_of_week"
as permissive
for select
to public
using (true);


create policy "Viewable by all."
on "public"."exercises"
as permissive
for select
to public
using (true);


create policy "Viewable by all."
on "public"."muscles"
as permissive
for select
to public
using (true);




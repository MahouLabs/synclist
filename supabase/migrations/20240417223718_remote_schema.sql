alter table "public"."home_members" enable row level security;

alter table "public"."recipes" enable row level security;

create policy "Enable insert for authenticated users only"
on "public"."home_members"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users only"
on "public"."home_members"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."recipes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users only"
on "public"."recipes"
as permissive
for select
to authenticated
using (true);




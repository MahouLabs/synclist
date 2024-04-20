create policy "Enable insert for authenticated users only"
on "public"."groceries"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."groceries"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."home_members"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."home_members"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."homes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."homes"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."items"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."items"
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


create policy "Enable select for authenticated users only"
on "public"."recipes"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."recipes_items"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."recipes_items"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."recipes_tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."recipes_tags"
as permissive
for select
to authenticated
using (true);


create policy "Enable insert for authenticated users only"
on "public"."tags"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable select for authenticated users only"
on "public"."tags"
as permissive
for select
to authenticated
using (true);

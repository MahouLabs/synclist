create policy "Enable update for authenticated users only"
on "public"."recipes"
as permissive
for update
to authenticated
using (true)
with check (true);





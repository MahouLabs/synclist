drop policy "Enable insert for authenticated users only" on "public"."bookmarks";

drop policy "Enable read for authenticated users only" on "public"."bookmarks";

drop policy "Enable delete for users based on user_id" on "public"."user_bookmarks";

drop policy "Enable insert for users based on user_id" on "public"."user_bookmarks";

drop policy "Enable read access based on user_id" on "public"."user_bookmarks";

drop policy "Enable update for users based on user_id" on "public"."user_bookmarks";

revoke delete on table "public"."bookmarks" from "anon";

revoke insert on table "public"."bookmarks" from "anon";

revoke references on table "public"."bookmarks" from "anon";

revoke select on table "public"."bookmarks" from "anon";

revoke trigger on table "public"."bookmarks" from "anon";

revoke truncate on table "public"."bookmarks" from "anon";

revoke update on table "public"."bookmarks" from "anon";

revoke delete on table "public"."bookmarks" from "authenticated";

revoke insert on table "public"."bookmarks" from "authenticated";

revoke references on table "public"."bookmarks" from "authenticated";

revoke select on table "public"."bookmarks" from "authenticated";

revoke trigger on table "public"."bookmarks" from "authenticated";

revoke truncate on table "public"."bookmarks" from "authenticated";

revoke update on table "public"."bookmarks" from "authenticated";

revoke delete on table "public"."bookmarks" from "service_role";

revoke insert on table "public"."bookmarks" from "service_role";

revoke references on table "public"."bookmarks" from "service_role";

revoke select on table "public"."bookmarks" from "service_role";

revoke trigger on table "public"."bookmarks" from "service_role";

revoke truncate on table "public"."bookmarks" from "service_role";

revoke update on table "public"."bookmarks" from "service_role";

revoke delete on table "public"."user_bookmarks" from "anon";

revoke insert on table "public"."user_bookmarks" from "anon";

revoke references on table "public"."user_bookmarks" from "anon";

revoke select on table "public"."user_bookmarks" from "anon";

revoke trigger on table "public"."user_bookmarks" from "anon";

revoke truncate on table "public"."user_bookmarks" from "anon";

revoke update on table "public"."user_bookmarks" from "anon";

revoke delete on table "public"."user_bookmarks" from "authenticated";

revoke insert on table "public"."user_bookmarks" from "authenticated";

revoke references on table "public"."user_bookmarks" from "authenticated";

revoke select on table "public"."user_bookmarks" from "authenticated";

revoke trigger on table "public"."user_bookmarks" from "authenticated";

revoke truncate on table "public"."user_bookmarks" from "authenticated";

revoke update on table "public"."user_bookmarks" from "authenticated";

revoke delete on table "public"."user_bookmarks" from "service_role";

revoke insert on table "public"."user_bookmarks" from "service_role";

revoke references on table "public"."user_bookmarks" from "service_role";

revoke select on table "public"."user_bookmarks" from "service_role";

revoke trigger on table "public"."user_bookmarks" from "service_role";

revoke truncate on table "public"."user_bookmarks" from "service_role";

revoke update on table "public"."user_bookmarks" from "service_role";

alter table "public"."bookmarks" drop constraint "bookmarks_id_key";

alter table "public"."user_bookmarks" drop constraint "user_bookmarks_bookmark_id_fkey";

alter table "public"."user_bookmarks" drop constraint "user_bookmarks_user_id_fkey";

alter table "public"."bookmarks" drop constraint "bookmarks_pkey";

alter table "public"."user_bookmarks" drop constraint "user_bookmarks_pkey";

drop index if exists "public"."bookmarks_id_key";

drop index if exists "public"."bookmarks_pkey";

drop index if exists "public"."user_bookmarks_pkey";

drop table "public"."bookmarks";

drop table "public"."user_bookmarks";

create table "public"."home_members" (
    "home_id" character varying(25) not null,
    "user_id" uuid not null
);


create table "public"."homes" (
    "id" character varying(25) not null,
    "name" text not null,
    "owner_id" uuid not null,
    "cookbook_id" character varying(25) not null
);


alter table "public"."homes" enable row level security;

create table "public"."recipes" (
    "id" character varying(25) not null,
    "cookbook_id" character varying(25) not null,
    "name" character varying(255) not null,
    "picture_url" text,
    "ingredients" json not null,
    "steps" json not null
);


CREATE UNIQUE INDEX home_members_pkey ON public.home_members USING btree (home_id, user_id);

CREATE UNIQUE INDEX homes_pkey ON public.homes USING btree (id);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

alter table "public"."home_members" add constraint "home_members_pkey" PRIMARY KEY using index "home_members_pkey";

alter table "public"."homes" add constraint "homes_pkey" PRIMARY KEY using index "homes_pkey";

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."home_members" add constraint "home_members_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) not valid;

alter table "public"."home_members" validate constraint "home_members_home_id_fkey";

alter table "public"."home_members" add constraint "home_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."home_members" validate constraint "home_members_user_id_fkey";

alter table "public"."homes" add constraint "homes_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) not valid;

alter table "public"."homes" validate constraint "homes_owner_id_fkey";

grant delete on table "public"."home_members" to "anon";

grant insert on table "public"."home_members" to "anon";

grant references on table "public"."home_members" to "anon";

grant select on table "public"."home_members" to "anon";

grant trigger on table "public"."home_members" to "anon";

grant truncate on table "public"."home_members" to "anon";

grant update on table "public"."home_members" to "anon";

grant delete on table "public"."home_members" to "authenticated";

grant insert on table "public"."home_members" to "authenticated";

grant references on table "public"."home_members" to "authenticated";

grant select on table "public"."home_members" to "authenticated";

grant trigger on table "public"."home_members" to "authenticated";

grant truncate on table "public"."home_members" to "authenticated";

grant update on table "public"."home_members" to "authenticated";

grant delete on table "public"."home_members" to "service_role";

grant insert on table "public"."home_members" to "service_role";

grant references on table "public"."home_members" to "service_role";

grant select on table "public"."home_members" to "service_role";

grant trigger on table "public"."home_members" to "service_role";

grant truncate on table "public"."home_members" to "service_role";

grant update on table "public"."home_members" to "service_role";

grant delete on table "public"."homes" to "anon";

grant insert on table "public"."homes" to "anon";

grant references on table "public"."homes" to "anon";

grant select on table "public"."homes" to "anon";

grant trigger on table "public"."homes" to "anon";

grant truncate on table "public"."homes" to "anon";

grant update on table "public"."homes" to "anon";

grant delete on table "public"."homes" to "authenticated";

grant insert on table "public"."homes" to "authenticated";

grant references on table "public"."homes" to "authenticated";

grant select on table "public"."homes" to "authenticated";

grant trigger on table "public"."homes" to "authenticated";

grant truncate on table "public"."homes" to "authenticated";

grant update on table "public"."homes" to "authenticated";

grant delete on table "public"."homes" to "service_role";

grant insert on table "public"."homes" to "service_role";

grant references on table "public"."homes" to "service_role";

grant select on table "public"."homes" to "service_role";

grant trigger on table "public"."homes" to "service_role";

grant truncate on table "public"."homes" to "service_role";

grant update on table "public"."homes" to "service_role";

grant delete on table "public"."recipes" to "anon";

grant insert on table "public"."recipes" to "anon";

grant references on table "public"."recipes" to "anon";

grant select on table "public"."recipes" to "anon";

grant trigger on table "public"."recipes" to "anon";

grant truncate on table "public"."recipes" to "anon";

grant update on table "public"."recipes" to "anon";

grant delete on table "public"."recipes" to "authenticated";

grant insert on table "public"."recipes" to "authenticated";

grant references on table "public"."recipes" to "authenticated";

grant select on table "public"."recipes" to "authenticated";

grant trigger on table "public"."recipes" to "authenticated";

grant truncate on table "public"."recipes" to "authenticated";

grant update on table "public"."recipes" to "authenticated";

grant delete on table "public"."recipes" to "service_role";

grant insert on table "public"."recipes" to "service_role";

grant references on table "public"."recipes" to "service_role";

grant select on table "public"."recipes" to "service_role";

grant trigger on table "public"."recipes" to "service_role";

grant truncate on table "public"."recipes" to "service_role";

grant update on table "public"."recipes" to "service_role";

create policy "Enable insert for authenticated users only"
on "public"."homes"
as permissive
for insert
to authenticated
with check (true);


create policy "Enable read access for authenticated users only"
on "public"."homes"
as permissive
for select
to authenticated
using (true);





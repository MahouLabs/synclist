-- home first
create table "public"."homes" (
    "id" character varying(25) not null,
    "name" text not null,
    "owner_id" uuid not null,
    "created_at" timestamp with time zone default now() not null
);

CREATE UNIQUE INDEX homes_pkey ON public.homes USING btree (id);

alter table "public"."homes" add constraint "homes_pkey" PRIMARY KEY using index "homes_pkey";

alter table "public"."homes" add constraint "homes_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) not valid;

alter table "public"."homes" validate constraint "homes_owner_id_fkey";

alter table "public"."homes" enable row level security;

create table "public"."home_members" (
    "home_id" character varying(25) not null,
    "user_id" uuid not null,
    "last_accessed" boolean DEFAULT false
);

CREATE UNIQUE INDEX home_members_pkey ON public.home_members USING btree (home_id, user_id);

-- now home members
alter table "public"."home_members" add constraint "home_members_pkey" PRIMARY KEY using index "home_members_pkey";

alter table "public"."home_members" add constraint "home_members_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) not valid;

alter table "public"."home_members" validate constraint "home_members_home_id_fkey";

alter table "public"."home_members" add constraint "home_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."home_members" validate constraint "home_members_user_id_fkey";

-- recipes
create table "public"."recipes" (
    "id" character varying(25) not null,
    "title" character varying(255) not null,
    "description" character varying(255) null,
    "ingredients" jsonb not null,
    "steps" jsonb not null,
    "belongs_to" character varying(25) not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now() not null
);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."recipes" add constraint "recipes_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."recipes" validate constraint "recipes_created_by_fkey";

alter table "public"."recipes" add constraint "recipes_belongs_to_fkey" FOREIGN KEY (belongs_to) REFERENCES homes(id) not valid;

alter table "public"."recipes" validate constraint "recipes_belongs_to_fkey";

-- groceries
create table "public"."groceries" (
    "id" character varying(25) not null,
    "name" character varying(255) not null,
    "completed" boolean not null,
    "belongs_to" character varying(25) not null,
    "created_by" uuid not null,
    "created_at" timestamp with time zone default now() not null
);

CREATE UNIQUE INDEX groceries_pkey ON public.groceries USING btree (id);

alter table "public"."groceries" add constraint "groceries_pkey" PRIMARY KEY using index "groceries_pkey";

alter table "public"."groceries" add constraint "groceries_created_by_fkey" FOREIGN KEY (created_by) REFERENCES auth.users(id) not valid;

alter table "public"."groceries" validate constraint "groceries_created_by_fkey";

alter table "public"."groceries" validate constraint "groceries_belongs_to_fkey";

-- groceries_recipes
create table "public"."groceries_recipes" (
    "grocery_id" character varying(25) not null,
    "recipe_id" character varying(25) not null,
    "amount" integer not null
);

CREATE UNIQUE INDEX groceries_recipes_pkey ON public.groceries_recipes USING btree (grocery_id, recipe_id);

alter table "public"."groceries_recipes" add constraint "groceries_recipes_pkey" PRIMARY KEY using index "groceries_recipes_pkey";

alter table "public"."groceries_recipes" validate constraint "groceries_recipes_grocery_id_fkey";

alter table "public"."groceries_recipes" validate constraint "groceries_recipes_recipe_id_fkey";

-- permissions
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





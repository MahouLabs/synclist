create table "public"."homes" (
    "id" character varying not null,
    "name" text not null,
    "owner_id" uuid not null default auth.uid()
);

alter table "public"."homes" enable row level security;

create table "public"."home_members" (
    "home_id" character varying not null,
    "user_id" uuid not null,
    "active" boolean not null default false
);

alter table "public"."home_members" enable row level security;

create table "public"."groceries" (
    "home_id" character varying not null,
    "item_id" character varying not null,
    "amount" smallint not null,
    "bought" boolean not null default false
);

alter table "public"."groceries" enable row level security;

create table "public"."items" (
    "id" character varying not null,
    "home_id" character varying not null,
    "name" text not null
);

alter table "public"."items" enable row level security;

create table "public"."recipes" (
    "id" character varying not null ,
    "home_id" character varying not null,
    "title" text not null,
    "description" text,
    "steps" jsonb[] not null default '{}'::jsonb[],
    "servings" smallint not null default 0
);

alter table "public"."recipes" enable row level security;

create table "public"."recipes_items" (
    "recipe_id" character varying not null,
    "item_id" character varying not null,
    "amount" smallint not null
);

alter table "public"."recipes_items" enable row level security;

create table "public"."recipes_tags" (
    "tag_id" character varying not null,
    "recipe_id" character varying not null
);

alter table "public"."recipes_tags" enable row level security;

create table "public"."tags" (
    "id" character varying not null,
    "home_id" character varying not null,
    "name" text not null,
    "color" character varying not null
);

alter table "public"."tags" enable row level security;

CREATE UNIQUE INDEX groceries_pkey ON public.groceries USING btree (home_id, item_id);

CREATE UNIQUE INDEX home_members_pkey ON public.home_members USING btree (home_id, user_id);

CREATE UNIQUE INDEX homes_pkey ON public.homes USING btree (id);

CREATE UNIQUE INDEX items_pkey ON public.items USING btree (id);

CREATE UNIQUE index items_name_home_id_key ON public.items (name, home_id);

CREATE UNIQUE INDEX recipe_items_pkey ON public.recipes_items USING btree (item_id, recipe_id);

CREATE UNIQUE INDEX recipes_pkey ON public.recipes USING btree (id);

CREATE UNIQUE INDEX recipes_tags_pkey ON public.recipes_tags USING btree (tag_id, recipe_id);

CREATE UNIQUE INDEX tags_pkey ON public.tags USING btree (id);

alter table "public"."groceries" add constraint "groceries_pkey" PRIMARY KEY using index "groceries_pkey";

alter table "public"."home_members" add constraint "home_members_pkey" PRIMARY KEY using index "home_members_pkey";

alter table "public"."homes" add constraint "homes_pkey" PRIMARY KEY using index "homes_pkey";

alter table "public"."items" add constraint "items_pkey" PRIMARY KEY using index "items_pkey";

alter table "public"."recipes" add constraint "recipes_pkey" PRIMARY KEY using index "recipes_pkey";

alter table "public"."recipes_items" add constraint "recipe_items_pkey" PRIMARY KEY using index "recipe_items_pkey";

alter table "public"."recipes_tags" add constraint "recipes_tags_pkey" PRIMARY KEY using index "recipes_tags_pkey";

alter table "public"."tags" add constraint "tags_pkey" PRIMARY KEY using index "tags_pkey";

alter table "public"."groceries" add constraint "public_groceries_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."groceries" validate constraint "public_groceries_home_id_fkey";

alter table "public"."groceries" add constraint "public_groceries_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."groceries" validate constraint "public_groceries_item_id_fkey";

alter table "public"."home_members" add constraint "public_home_members_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."home_members" validate constraint "public_home_members_home_id_fkey";

alter table "public"."home_members" add constraint "public_home_members_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."home_members" validate constraint "public_home_members_user_id_fkey";

alter table "public"."homes" add constraint "public_homes_owner_id_fkey" FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."homes" validate constraint "public_homes_owner_id_fkey";

alter table "public"."items" add constraint "public_items_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."items" validate constraint "public_items_home_id_fkey";

alter table "public"."recipes" add constraint "public_recipes_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes" validate constraint "public_recipes_home_id_fkey";

alter table "public"."recipes_items" add constraint "public_recipe_items_item_id_fkey" FOREIGN KEY (item_id) REFERENCES items(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_items" validate constraint "public_recipe_items_item_id_fkey";

alter table "public"."recipes_items" add constraint "public_recipe_items_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_items" validate constraint "public_recipe_items_recipe_id_fkey";

alter table "public"."recipes_tags" add constraint "public_recipes_tags_recipe_id_fkey" FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_tags" validate constraint "public_recipes_tags_recipe_id_fkey";

alter table "public"."recipes_tags" add constraint "public_recipes_tags_tag_id_fkey" FOREIGN KEY (tag_id) REFERENCES tags(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."recipes_tags" validate constraint "public_recipes_tags_tag_id_fkey";

alter table "public"."tags" add constraint "public_tags_home_id_fkey" FOREIGN KEY (home_id) REFERENCES homes(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."tags" validate constraint "public_tags_home_id_fkey";

grant delete on table "public"."groceries" to "anon";

grant insert on table "public"."groceries" to "anon";

grant references on table "public"."groceries" to "anon";

grant select on table "public"."groceries" to "anon";

grant trigger on table "public"."groceries" to "anon";

grant truncate on table "public"."groceries" to "anon";

grant update on table "public"."groceries" to "anon";

grant delete on table "public"."groceries" to "authenticated";

grant insert on table "public"."groceries" to "authenticated";

grant references on table "public"."groceries" to "authenticated";

grant select on table "public"."groceries" to "authenticated";

grant trigger on table "public"."groceries" to "authenticated";

grant truncate on table "public"."groceries" to "authenticated";

grant update on table "public"."groceries" to "authenticated";

grant delete on table "public"."groceries" to "service_role";

grant insert on table "public"."groceries" to "service_role";

grant references on table "public"."groceries" to "service_role";

grant select on table "public"."groceries" to "service_role";

grant trigger on table "public"."groceries" to "service_role";

grant truncate on table "public"."groceries" to "service_role";

grant update on table "public"."groceries" to "service_role";

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

grant delete on table "public"."items" to "anon";

grant insert on table "public"."items" to "anon";

grant references on table "public"."items" to "anon";

grant select on table "public"."items" to "anon";

grant trigger on table "public"."items" to "anon";

grant truncate on table "public"."items" to "anon";

grant update on table "public"."items" to "anon";

grant delete on table "public"."items" to "authenticated";

grant insert on table "public"."items" to "authenticated";

grant references on table "public"."items" to "authenticated";

grant select on table "public"."items" to "authenticated";

grant trigger on table "public"."items" to "authenticated";

grant truncate on table "public"."items" to "authenticated";

grant update on table "public"."items" to "authenticated";

grant delete on table "public"."items" to "service_role";

grant insert on table "public"."items" to "service_role";

grant references on table "public"."items" to "service_role";

grant select on table "public"."items" to "service_role";

grant trigger on table "public"."items" to "service_role";

grant truncate on table "public"."items" to "service_role";

grant update on table "public"."items" to "service_role";

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

grant delete on table "public"."recipes_items" to "anon";

grant insert on table "public"."recipes_items" to "anon";

grant references on table "public"."recipes_items" to "anon";

grant select on table "public"."recipes_items" to "anon";

grant trigger on table "public"."recipes_items" to "anon";

grant truncate on table "public"."recipes_items" to "anon";

grant update on table "public"."recipes_items" to "anon";

grant delete on table "public"."recipes_items" to "authenticated";

grant insert on table "public"."recipes_items" to "authenticated";

grant references on table "public"."recipes_items" to "authenticated";

grant select on table "public"."recipes_items" to "authenticated";

grant trigger on table "public"."recipes_items" to "authenticated";

grant truncate on table "public"."recipes_items" to "authenticated";

grant update on table "public"."recipes_items" to "authenticated";

grant delete on table "public"."recipes_items" to "service_role";

grant insert on table "public"."recipes_items" to "service_role";

grant references on table "public"."recipes_items" to "service_role";

grant select on table "public"."recipes_items" to "service_role";

grant trigger on table "public"."recipes_items" to "service_role";

grant truncate on table "public"."recipes_items" to "service_role";

grant update on table "public"."recipes_items" to "service_role";

grant delete on table "public"."recipes_tags" to "anon";

grant insert on table "public"."recipes_tags" to "anon";

grant references on table "public"."recipes_tags" to "anon";

grant select on table "public"."recipes_tags" to "anon";

grant trigger on table "public"."recipes_tags" to "anon";

grant truncate on table "public"."recipes_tags" to "anon";

grant update on table "public"."recipes_tags" to "anon";

grant delete on table "public"."recipes_tags" to "authenticated";

grant insert on table "public"."recipes_tags" to "authenticated";

grant references on table "public"."recipes_tags" to "authenticated";

grant select on table "public"."recipes_tags" to "authenticated";

grant trigger on table "public"."recipes_tags" to "authenticated";

grant truncate on table "public"."recipes_tags" to "authenticated";

grant update on table "public"."recipes_tags" to "authenticated";

grant delete on table "public"."recipes_tags" to "service_role";

grant insert on table "public"."recipes_tags" to "service_role";

grant references on table "public"."recipes_tags" to "service_role";

grant select on table "public"."recipes_tags" to "service_role";

grant trigger on table "public"."recipes_tags" to "service_role";

grant truncate on table "public"."recipes_tags" to "service_role";

grant update on table "public"."recipes_tags" to "service_role";

grant delete on table "public"."tags" to "anon";

grant insert on table "public"."tags" to "anon";

grant references on table "public"."tags" to "anon";

grant select on table "public"."tags" to "anon";

grant trigger on table "public"."tags" to "anon";

grant truncate on table "public"."tags" to "anon";

grant update on table "public"."tags" to "anon";

grant delete on table "public"."tags" to "authenticated";

grant insert on table "public"."tags" to "authenticated";

grant references on table "public"."tags" to "authenticated";

grant select on table "public"."tags" to "authenticated";

grant trigger on table "public"."tags" to "authenticated";

grant truncate on table "public"."tags" to "authenticated";

grant update on table "public"."tags" to "authenticated";

grant delete on table "public"."tags" to "service_role";

grant insert on table "public"."tags" to "service_role";

grant references on table "public"."tags" to "service_role";

grant select on table "public"."tags" to "service_role";

grant trigger on table "public"."tags" to "service_role";

grant truncate on table "public"."tags" to "service_role";

grant update on table "public"."tags" to "service_role";




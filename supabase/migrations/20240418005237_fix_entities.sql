ALTER TABLE "public"."homes" DROP COLUMN "cookbook_id";

ALTER TABLE "public"."recipes" DROP COLUMN "cookbook_id";
ALTER TABLE "public"."recipes" RENAME COLUMN "name" TO "title";
ALTER TABLE "public"."recipes" ADD COLUMN "description" character varying(255);

ALTER TABLE "public"."homes" ADD COLUMN "last_accessed" boolean DEFAULT false;

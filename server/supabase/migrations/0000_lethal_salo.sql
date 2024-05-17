CREATE TABLE IF NOT EXISTS "catalog" (
	"profile_name" varchar(100) NOT NULL,
	"post_link" varchar(100) NOT NULL,
	"items" jsonb DEFAULT '{"icon":"","name":"","enchantMods":"","implicitMods":"","fracturedMods":"","craftedMods":"","crucibleMods":""}'::jsonb NOT NULL,
	CONSTRAINT "catalog_post_link_unique" UNIQUE("post_link")
);

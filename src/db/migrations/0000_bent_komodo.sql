CREATE TABLE IF NOT EXISTS "mar_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"guid" varchar(255) NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"link" text NOT NULL,
	"thumbnail_url" text NOT NULL,
	"spotify_link" text,
	"published_date" timestamp NOT NULL,
	"bsky_post_url" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "mar_reviews_guid_unique" UNIQUE("guid"),
	CONSTRAINT "mar_reviews_bsky_post_url_unique" UNIQUE("bsky_post_url")
);

CREATE TABLE IF NOT EXISTS "mar_spotify_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"access_token" varchar NOT NULL,
	"refresh_token" varchar NOT NULL,
	"expires_at" timestamp NOT NULL
);

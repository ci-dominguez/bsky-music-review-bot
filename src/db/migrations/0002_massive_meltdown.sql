ALTER TABLE "mar_reviews" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "mar_reviews" ADD COLUMN "is_posted" boolean DEFAULT false NOT NULL;
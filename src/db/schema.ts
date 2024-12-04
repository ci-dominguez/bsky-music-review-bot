import { pgTable, serial, varchar, text, timestamp } from 'drizzle-orm/pg-core';

export const reviews = pgTable('mar_reviews', {
  id: serial('id').primaryKey(),
  guid: varchar('guid', { length: 255 }).notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  link: text('link').notNull(),
  thumbnailUrl: text('thumbnail_url').notNull(),
  spotifyLink: text('spotify_link'),
  publishedDate: timestamp('published_date').notNull(),
  bskyPostUrl: text('bsky_post_url').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

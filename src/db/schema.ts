import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';

export const reviews = pgTable('mar_reviews', {
  id: serial('id').primaryKey(),
  guid: varchar('guid', { length: 255 }).notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  link: text('link').notNull(),
  category: text('category'),
  thumbnailUrl: text('thumbnail_url').notNull(),
  spotifyLink: text('spotify_link'),
  publishedDate: timestamp('published_date').notNull(),
  isPosted: boolean('is_posted').default(false).notNull(),
  bskyPostUrl: text('bsky_post_url').unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const spotifyTokens = pgTable('mar_spotify_tokens', {
  id: serial('id').primaryKey(),
  accessToken: varchar('access_token').notNull(),
  refreshToken: varchar('refresh_token').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
});

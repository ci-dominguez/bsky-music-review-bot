import { db } from '../db/db';
import { asc, eq } from 'drizzle-orm';
import { reviews } from '../db/schema';
import { Review } from '../interfaces';

export const getAllGuids = async (): Promise<string[]> => {
  try {
    const guids = await db
      .select({ guid: reviews.guid })
      .from(reviews)
      .orderBy(asc(reviews.publishedDate));

    return guids.map((guid) => guid.guid);
  } catch (error) {
    console.error('Error getting guids:', error);
    throw error;
  }
};

export const storeAndGetReview = async (review: Review): Promise<number> => {
  try {
    const [newReview] = await db
      .insert(reviews)
      .values({
        guid: review.guid,
        title: review.title,
        description: review.description,
        link: review.link,
        thumbnailUrl: review.thumbnailUrl,
        publishedDate: review.publishedDate,
      })
      .returning({ id: reviews.id });

    return newReview.id;
  } catch (error) {
    console.error('Error storing review:', error);
    throw error;
  }
};

export const updateReviewWithPostUrl = async (
  reviewId: number,
  postUrl: string
) => {
  try {
    await db
      .update(reviews)
      .set({ bskyPostUrl: postUrl, updatedAt: new Date() })
      .where(eq(reviews.id, reviewId));
  } catch (error) {
    console.error('Error updating review with post url:', error);
    throw error;
  }
};

export const updateReviewWithSpotifyLink = async (
  reviewId: number,
  spotifyLink: string
) => {
  try {
    await db
      .update(reviews)
      .set({ spotifyLink: spotifyLink, updatedAt: new Date() })
      .where(eq(reviews.id, reviewId));
  } catch (error) {
    console.error('Error updating review with spotify link:', error);
    throw error;
  }
};

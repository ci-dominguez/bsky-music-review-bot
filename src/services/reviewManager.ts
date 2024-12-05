import { db } from '../db/db';
import { eq, asc } from 'drizzle-orm';
import { reviews } from '../db/schema';
import { Review } from '../interfaces';

export const getAllReviews = async (): Promise<Review[]> => {
  try {
    const allReviews = await db
      .select()
      .from(reviews)
      .orderBy(asc(reviews.publishedDate));

    return allReviews.map((review) => review) as Review[];
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
};

export const getReviewByGuid = async (guid: string): Promise<Review> => {
  try {
    const review = await db
      .select({
        id: reviews.id,
        guid: reviews.guid,
        title: reviews.title,
        description: reviews.description,
        link: reviews.link,
        category: reviews.category,
        thumbnailUrl: reviews.thumbnailUrl,
        publishedDate: reviews.publishedDate,
        isPosted: reviews.isPosted,
      })
      .from(reviews)
      .where(eq(reviews.guid, guid))
      .limit(1);

    return review[0] as Review;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
};

export const storeAndGetReviewId = async (review: Review): Promise<number> => {
  try {
    const [newReview] = await db
      .insert(reviews)
      .values({
        guid: review.guid,
        title: review.title,
        description: review.description,
        link: review.link,
        category: review.category,
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
      .set({ bskyPostUrl: postUrl, isPosted: true, updatedAt: new Date() })
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

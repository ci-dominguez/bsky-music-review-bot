import { postReview } from '../api/bsky';
import { fetchRSSFeed } from '../api/pitchfork';
import {
  getAllReviews,
  getReviewByGuid,
  storeAndGetReviewId,
  updateReviewWithPostUrl,
} from './reviewManager';

const TRACKS_RSS_URL = 'https://pitchfork.com/feed/feed-track-reviews/rss';
const ALBUMS_RSS_URL = 'https://pitchfork.com/feed/feed-album-reviews/rss';

export const fetchAndProcessReviews = async () => {
  try {
    const storedReviews = await getAllReviews();

    //True if all stored reviews have been posted (isPosted = true)
    const allPosted = storedReviews.every((review) => review.isPosted);

    // Fetch new reviews. Store all reviews but only post the newest one.
    if (allPosted) {
      const newestStoredReviewDate = storedReviews.reduce((latest, review) => {
        return review.publishedDate > latest ? review.publishedDate : latest;
      }, new Date(0));

      const trackReviews = await fetchRSSFeed(TRACKS_RSS_URL);
      const albumReviews = await fetchRSSFeed(ALBUMS_RSS_URL);

      let reviews = [...trackReviews, ...albumReviews];

      // Filter and sort new reviews newest to oldest
      reviews = reviews
        .filter((review) => review.publishedDate > newestStoredReviewDate)
        .sort((a, b) => a.publishedDate.getTime() - b.publishedDate.getTime());

      console.log(
        'Filtered and sorted new reviews from Pitchfork RSS:',
        reviews
      );

      // Store all reviews
      for (const review of reviews) {
        await storeAndGetReviewId(review);
      }

      // Post only the newest reviews
      if (reviews.length > 0) {
        const newestReview = await getReviewByGuid(
          reviews[reviews.length - 1].guid
        );

        //TODO: fetch and store spotify URL for review subject

        const postUrl = await postReview(newestReview);
        await updateReviewWithPostUrl(newestReview.id!, postUrl);
      }
    } else {
      //Post newest stored review
      for (const review of storedReviews) {
        if (!review.isPosted) {
          //TODO: fetch and store spotify URL for review subject

          const postUrl = await postReview(review);
          await updateReviewWithPostUrl(review.id!, postUrl);
          break;
        }
      }
    }
  } catch (error) {
    console.error('Error processing reviews:', error);
    throw error;
  }
};

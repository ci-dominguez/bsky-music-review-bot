import { postReview } from '../api/bsky';
import { fetchRSSFeed } from '../api/pitchfork';
import {
  getAllGuids,
  storeAndGetReviewId,
  updateReviewWithPostUrl,
} from './reviewManager';

const TRACKS_RSS_URL = 'https://pitchfork.com/feed/feed-track-reviews/rss';
const ALBUMS_RSS_URL = 'https://pitchfork.com/feed/feed-album-reviews/rss';

export const fetchAndProcessReviews = async () => {
  try {
    const trackReviews = await fetchRSSFeed(TRACKS_RSS_URL);
    const albumReviews = await fetchRSSFeed(ALBUMS_RSS_URL);

    const reviews = [...trackReviews, ...albumReviews];

    reviews.sort(
      (a, b) => a.publishedDate.getTime() - b.publishedDate.getTime()
    );

    // Get all stored guis for reviews in ascending order
    const postedGuids = await getAllGuids();

    // Loop through the reviews and post new ones. If one gets posted then stop looping
    for (const review of reviews) {
      if (!postedGuids.includes(review.guid)) {
        //create & store review data on db
        console.log('Posting review:', review);
        const newReviewId = await storeAndGetReviewId(review);
        //post review to bsky
        const postUrl = await postReview(review);
        //update review in db with bsky post url
        await updateReviewWithPostUrl(newReviewId, postUrl);

        break;
      }
    }
  } catch (error) {
    console.error('Error processing reviews:', error);
    throw error;
  }
};

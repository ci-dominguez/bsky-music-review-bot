import { fetchRSSFeed } from '../api/pitchfork';

const TRACKS_RSS_URL = 'https://pitchfork.com/feed/feed-track-reviews/rss';
const ALBUMS_RSS_URL = 'https://pitchfork.com/feed/feed-album-reviews/rss';

export const fetchAndProcessReviews = async () => {
  try {
    const trackReviews = await fetchRSSFeed(TRACKS_RSS_URL);
    const albumReviews = await fetchRSSFeed(ALBUMS_RSS_URL);

    const reviews = [...trackReviews, ...albumReviews].sort(
      (a, b) => a.publishedDate.getTime() - b.publishedDate.getTime()
    );

    // Get all stored guis for reviews
    const postedGuids = [''];

    // Loop through the reviews and post new ones. If one gets posted then stop looping
    for (const review of reviews) {
      if (!postedGuids.includes(review.guid)) {
        // Post review

        // Mark review as posted

        console.log('Posted Review URL');
        break;
      }
    }
  } catch (error) {
    console.error('Error processing reviews:', error);
    throw error;
  }
};

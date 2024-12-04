import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Review } from '../interfaces';

const TRACKS_RSS_URL = 'https://pitchfork.com/feed/feed-track-reviews/rss';
const ALBUMS_RSS_URL = 'https://pitchfork.com/feed/feed-album-reviews/rss';

export const fetchRSSFeed = async (url: string): Promise<Review> => {
  let review;

  try {
    const resp = await axios.get(url);
    const data = await parseStringPromise(resp.data, {
      explicitArray: false,
    });

    console.log('Fetched Review:', data.rss.channel.item[0]);
    console.log('Img URL:', data.rss.channel.item[0]['media:thumbnail'].$.url);

    review = {
      title: data.rss.channel.item[0].title,
      link: data.rss.channel.item[0].link,
      guid: data.rss.channel.item[0].guid._,
      description: data.rss.channel.item[0].description,
      thumbnailUrl: data.rss.channel.item[0]['media:thumbnail'].$.url,
      spotifyLink: '',
    } as Review;

    console.log('Review Obtained:', review);
    return review;
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
};

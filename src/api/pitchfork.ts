import axios from 'axios';
import { parseStringPromise } from 'xml2js';
import { Review } from '../interfaces';

export const fetchRSSFeed = async (url: string): Promise<Review[]> => {
  try {
    const resp = await axios.get(url);
    const data = await parseStringPromise(resp.data, {
      explicitArray: false,
    });

    // console.log('RSS Data:', data.rss.channel.item);

    const items = data.rss.channel.item;

    return items.map((item: any) => ({
      title: item.title,
      link: item.link,
      guid: item.guid._,
      description: item.description,
      thumbnailUrl: item['media:thumbnail'].$.url,
      publishedDate: new Date(item.pubDate),
    }));
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw error;
  }
};

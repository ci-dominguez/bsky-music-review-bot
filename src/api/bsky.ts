import { AtpAgent, RichText } from '@atproto/api';
import * as dotenv from 'dotenv';
import { Review } from '../interfaces';

dotenv.config();

let agent: AtpAgent | null = null;

export const LoginToBSky = async (): Promise<AtpAgent> => {
  try {
    if (!agent) {
      agent = new AtpAgent({ service: 'https://bsky.social' });
      await agent.login({
        identifier: process.env.BSKY_HANDLE!,
        password: process.env.BSKY_PASSWORD!,
      });
      console.log('Successfully logged into Bluesky');
    }

    return agent;
  } catch (error) {
    console.error('Failed to log into Bluesky:', error);
    throw error;
  }
};

const getAgent = async (): Promise<AtpAgent> => {
  if (!agent) {
    console.warn('Agent not initialized. Logging in again...');
    return await LoginToBSky();
  }
  return agent;
};

export const postReview = async (
  review: Review,
  spotifyLink: string
): Promise<string> => {
  try {
    const agent = await getAgent();

    let rt = new RichText({
      text: `${review.description}\n\nFull review: ${review.link.slice(
        9
      )}\nListen on Spotify: ${spotifyLink.slice(9) || 'N/A'}`,
    });

    // Shorten the post to 300 characters (post char limit) if needed
    if (rt.length > 300) {
      const charDiff = rt.text.length - 300;
      rt = new RichText({
        text: `${review.description.slice(
          0,
          review.description.length - (charDiff + 4)
        )}...\n\nFull review: ${review.link.slice(9)}\nListen on Spotify: ${
          spotifyLink.slice(9) || 'N/A'
        }`,
      });
    }

    await rt.detectFacets(agent);

    const resp = await agent.post({
      $type: 'app.bsky.feed.post',
      text: rt.text,
      facets: rt.facets,
      createdAt: new Date().toISOString(),
      embed: {
        $type: 'app.bsky.embed.external',
        external: {
          uri: review.link,
          title: review.title,
          description: review.description,
        },
      },
    });

    const uriParts = resp.uri.split('/');
    const user = uriParts[2];
    const postId = uriParts[4];

    console.log(
      `Review posted successfully: https://bsky.app/profile/${user}/post/${postId}`
    );

    return `https://bsky.app/profile/${user}/post/${postId}`;
  } catch (error: any) {
    console.error('Failed to post review:', error);
    throw error;
  }
};

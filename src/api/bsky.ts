import { AtpAgent, RichText } from '@atproto/api';
import sharp from 'sharp';
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
      text: `${review.description}\n\nRead More: ${review.link}\nListen Here: ${
        spotifyLink || 'N/A'
      }`,
    });

    // Shorten the post to 300 characters (post char limit) if needed
    if (rt.length > 300) {
      const charDiff = rt.text.length - 300;
      rt = new RichText({
        text: `${review.description.slice(
          0,
          review.description.length - (charDiff + 4)
        )}...\n\nRead More: ${review.link}\nListen Here: ${
          spotifyLink || 'N/A'
        }`,
      });
    }

    await rt.detectFacets(agent);

    //Check and resize thumbnail if needed
    const thumbResp = await fetch(review.thumbnailUrl);
    const sizeInBytes = parseInt(
      thumbResp.headers.get('content-length') || '0',
      10
    );

    let thumbBuffer;

    // Check if resizing is necessary (976.56KB file size limit on bsky)
    if (sizeInBytes > 976 * 1024) {
      // Resize
      const originalBuffer = await thumbResp.arrayBuffer();
      thumbBuffer = await sharp(Buffer.from(originalBuffer))
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
    } else {
      thumbBuffer = await thumbResp.arrayBuffer();
    }

    // Upload thumbnail as blob
    const thumbBlobResp = await agent.uploadBlob(new Uint8Array(thumbBuffer), {
      encoding: 'image/jpeg',
    });

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
          thumb: thumbBlobResp.data.blob,
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

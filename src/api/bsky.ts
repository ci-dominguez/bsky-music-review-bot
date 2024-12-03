import { AtpAgent } from '@atproto/api';
import * as dotenv from 'dotenv';

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

export const getAgent = async (): Promise<AtpAgent> => {
  if (!agent) {
    console.warn('Agent not initialized. Logging in again...');
    return await LoginToBSky();
  }
  return agent;
};

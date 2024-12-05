import cron from 'node-cron';
import { fetchAndProcessReviews } from './services/processor';
import { LoginToBSky } from './api/bsky';
// import { getAccessToken } from './api/spotify';
const startBot = async () => {
  console.log('Starting Mar...');
  await LoginToBSky();

  cron.schedule(
    '0 9,14,19 * * *',
    async () => {
      await fetchAndProcessReviews();
    },
    { timezone: 'America/Los_Angeles' }
  );
  // try {
  //   await getAccessToken(process.env.SPOTIFY_INITIAL_AUTH_CODE!);
  // } catch (error) {
  //   console.error('Error testing Spotify integration:', error);
  // }
};

startBot();

import cron from 'node-cron';
import { fetchAndProcessReviews } from './services/processor';
import { LoginToBSky } from './api/bsky';
import { fetchRSSFeed } from './api/pitchfork';

const startBot = async () => {
  console.log('Starting Mar...');
  await LoginToBSky();
  //10am and 4pm pst every day
  cron.schedule(
    '0 10, 16 * * *',
    async () => {
      await fetchAndProcessReviews();
    },
    { timezone: 'America/Los_Angeles' }
  );
};

startBot();

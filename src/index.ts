import cron from 'node-cron';
import { fetchAndProcessReviews } from './services/processor';
import { LoginToBSky } from './api/bsky';

const startBot = async () => {
  console.log('Starting Mar...');
  await LoginToBSky();

  //6am, 2pm, and 4pm pst every day
  cron.schedule(
    '0 11,15 * * *',
    async () => {
      await fetchAndProcessReviews();
    },
    { timezone: 'America/Los_Angeles' }
  );
};

startBot();

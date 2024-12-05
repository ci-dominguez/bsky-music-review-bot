import SpotifyWebApi from 'spotify-web-api-node';
import { db } from '../db/db';
import { desc } from 'drizzle-orm';
import { spotifyTokens } from '../db/schema';
import { SpotifyTokens } from '../interfaces';
import * as dotenv from 'dotenv';

dotenv.config();

const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: process.env.SPOTIFY_REDIRECT_URI,
});

export const storeTokens = async (
  accessToken: string,
  refreshToken: string,
  expiresIn: number
) => {
  try {
    const expiresAt = new Date(Date.now() + expiresIn * 1000);
    await db
      .insert(spotifyTokens)
      .values({ accessToken, refreshToken, expiresAt });
  } catch (error) {
    console.error('Error storing tokens:', error);
    throw error;
  }
};

export const getStoredTokens = async (): Promise<SpotifyTokens> => {
  try {
    const tokens = await db
      .select()
      .from(spotifyTokens)
      .orderBy(desc(spotifyTokens.expiresAt))
      .limit(1);
    return tokens[0];
  } catch (error) {
    console.error('Error getting tokens:', error);
    throw error;
  }
};

export const refreshAccessTokenIfNeeded = async () => {
  const storedTokens = await getStoredTokens();

  if (new Date() >= storedTokens.expiresAt) {
    spotifyApi.setRefreshToken(storedTokens.refreshToken);
    const data = await spotifyApi.refreshAccessToken();
    const newAccessToken = data.body['access_token'];
    const expiresIn = data.body['expires_in'];

    await storeTokens(newAccessToken, storedTokens.refreshToken, expiresIn);
    spotifyApi.setAccessToken(newAccessToken);
    console.log('Access token refreshed');
  } else {
    spotifyApi.setAccessToken(storedTokens.accessToken!);
  }
};

export const getTrackOrAlbumLink = async (): Promise<string> => {
  return '';
};

//Initial code to get auth url + access code from spotify
// const authURL = spotifyApi.createAuthorizeURL(
//   ['playlist-modify-public'],
//   'state-key'
// );
// console.log('Auth URL:', authURL);

// export const getAccessToken = async (authCode: string) => {
//   try {
//     const data = await spotifyApi.authorizationCodeGrant(authCode);
//     const accessToken = data.body['access_token'];
//     const refreshToken = data.body['refresh_token'];

//     console.log('Access Token:', accessToken);
//     console.log('Refresh Token:', refreshToken);
//   } catch (error) {
//     console.error('Error exchanging authorization code:', error);
//   }
// };

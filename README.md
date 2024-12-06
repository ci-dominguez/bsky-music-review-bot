# 🎵 Bluesky Music Review Bot

[Mar](https://bsky.app/profile/mar.xinthem.com) is a bot designed for [Bluesky](https://bsky.app). In short, it monitors album and track review rss feeds by [Pitchfork](https://pitchfork.com/info/rss/) and posts them to Bluesky on a schedule (9am, 2pm, and 7pm PST daily) using node-cron. It also uses the spotify web api node wrapper to retrieve track and album links for users to listen on. Throughout this process reviews and other data obtained are stored in a postgresql database on [neon](https://neon.tech/). The bot is currently deployed on [fly.io](https://fly.io).

## Made with some really cool tools 👇

- 🟦 [Typescript](https://www.typescriptlang.org/)
- 🟢 [Node.js](https://nodejs.org/en)
- 🌐 [AT Protocol](https://atproto.com/)
- 🌐 [Axios](https://axios-http.com/)
- ☔ [Drizzle ORM](https://orm.drizzle.team/)
- 💡 [Neon](https://neon.tech/)
- 🎧 [Spotify Web Api](https://github.com/thelinmichael/spotify-web-api-node)
- 🤖 [Node-cron](https://www.npmjs.com/package/node-cron)
- 📸 [Sharp](https://github.com/lovell/sharp)
- 🔰 [Xml2js](https://www.npmjs.com/package/xml2js)
- 📰 [Pitchfork RSS Feeds](https://pitchfork.com/info/rss/)

## Local Setup ⚙

1. Clone the repo

2. Create a `.env` file in the root directory of the project and add the following variables:

```
BSKY_HANDLE=
BSKY_PASSWORD=
DATABASE_URL=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
SPOTIFY_INITIAL_AUTH_CODE=
SPOTIFY_REDIRECT_URI=http://localhost:8888/callback
```

3. Run `npm install` to install the dependencies

4. Run `npm run db:generate` then run `npm run db:push` to update your database schema

5. Uncomment the spotify auth code in `index.ts` and `spotify.ts`, and comment out the node cron job.

6. Run `npm run start` to startup the bot with ts-node

7. Open the link in the terminal to get the initial auth code and update `SPOTIFY_INITIAL_AUTH_CODE`

8. Run `npm run start` again to obtain your first set of Access and Refresh tokens.

9. Comment out spotify auth code and uncomment the node cron job in `index.ts`

10. Run `npm run start` again to start the bot.

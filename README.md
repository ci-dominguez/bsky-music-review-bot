# 🎵 Bluesky Music Review Bot

[Mar](https://bsky.app/profile/mar.xinthem.com) is a bot designed for [Bluesky](https://bsky.app). In short, it monitors album and track review rss feeds by [Pitchfork](https://pitchfork.com/info/rss/) and posts them to Bluesky on a schedule (6am, 2pm, and 4pm PST) using node-cron. It also stores the reviews, spotify links, and post links in a postgreSQL database. The bot is currently deployed on [fly.io](https://fly.io).

## Made with some really cool tools 👇

- 🟦 [Typescript](https://www.typescriptlang.org/)
- 🟢 [Node.js](https://nodejs.org/en)
- 🌐 [AT Protocol](https://atproto.com/)
- 🌐 [Axios](https://axios-http.com/)
- ☔ [Drizzle ORM](https://orm.drizzle.team/)
- 💡 [Neon](https://neon.tech/)
- 🤖 [Node-cron](https://www.npmjs.com/package/node-cron)
- 🔰 [Xml2js](https://www.npmjs.com/package/xml2js)
- 📰 [Pitchfork RSS Feeds](https://pitchfork.com/info/rss/)

## Local Setup ⚙

1. Clone the repo

2. Create a `.env` file in the root directory of the project and add the following variables:

```
BSKY_HANDLE=
BSKY_PASSWORD=
DATABASE_URL=
```

3. Run `npm install` to install the dependencies

4. Run `npm run start` to startup the bot with ts-node

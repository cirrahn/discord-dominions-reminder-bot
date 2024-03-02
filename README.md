# Discord Dominions Reminder Bot

A basic bot which will ping players when their turn is ready, and ping each day with a reminder for all unplayed turns.

## Setup

1) `npm i`
2) Go to Discord's Developer Portal [Applications](https://discord.com/developers/applications) page, and create an Application. Generate a bot token for that application.
3) `cp credentials-sample.json credentials.json` and edit to contain your token
4) `cp games-sample.json games.json` and edit to contain your nation names and matching Discord IDs
5) `cp config-sample.json config.json` and edit to contain your Discord channel ID
6) `npm run start`

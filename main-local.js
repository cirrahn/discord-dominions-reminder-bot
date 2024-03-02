import * as fs from "fs";
import * as cron  from "node-cron";
import {Client, GatewayIntentBits} from "discord.js";
import {ReminderTask} from "./src/ReminderTask.js";
import {Config} from "./src/Config.js";

const token = JSON.parse(fs.readFileSync("credentials.json", "utf-8")).token;

class _DiscordBot {
	_client;

	async pRun () {
		this._client = new Client({ intents: [GatewayIntentBits.GuildMessageTyping] });

		this._client
			.on("ready", async () => {
				console.log(`Logged in as ${this._client.user.tag}!`);

				cron.schedule(Config.CHRON_DAILY, () => ReminderTask.getDailyTask({discord: this}).pRun());
				cron.schedule(Config.CHRON_POLLING, () => ReminderTask.getPollEndTurnTask({discord: this}).pRun());

				console.log("Running on-startup task...");
				await ReminderTask.getDailyTask({discord: this}).pRun();
			});

		await this._client.login(token);
	}

	async pGetChannel ({channelId}) {
		try {
			return (await this._client.channels.fetch(channelId));
		} catch (e) {
			return null;
		}
	}
}

new _DiscordBot().pRun().then(null);

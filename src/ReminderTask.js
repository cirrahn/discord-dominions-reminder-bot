import * as fs from "fs";
import {GameInfo} from "./GameInfo.js";
import {StatusPageAdapter} from "./StatusPageAdapter.js";

const channelId = JSON.parse(fs.readFileSync("config.json", "utf-8")).channelId;

export class ReminderTask {
	static _CURRENT_TURNS = {};

	/* -------------------------------------------- */

	static getDailyTask ({discord}) {
		return new this({
			discord,
			scope: "daily",
			prefix: `You've got some turning to do, `,
			isForce: true,
		});
	}

	static getPollEndTurnTask ({discord}) {
		return new this({
			discord,
			scope: "polling",
			prefix: `The wheel turns once again `,
		});
	}

	/* -------------------------------------------- */

	_discord;
	_scope;
	_prefix;
	_isForce;

	constructor (
		{
			discord,
			scope,
			prefix,
			isForce = false,
		}
	) {
		this._discord = discord;
		this._scope = scope;
		this._prefix = prefix;
		this._isForce = isForce;
	}

	async pRun () {
		try {
			await this._pRun();
		} catch (e) {
			console.error(`Error when running scheduled task (${this._scope})`, e);
		}
	}

	async _pRun () {
		console.log(`Running scheduled task (${this._scope})...`);

		const gameInfos = JSON.parse(fs.readFileSync("./games.json", "utf-8"))
			.filter(it => !it.isDisabled)
			.map(it => new GameInfo(it));

		const reminderTextResults = await Promise.allSettled(
			gameInfos
				.map(async gameInfo => {
					const pageAdapter = new StatusPageAdapter({gameInfo});
					const gameState = await pageAdapter.pGetGameState();

					const isRun = this._isForce
						|| gameState.isFreshTurn(this.constructor._CURRENT_TURNS[gameState.name])
					this.constructor._CURRENT_TURNS[gameState.name] = gameState.turn;
					if (!isRun) return

					return gameState.getReminderText({prefix: this._prefix});
				})
		);

		const reminderTexts = reminderTextResults
			.filter(res => res.status === "fulfilled")
			.map(res => res.value)
			.filter(Boolean);

		if (!reminderTexts.length) return;

		const channel = await this._discord.pGetChannel({channelId: channelId});
		for (const txt of reminderTexts) await channel.send(txt);
	}
}

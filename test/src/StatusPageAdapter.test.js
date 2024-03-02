import {StatusPageAdapter} from "../../src/StatusPageAdapter.js";
import * as fs from "fs";
import {GameInfo} from "../../src/GameInfo.js";

test(
	"Game info is parsed from HTML",
	async () => {
		const gameInfo = new GameInfo(
			JSON.parse(fs.readFileSync("test/data/games.json", "utf-8"))[0],
		);
		const html = fs.readFileSync("test/data/status.html");

		const adapter = new StatusPageAdapter({
			gameInfo: gameInfo,
		});

		const gameState = adapter._getGameState({html});

		expect(gameState.name).toBe(`Test Game`);
		expect(gameState.turn).toBe(2);
		expect(gameState.playerMetas).toStrictEqual([
			{
				"discordId": "123456789123456789",
				"nationName": "Kailasa, Rise of the Ape Kings",
			},
			{
				"discordId": "123456789123456789",
				"nationName": "R'lyeh, Time of Aboleths",
			},
		]);
	},
);

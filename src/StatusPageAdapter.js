import * as cheerio from "cheerio";
import {GameState} from "./GameState.js";

export class StatusPageAdapter {
	_gameInfo;

	constructor (
		{
			gameInfo,
		}
	) {
		this._gameInfo = gameInfo;
	}

	async _pGetHtml () {
		try {
			const response = await fetch(this._gameInfo.statusPage);
			return (await response.text());
		} catch (e) {
			console.error(`Failed to fetch HTML`, e);
			return null;
		}
	}

	async pGetGameState () {
		const html = await this._pGetHtml();
		return this._getGameState({html});
	}

	_getGameState ({html}) {
		return new GameState({
			...this._getNameAndTurn({html}),
			playerMetas: this._getPlayerMetas({html}),
		});
	}

	_getNameAndTurn ({html}) {
		const $ = cheerio.load(html);

		const [nameText, turnText] = $(`table tr td[class="blackbolddata"]`)
			.text()
			.split(", ")
			.map(it => it.trim())
			.filter(Boolean);

		const mTurn = /turn (?<turn>\d+)/.exec(turnText);
		if (!mTurn) throw new Error(`Could not find turn text in "${turnText}"!`);

		return {
			name: nameText
				.replace(/_/g, " ")
				.replace(/ +/g, " "),
			turn: Number(mTurn.groups.turn),
		};
	}

	_getPlayerMetas ({html}) {
		const $ = cheerio.load(html);

		return $(`table tr`)
			.map((i, e) => {
				const [$tdNation, $tdStatus] = $(e).find("td").map((i, e) => $(e)).get();
				if ($tdNation.attr("colspan")) return null;

				const status = $tdStatus.text().trim();
				if (
					status === "AI"
					|| status === "Turn played"
					|| status === "Eliminated"
				) return null;

				const nationName = $tdNation.text().trim();


				if (!this._gameInfo.nationLookup[nationName]) throw new Error(`Unknown nation name "${nationName}"`);

				return {
					discordId: this._gameInfo.nationLookup[nationName],
					nationName,
				}
			})
			.get()
			.filter(Boolean)
	}
}

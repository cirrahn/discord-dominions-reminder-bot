export class GameInfo {
	constructor (gameInfo) {
		this._gameInfo = gameInfo;

		this._nationLookup = Object.fromEntries(
			gameInfo
				.players.map(({nation, discordId}) => [nation, discordId]),
		);
	}

	get statusPage () { return this._gameInfo.statusPage; }
	get nationLookup () { return this._nationLookup; }
}

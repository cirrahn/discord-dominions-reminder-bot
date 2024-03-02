export class GameState {
	name;
	playerMetas;
	turn;

	constructor (
		{
			name,
			playerMetas,
			turn,
		}
	) {
		this.name = name;
		this.playerMetas = playerMetas;
		this.turn = turn;
	}

	isFreshTurn (prevTurn) {
		return prevTurn == null
			|| this.turn !== prevTurn;
	}

	getReminderText ({prefix}) {
		if (!this.playerMetas.length) return null;
		return `:wheel_of_dharma: **“${this.name}”** ~ ${prefix}${this.playerMetas.map(pm => `<@${pm.discordId}> (_${pm.nationName}_)`).join(", ")}! :wheel_of_dharma:`;
	}
}

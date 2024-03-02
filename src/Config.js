export class Config {
	static IS_PROD = false;

	static CHRON_POLLING = this.IS_PROD
		// Every minute
		? "*/1 * * * *"
		// Every 10th second
		: "*/10 * * * * *";

	static CHRON_DAILY = this.IS_PROD
		// Daily at 8pm
		? "0 20 * * *"
		// Every 10th minute
		: "*/10 * * * *";
}

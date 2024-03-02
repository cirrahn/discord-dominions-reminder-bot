import * as fs from "fs";
import Ajv2020 from "ajv/dist/2020.js";

function main () {
	const ajv = new Ajv2020({
		allowUnionTypes: true,
	});

	ajv.addSchema(JSON.parse(fs.readFileSync("test/games.schema.json", "utf-8")), "games");
	const isValid = ajv.validate("games", JSON.parse(fs.readFileSync("games.json", "utf-8")));

	if (isValid) return;

	ajv.errors.forEach(err => console.error(err));

	process.exit(1);
}

main();

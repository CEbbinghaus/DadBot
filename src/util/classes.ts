import { Guild } from "discord.js";
import * as fs from "fs";

const Rules = fs.readdirSync("./rules/").filter(v => !v.endsWith(".js.map")).map(v => require("../rules/" + v));

export class Server{
	id: string = null;
	name: string = null;
	settings: object;

	constructor(original: Server | Guild = {} as Server){
		this.id = original.id || null;
		this.name = original.name || null;
		fs.readdirSync("./rules");
		for(let i in Rules){
			let rule = Rules[i];
			//@ts-ignore
			this.settings[rule.setting] = original.settings ? original.settings[rule.setting] : true;
		}
	}
}
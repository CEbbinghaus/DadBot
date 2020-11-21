import { Guild } from "discord.js";
import * as fs from "fs";
import {rule} from "../definitions";

const Rules = fs.readdirSync("./rules/").filter(v => !v.endsWith(".js.map")).map(v => require("../rules/" + v)).filter(v => !!v);

export class Server{
	id: string = null;
	name: string = null;
	/**
	 * @type {{string: boolean}}
	 */
	settings: object = {};

	constructor(original: Server | Guild = {} as Server){
		this.id = original.id || null;
		this.name = original.name || null;
		//@ts-ignore
		this.settings = original.settings || {};

		if(Object.keys(this.settings).length == 0)
			for(let i in Rules){
				let rule = Rules[i];
				if(!rule || !rule.setting)continue;
				//@ts-ignore
				this.settings[rule.setting] = true;
			}
	}
}
import { Client, Message, User } from "discord.js";
import { helpReact } from "./util/interractions";
import { checkPermissions } from "./util/utilities";
import { CachedDataBase } from "./util/database";
// import {Server} from "./util/classes"
import * as Settings from "./settings.json";
import DBLAPI from "dblapi.js";
import * as fs from "fs";
import { Server } from "./util/classes";

const dbl = Settings.DBLToken && new DBLAPI(Settings.DBLToken);
// const {Client} = require("discord.js");
// const {helpReact} = require("./util/interractions")
// const {checkPermissions} = require("./util/utilities");
// const {CachedDataBase} = require("./util/database");
// const {Server} = require("./util/classes");
// //Importing Settings Such as Token
// const Settings = require("./settings.json");
// const dbl = new (require('dblapi.js'))(Settings.DBLToken);
// var fs = require('fs');

export class Bot extends Client {
	inDevelopment: boolean = Settings.DEV;
	commands: any[];
	rules: any[];
	DataBase: CachedDataBase;
	UnderMaintenence: boolean = Settings.maintenence || false;
	ready: boolean = false;
	owner: User;

	constructor() {
		super();
		this.DataBase = new CachedDataBase({
			host: Settings.Host,
			database: "Bots",
			collection: "DadBot",
			auth: { username: Settings.Username, password: Settings.Password },
		});

		this.on("guildCreate", this.GuildCreate.bind(this));
		this.on("guildDelete", this.GuildDelete.bind(this));
		this.on("ready", this.Ready.bind(this));
		this.on("message", this.Message.bind(this));
	}

	GetUsers() {
		return this.guilds.cache
			.map((g) => g.memberCount)
			.reduce((a, b) => a + b);
	}

	async GetTotalUsers() {
		return (await this.shard.broadcastEval("this.GetUsers()")).reduce(
			(prev, val) => prev + val,
			0
		);
	}

	async SetActivity() {
		if (this.UnderMaintenence)
			this.user.setActivity("Currently Under Maintenence", {
				type: "PLAYING",
			});
		else {
			let servers = await this.GetTotalServers();
			this.user.setActivity(`${servers} Servers`, { type: "WATCHING" });
		}
	}

	async SetMaintenence(m, b = null) {
		this.UnderMaintenence = m;
		if (b) return;
		await this.shard.broadcastEval(
			`if(this.shard.id != ${this.shard.ids[0]})this.SetMaintenence(${m}, true);this.SetActivity();`
		);
		this.SetActivity();
		return;
	}

	async GetTotalServers() {
		return (await this.shard.broadcastEval("this.guilds.cache.size")).reduce(
			(prev, val) => prev + val,
			0
		);
	}

	LoadCommands() {
		this.commands = fs
			.readdirSync("./commands/")
			.filter((v) => !v.endsWith(".js.map"))
			.map((v) => {
				delete require.cache[require.resolve("./commands/" + v)];
				const command = require("./commands/" + v).default;
				return command;
			})
			.filter(v => !!v)
			.sort((a, b) => a.command.weight - b.command.weight);
	}

	LoadRules() {
		this.rules = fs.readdirSync("./rules/")
		.filter((v) => !v.endsWith(".js.map"))
		.map((v) => {
			delete require.cache[require.resolve("./rules/" + v)];
			const rule = require("./rules/" + v).default;
			return rule;
		})
		.filter(v => !!v);
	}

	Ready() {
		this.fetchApplication().then((a) => {
			this.owner = a.owner as User;
		});
		this.LoadCommands();
		this.LoadRules();

		//Logging amount of servers and members
		console.log(
			`${this.user.username}: Started Shard ${this.shard.ids[0]} on ${
				this.guilds.cache.size
			} servers for a total of ${this.GetUsers()} members`
		);
		
		if (dbl && !this.inDevelopment)
			dbl.postStats(
				this.guilds.cache.size,
				this.shard.ids[0],
				this.shard.count
			).then(() => console.log("Published Stats to DBL"));

		this.SetActivity();
		// await this.DataBase.modifySchema(new Server());
		this.ready = true;
	}

	async Message(message: Message) {
		if (!this.owner || !this.ready) return;

		if (message.author.bot) return;

		if (
			(this.UnderMaintenence || this.inDevelopment) &&
			message.author.id != this.owner.id
		)
			return;

		let server =
			message.channel.type == "dm"
				? new Server()
				: await this.DataBase.read({ id: message.guild.id });
		if (!server) {
			server = new Server(message.guild);
			this.DataBase.write(server);
		}
		if (message.mentions.has(this.user) || message.channel.type === "dm") {
			if (
				!(
					message.channel.type == "dm" ||
					message.channel
						.permissionsFor(message.guild.me)
						.has(["SEND_MESSAGES", "ADD_REACTIONS", "EMBED_LINKS"])
				)
			)
				return message.author.send(
					"I need the SendMessage, AddReaction and Embed Link permission to be able to use this command. please contact a server owner"
				);

			for (let i in this.commands) {
				let cmd = this.commands[i];
				if (cmd.command.regex != null) {
					if (cmd.command.regex.exec(message.content)) {
						cmd.command.regex.lastIndex = 0;

						if (!checkPermissions(cmd.help, message, this)) return;

						try {
							let e = cmd.command.run(this, message, server);
							if (e instanceof Promise)
								e.catch((err) => {
									helpReact(message, err.toString());
								});
							return;
						} catch (err) {
							helpReact(message, err.toString());
						}
						return;
					}
				}
			}
		}

		if (
			!(
				message.channel.type == "dm" ||
				message.channel
					.permissionsFor(message.guild.me)
					.has(["SEND_MESSAGES"])
			)
		)
			return;
		let rules = this.rules.filter(
			(v) => server.settings && server.settings[v.setting] == true
		);
		for (let rule of rules) {
			let results = rule.regex.exec(message.content);
			rule.regex.lastIndex = 0;
			if (results) {
				results.shift();
				rule.execute(this, message, results);
			}
		}
	}

	GuildCreate(g) {
		let server = new Server(g);
		this.DataBase.write(server, () => {
			g.owner.send(
				"Hello there. Thanks for Inviting DadBot to your server. Use `@dadbot Toggle` to get all of the automatic replies and use `@dadbot toggle [Setting]`. Other than that you will want to check out the commands with `@dadbot help`"
			);
			this.SetActivity();
		});
	}

	async GuildDelete(g) {
		if (await this.DataBase.exists({ id: g.id })) {
			this.DataBase.delete({ id: g.id });
			this.SetActivity();
		}
	}
}

const instance = new Bot();
instance.login(Settings.token);

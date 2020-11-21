import { Message } from "discord.js";
import { rule } from "../definitions";

export default {
	name: "im",
	default: true,
	desk: "Responds to any im (words) with Hi (words)",
	setting: "HIIMDAD",
	regex: /\bi([‘'`’\u2018\u2019]|)m\s(.+)/gi,
	execute: function(Bot, message, match) {
		const name =
			!message.guild.me.nickname || message.guild.me.nickname == "Dad Bot"
				? "Dad"
				: message.guild.me.nickname;

		message.channel.send(`Hello ${match[1]}, I'm ${name}!`);
	},
} as rule;
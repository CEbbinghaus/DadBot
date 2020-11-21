import rule from "./hi";

export default {
	default: false,
	name: "Profanities",
	desk: "Tells People that they shouldnt say bad words",
	setting: "PROFANITY",
	regex: /[^!@#$%^&*]*(asshole|cunt|dick|faggot|fuck|shit|nigger)[^!@#$%^&*]*/gi,
	execute: function(Bot, message, match) {
		message.channel.send(`Watch your language`);
	}
} as rule;

import { Message, MessageReaction } from "discord.js";

export const Constants = {
    done: "✅",
    failed: "❌",
    help: "❓",
    denied: "⛔",
    timeout: 5e3
}

export async function React(message: Message, emoji, response, user = null){
    let r = await message.react(emoji);
    let collector = message.createReactionCollector((reac, usr) => reac.emoji.name == emoji && (usr.id == (user?user:message.author.id) /*|| usr.id == settings.owner*/), {time: 6e4 * 5})
    collector.on("collect", (mr) => {
      r.remove();
	  if(message.channel.type != "dm" && message.guild.me.hasPermission(["MANAGE_MESSAGES"]))
	  	r.remove();
      if(typeof response != "function"){
        message.channel.send(response);
      }else response(mr);
      collector.stop()
    });
    return r;
  } 

export async function Confirm(messsage, timeout = Constants.timeout){
    let reaction = await messsage.react(Constants.done);
    setTimeout(() => reaction.remove(), timeout);
}


export async function Deny(messsage, timeout = Constants.timeout){
    let reaction = await messsage.react(Constants.denied);
    setTimeout(() => reaction.remove(), timeout);
}

export async function helpReact(message, error){
    React(message, Constants.failed, () => {
        message.clearReactions();
    });
    React(message, Constants.help, error);
}
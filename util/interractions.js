const Reaction = {
    done: "✅",
    failed: "❌",
    help: "❓",
    denied: "⛔",
    timeout: 5e3
}
const {MessageReaction, Message} = require("discord.js")
module.exports.Constants = Reaction;
const React = async (message = new Message(), emoji, response, user) => {
    let r = await message.react(emoji);
    let collector = message.createReactionCollector((reac, usr) => reac.emoji.name == emoji && (usr.id == (user?user:message.author.id) /*|| usr.id == settings.owner*/), {time: 6e4 * 5})
    collector.on("collect", (mr = new MessageReaction()) => {
      r.remove();
      if(message.channel.type != "dm" && message.guild.me.hasPermission(["MANAGE_MESSAGES"]))r.remove(message.author);
      if(typeof response != "function"){
        message.channel.send(response);
      }else response(mr);
      collector.stop()
    });
    return r;
  } 
module.exports.ReactMessage = React;
const ConfirmAction = async (messsage, timeout = Reaction.timeout) => {
    let reaction = await messsage.react(Reaction.done);
    setTimeout(() => reaction.remove(), timeout);
}
module.exports.Confirm = ConfirmAction;
const DenyAction = async (messsage, timeout = Reaction.timeout) => {
    let reaction = await messsage.react(Reaction.denied);
    setTimeout(() => reaction.remove(), timeout);
}
module.exports.Deny = DenyAction;
const failHelp = async (message, error) => {
    React(message, Reaction.failed, () => {
        message.clearReactions();
    });
    React(message, Reaction.help, error);
}
module.exports.helpReact = failHelp;
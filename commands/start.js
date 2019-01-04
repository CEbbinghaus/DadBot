module.exports = {
  help: {
    perms: ["ADMINISTRATOR"],
    owner: false,
    server: true,
    name: "start [DEPRECHIATED]",
    desk: "Starts the bot's replying function",
    category: "Server"
  },
  command: {
    weight: 500,
    regex: /start/ig,
    run: (bot, message, settings) => {
      message.reply("This Command is Deprechiated. Please use the toggle command instead. use the help command to find out more");
    }
  }
}
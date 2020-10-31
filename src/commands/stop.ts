export default {
    help: {
        perms: ["ADMINISTRATOR"],
        owner: false,
        server: true,
        name: "stop [DEPRECHIATED]",
        desk: "Stops the bot from replying",
        category: "Server"
    },
    command: {
        weight: 500,
        regex: /stop/ig,
        run: (bot, message, settings) => {
          message.reply("This Command is Deprechiated. Please use the toggle command instead. use the help command to find out more");
        }
    }
}
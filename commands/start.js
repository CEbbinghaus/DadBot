const {Confirm, Deny} = require("../util/interractions");
module.exports = {
    help: {
        perms: ["ADMINISTRATOR"],
        owner: false,
        server: true,
        name: "start",
        desk: "Starts the Bot for the Current Server"
    },
    command: {
        weight: 500,
        regex: /start/ig,
        run: (bot, message, settings) => {
            bot.ServerMap[message.guild.id] = true;
            bot.SaveServers(() => {
                Confirm(message);
            })
            return;
        }
    }
}
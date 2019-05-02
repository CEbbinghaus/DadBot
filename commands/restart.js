const Child = require("child_process");
const {Confirm, Deny} = require("../util/interractions");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "restart",
        desk: "Restarts the bot",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /restart/gi,
        run: (bot, message, settings) => {
            bot.shard.broadcastEval("process.exit()");
        }
    }
}

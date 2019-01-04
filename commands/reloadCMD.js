const {Confirm} = require("../util/interractions");
const fs = require("fs");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "reloadCMD",
        desk: "Reloads all Commands"
    },
    command: {
        weight: 500,
        regex: /rldCMD|reload|rld/ig,
        run: async (bot, message, settings) => {
            await bot.shard.broadcastEval("this.LoadRules(); this.LoadCommands()")
            Confirm(message);
        }
    }
}
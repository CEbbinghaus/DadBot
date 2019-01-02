const {Confirm} = require("../util/interractions");
const fs = require("fs");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "reloadCMD",
        desk: "testing"
    },
    command: {
        weight: 500,
        regex: /rldCMD|reload|rld/ig,
        run: (bot, message, settings) => {
            fs.readdirSync("./commands/").forEach(v => {
                try{
                    delete require.cache[require.resolve('./' + v)];
                }catch(e){console.log(e.message)}
            })
            bot.LoadCommands();
            Confirm(message);
        }
    }
}
const Child = require("child_process");
const {Constants, Confirm, Deny} = require("../util/interractions");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "update",
        desk: "Updates the bot",
        category: "Admin"
    },
    command: {
        weight: 500,
        regex: /update/ig,
        run: (bot, message, settings) => {
            Child.exec("git pull", () => {
                Child.exec("pm2 restart DadBot", () => {
                    Confirm(message);
                })
            })
        }
    }
}
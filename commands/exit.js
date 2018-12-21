const Child = require("child_process");
const {Constants, Confirm, Deny} = require("../util/interractions");
module.exports = {
    help: {
        perms: null,
        owner: true,
        server: false,
        name: "exit",
        desk: "removes the bot from the current PM2 context"
    },
    command: {
        weight: 500,
        regex: /exit/ig,
        run: (bot, message, settings) => {
            Child.exec("pm2 delete DadBot", (e, out, err) => {
                if (e) {
                    message.channel.send(e).then(() => {
                        Deny(message)
                    })
                } else {
                    Confirm(message)
                }
                return
            })
        }
    }
}